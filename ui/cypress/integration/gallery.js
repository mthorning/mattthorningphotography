describe('gallery', () => {
    let photos;
    before(() => {
        cy.visit('/photo')
        cy.request('photo.json').then(({ body }) => photos = body.photos)
    })
    
    it('renders every anchor tag', () => {
        cy.get('[data-test="gallery"]').within(() => {
            photos.forEach(photo => {
                cy.get(`a[href="/photo/${photo.slug}"]`).should('exist')
            })
        })
    })

    it('has images with the correct src url', () => {
        cy.get('[data-test="gallery"]').within(() => {
            cy.get('[data-test="thumbnail"] img').each(($img, i) => {
                expect($img.attr('src')).to.equal(photos[i].image.formats.small.url)
            })
        })
    })

    it('opens a fullsize image preview', () => {
        photos.slice(0, 5).forEach(photo => {
            cy.get(`[data-test="thumbnail"] [href="/photo/${photo.slug}`).click()
            cy.get('.overlay').should('be.visible')
            cy.get('[data-test="spinner"]').should('not.be.visible')
            cy.get('[data-test="lightbox"] img')
                .should('be.visible')
                .invoke('attr', 'src')
                .should('eq', photo.image.url)
            cy.get('body').type('{esc}')
            cy.get('.overlay').should('not.exist')
        })
    })

    it('shows changes fullsize images with arrow keys', () => {
        cy.get('[data-test="thumbnail"]').first().find('img').should('have.class', 'loaded').click({ force: true });

        cy.get('[data-test="lightbox"] img').should('have.attr', 'src').then(firstImg => {
                cy.repeat(() => {
                    cy.get('body').type('{leftarrow}')    
                    cy.get('[data-test="lightbox"] img').should('have.attr', 'src').and('not.eq', firstImg)
                }, 10)
                cy.repeat(() => {
                    cy.get('body').type('{rightarrow}')    
                }, 10)
            cy.get('[data-test="lightbox"] img').should('have.attr', 'src').and('eq', firstImg)
        })
    })

    it('closes fullsize image on escape press', () => {
        cy.get('body').type('{esc}')
        cy.get('[data-test="lightbox"]').should('not.exist')
        cy.get('[data-test="gallery"]').should('exist')
    })

});
