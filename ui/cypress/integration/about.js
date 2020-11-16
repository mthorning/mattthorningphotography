describe('about page', () => {
    beforeEach(() => {
        cy.visit('/')
        cy.get('nav a[href="/about"]').click()
    })

    it('shows photo', () => {
        cy.get('[data-test="photo"]').should('be.visible').and('have.css', 'background')
        })

    it('shows some gibberish', () => {
        cy.get('[data-test="some-gibberish"]').should('be.visible')
    })

    it('shows gear list', () => {
        cy.get('[data-test="gear-list"]').should('be.visible')
    })

    it('links to contact page', () => {
        cy.get('[data-test="some-gibberish"]').find('a[href="/contact"]').click()
        cy.wait(500)
        cy.get('h1').contains('Contact').should('be.visible')
    })
})
