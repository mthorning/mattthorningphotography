describe('contact form', () => {
const name = 'CYPRESS TEST'
    const email = 'tester@cypress.com'
    const message = 'Test message from integration tests'

    before(() => cy.visit('/contact'))

    it('sends the form data', () => {
        cy.get('input#name').type(name)
        cy.get('input#email').type(email)
        cy.get('textarea#message').type(message)

        cy.intercept('POST', '/contact').as('contactRequest')
        cy.get('button[type="submit"]').click()

        cy.wait('@contactRequest').then(({ request }) => {
            expect(request.body.from).to.equal(email)
            expect(request.body.subject).to.equal(`Message from ${name}`)
            expect(request.body.html).to.equal(`\n            <pre>${message}</pre>\n            <hr />\n            <a href="mailto:${email}">${email}</a>\n            `)

            cy.location().then(({ pathname, search }) => {
                expect(pathname).to.equal('/thankyou')
                expect(search).to.equal('?type=message')
            })
        })


    });
})
