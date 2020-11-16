describe('thank you page', () => {

    it('shows plain thanks', () => {
        cy.visit('/thankyou')
        cy.get('h1').contains('Thank you').should('be.visible')
    })

    it('shows thanks for message', () => {
        cy.visit('/thankyou?type=message')
        cy.get('h1').contains('Thank you for your message').should('be.visible')
    })

    it('shows thanks for purchase', () => {
        cy.visit('/thankyou?type=purchase')
        cy.get('h1').contains('Thank you for your purchase').should('be.visible')
    })

    it('shows thanks for purchase with order id', () => {
        const orderID = 'xxxxxxxxxxx'
        cy.visit(`/thankyou?type=purchase&order_id=${orderID}`)
        cy.get('h1').contains('Thank you for your purchase').should('be.visible')
        cy.get('p').contains(`Your order ID is ${orderID}`).should('be.visible')
    })
})
