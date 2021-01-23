describe('about page', () => {
    before(() => cy.visit('/about'))

    it('shows photo', () => {
        cy.get('[data-test="photo"]').should('be.visible').and('have.css', 'background')
    })

    it('shows some gibberish', () => {
        cy.get('[data-test="some-gibberish"]').should('be.visible')
    })

    it('links to contact page', () => {
        cy.get('[data-test="some-gibberish"]').find('a[href="/contact"]').click()
        cy.wait(500)
        cy.get('h1').contains('Contact').should('be.visible')
    })
})
