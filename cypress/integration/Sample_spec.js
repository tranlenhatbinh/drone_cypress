describe('My first test', function() {
  it('clicking "type" navigate to a new url', function() {
    cy.visit('https://example.cypress.io/')
    cy.contains('type').click()
    // should be on a new URL
    cy.url().should('include', '/commands/actions')

    // get an input, type into it and verify that the value has been updated
    cy.get('.action-email')
      .type('fake@gmail.com').should('have.value', 'fake@gmail.com')
  })
})
