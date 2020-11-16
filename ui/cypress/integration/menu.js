describe('mobile menu', () => {
    before(() => cy.visit('/'))

    function checkLinks() {
        ['home', 'gallery', 'about', 'contact'].forEach(link => 
            cy.get(`[data-test="menu-items"] a[href="/${link === 'home' ? '' : link}"]`).contains(link).should('be.visible')
        )
    }

    it('shows all links', () => {
        checkLinks()
    })

    it('shows a mobile menu', () => {
        cy.get('[data-test="menu-items"]').should('be.visible')
        cy.get('nav button').should('not.be.visible')
        cy.viewport('iphone-6')
        cy.get('[data-test="menu-items"]').should('not.be.visible')
        cy.get('nav button').should('be.visible')
    })

    it('opens mobile menu on click', () => {
        cy.visit('/')
        cy.viewport('iphone-6')
        cy.get('nav button').click()
        cy.get('[data-test="menu-items"]').should('be.visible')
        checkLinks()
        cy.get('nav button').click()
        cy.get('[data-test="menu-items"]').should('not.be.visible')
    })

    it('closes the mobile menu on page change', () => {
        cy.visit('/')
        cy.viewport('iphone-6')
        cy.get('nav button').click()
        cy.get('[data-test="menu-items"] a').eq(2).click()
        cy.get('nav button').should('be.visible')
        cy.get('[data-test="menu-items"]').should('not.be.visible')

    })
})
