describe('gallery', () => {
    before(() => cy.visit('/photo'))
    
    it('shows gallery', () => {
        cy.get('[data-test="gallery"]').should('exist')
    })

    it('shows fullsize images', () => {
        cy.get('[data-test="thumbnail"]').first().find('img').should('have.class', 'loaded').click();

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
