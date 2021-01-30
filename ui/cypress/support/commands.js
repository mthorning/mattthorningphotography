Cypress.Commands.add('repeat', (func, times) => {
    for(let i = 0; i < times; i++) {
        func()
    }
})

Cypress.Commands.add('load', () => {
    cy.get('[data-test="spinner"]',  {timeout: 10000} ).should('not.exist')
});

