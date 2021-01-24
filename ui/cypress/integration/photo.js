describe('photo page', () => {
    let data;
    before(() => {
        cy.visit('/photo')
        cy.get('[data-test="thumbnail"]').then(imgs => {
            const img = imgs.eq(Math.floor(Math.random() * imgs.length)).parents('a')
            const href = img.attr('href')
            cy.request(`${href}.json`).then(({ body }) => data = body)
            cy.visit(href)
        })
    })

    describe('Top section', () => {
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
});
