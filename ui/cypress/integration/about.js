describe('about page', () => {
    let data
    before(() => {
        cy.request('/about.json').then(({ body }) => data = body)
        cy.visit('/about')
    })

    describe('about content', () => {

        function decodeHtml(html) {
            var txt = document.createElement("textarea");
            txt.innerHTML = html;
            return txt.value;
        }

        it('shows the title', () => {
            cy.get('h1').contains(data.about.title).should('be.visible')
        })

        it('shows photo', () => {
            cy.location().then(location => {
                const { origin } = location
            cy.get('[data-test="photo"]').should('be.visible').and('have.css', 'background-image', `url("${origin}${data.about.image.url}")`)
            })
        })

        it('shows some gibberish', () => {
            cy.get('[data-test="about-text"]').should('be.visible').and('have.html', decodeHtml(data.about.body))
        })

        it('links to contact page', () => {
            cy.get('p').contains('please contact me').find('a[href="/contact"]').click()
            cy.location().should(location => expect(location.pathname).to.eq('/contact'))
            cy.go('back')
        })
    })

    describe('gear list', () => {
        function loopItems(cb) {
            Object.entries(data.equipmentItems).forEach(([category, items]) => {

                cy.get(`[data-test="${category}"`).within(() => 
                    cb(category, items)
                )
            })
        }

        it('shows gear list header', () => {
            cy.get('h2').contains('Gear List').should('be.visible')
        })

        it('lists the categories', () => {
            loopItems(category => {
                const categoryName = category
                    .split('_')
                    .map((l) => `${l.charAt(0).toUpperCase()}${l.substr(1)}`)
                    .join(' ')

                cy.get('h3').contains(categoryName).should('be.visible')
            })
        })

        it('lists the items under the correct categories', () => {
            loopItems((_, items)  =>
                items.forEach(item => cy.get('li').contains(item).should('be.visible'))
                )
        })
    })
})

