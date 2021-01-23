describe('errors', () => {
    it('shows not found for invalid paths', () => {
        ['/', '/contact', '/about', '/photo'].forEach((path) => {
            cy.visit(`${path}/fjkdlsjfs`, { failOnStatusCode: false })
            cy.get('h1').contains('404').should('be.visible')
            cy.get('p').contains(/Not Found/i).should('be.visible')
        });
    })
})
