describe('home page', () => {
    beforeEach(() => cy.visit('/'))

    it('shows background image', () => cy.get('div').should('have.css', 'background'))

    it('shows watermark', () => cy.get('svg').should('be.visible'))
})
