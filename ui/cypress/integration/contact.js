describe('contact form', () => {
const name = 'CYPRESS TEST'
    const email = 'tester@cypress.com'
    const message = 'Test message from integration tests'

    beforeEach(() => {
        cy.visit('/')
        cy.get('nav a[href="/contact"]').click();
    })

    it('sends the form data', () => {
        cy.get('input#name').type(name)
        cy.get('input#email').type(email)
        cy.get('textarea#message').type(message)
        cy.route2('/contact', req => {
            const { from, subject, html } = JSON.parse(req.body)
            console.log(from, subject, html)
            expect(from).to.equal(email)
            expect(subject).to.equal(`Message from ${name}`)
            expect(html).to.equal(`\n            <pre>${message}</pre>\n            <hr />\n            <a href="mailto:${email}">${email}</a>\n            `)
        })
        cy.get('button[type="submit"]').click()
    });
})
