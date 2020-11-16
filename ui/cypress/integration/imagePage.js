describe('image page', () => {
    let pageData

const title = text => text.substr(9).replace(/_/g, ' ')

    before(() => {
        cy.visit('/gallery')
        cy.get('[data-test="thumbnail"]').first().click()
        cy.repeat(() => cy.get('body').type('{leftarrow}'), 15)
        cy.get('[data-test="lightbox"] img').then($el => {
            const src = $el.attr('src').split('/').slice(-1)[0]
            cy.request(`localhost:3000/image/${src.replace('jpg', 'json')}`).then(res => {
            pageData = res.body
            })
            $el.click()
        })
    })

    it('displays title', () => {
        cy.get('h1').contains(title(pageData.fileName))
    })

    it('shows the image', () => {
        cy.get(`img[src="images/fullsize/${pageData.fileName}.jpg"]`)
    })

    it('shows the meta', () => {
        const { apperture, shutter, iso, focalLength } = pageData.meta
        const info = `f${apperture} | ${shutter}sec | ISO ${iso} | ${focalLength}mm`
        cy.get('p').contains(info)
    })

    it('shows description', () => {
        cy.get('p').contains(pageData.meta.description)
    })

    it('displays purchase panel', () => {
        cy.get('[data-test="purchasePanel"]')
            .should('exist')
            .and('be.visible')

        cy.get('[data-test="purchasePanel"] td').should('have.length.greaterThan', 1)
        
        cy.get('.paypal-buttons').should('exist').and('be.visible')
        cy.get('[data-test="printInfo"]').should('exist').and('be.visible')
    })

    it('shows image fullsize on click', () => {
            cy.get(`img[src="images/fullsize/${pageData.fileName}.jpg"]`).click()
            cy.get('[data-test="lightbox"]')
                .should('be.visible')
                .find('img')
                .should('have.attr', 'src')
                .then(src => 
                    expect(src).to.equal(`images/fullsize/${pageData.fileName}.jpg`)
                )

            cy.get('body').type('{esc}')
            cy.get('[data-test="lightbox"]').should('not.be.visible')
    })

    const checkTitle = (name) =>
        cy.get('h1').contains(title(name)).should('exist').and('be.visible')

    it('goes to the next image', () => {
        cy.get('a').contains('next').click()
        checkTitle(pageData.next);
        cy.get('a').contains('previous').click()
        checkTitle(pageData.fileName)
    })

    it('goes to the next image', () => {
        cy.get('a').contains('previous').click()
        checkTitle(pageData.previous);
        cy.get('a').contains('next').click()
        checkTitle(pageData.fileName)
    })
})
