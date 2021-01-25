describe('photo page', () => {
    let data;
    before(() => {
        cy.visit('/photo')
        cy.get('[data-test="thumbnail"] a').then(imgs => {
            const href = imgs.eq(Math.floor(Math.random() * imgs.length)).attr('href')
            cy.request(`${href}.json`).then(({ body }) => data = body)
            cy.visit(href)
        })
    })

    describe('details section', () => {
        it('displays the title', () => {
            cy.load()
            cy.get('h1').contains(data.photo.title).should('be.visible')
        })

        it('shows the image', () => {
            cy.get('[data-test="image-with-meta"] img').then($img => {
                expect($img.attr('src')).to.equal(data.photo.formats.medium.url)
                expect($img.attr('alt')).to.equal(data.photo.image.alternativeText || 'photograph')
            })
        })

        it('shows the exif data', () => {
           const { exif } = data.photo 

            if(exif.show) {
                cy.get('[data-test="exif"]').invoke('text').then(text => {
                    const parts = text.split(' | ')
                    expect(parts[0]).to.equal(`f${exif?.aperture ?? '-'}`)
                    expect(parts[1]).to.equal(exif?.bracketed ? 'bracketed' : `${exif?.shutter ?? '-'}sec`)
                    expect(parts[2]).to.equal(`ISO ${exif?.iso ?? '-'}`)
                    expect(parts[3]).to.equal(`${exif?.focalLength ?? '-'}mm`)
                })
            } else {
               cy.get('[data-test="exif"]').should('not.exist') 
            }
        })

        it('shows the description', () => {
            cy.get('p.description').should('have.text', data.photo.description)
        });
    });

    describe('print section', () => {

        function ifEnabled(selector, tests) {
            const { print: { enabled, printSizes }, photo: { sell, id } } = data
            if(enabled && sell && id && printSizes.length) {
                tests()
            } else {
                selector.should('not.exist')
            }
        }

        it('shows the prints header', () => {
            const selector = cy.get('h2').contains('Prints')
            ifEnabled(selector, () => selector.should('be.visible'))
        })

        it('shows the prints paragraph', () => {
            const selector = cy.get('p').contains('This image is available for purchase as a print in the following sizes:')
            ifEnabled(selector, () => selector.should('be.visible'))
        })


        it('shows the available print sizes', () => {
            cy.get('[data-test="purchasePanel"]').within(() => {

                ['Size (in)', 'Size (mm)', 'Price'].forEach(header => 
                    cy.get('th').contains(header).should('be.visible')
                )

                data.print.printSizes.forEach(({ x, y, price }, i) => {
                    const row = () => cy.get('tr').eq(i)
                    row().find('td > input[type="radio"]').should('be.visible')
                    row().find('td').contains(`${x} x ${y}`).should('be.visible')
                    row().find('td').contains(`${Math.round(x * 25.4)} x ${Math.round(y * 25.4)}`).should('be.visible')
                    row().find('td').contains(`£${price}`).should('be.visible')
                })
            })
        })

        it('shows the PayPal button', () => {
            cy.get('[data-test="paypalButton"]').should('be.visible')
        })

        it('shows the print info', () => {
            cy.get('[data-test="printInfo"]').invoke('html').should('eq', data.print.info)
        })
    })

    describe('horizontal gallery', () => {
        before(() => 
            cy.scrollTo('bottom')
        )

        it('displays the correct thumbnail links', () => {
            cy.get('[data-test="hzGallery"]').within(() => {
                data.thumbs.filter((thumb) => thumb.slug !== data.photo.slug).forEach((thumb, i) => {
                    cy.get('[data-test="thumbnail"] a').eq(i).invoke('attr', 'href').should('eq', `/photo/${thumb.slug}`)
                })
            })
        })

        it('should show correct img src', () => {
            cy.get('[data-test="hzGallery"]').within(() => {
                cy.get('[data-test="thumbnail"] img').each($img => {
                    expect(data.thumbs.filter(thumb => thumb?.image?.formats?.thumbnail?.url === $img.attr('src')).length).to.equal(1)
                })
            })
        })

        it('should not show the current photo', () => {
            cy.get('[data-test="hzGallery"]').within(() => {
                cy.get(`a[href="/photo/${data.photo.slug}"]`).should('not.exist')
            })
        })
    })
});
