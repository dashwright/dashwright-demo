describe('Cypress Browser Tests', () => {
  it('should load a webpage', () => {
    cy.visit('https://example.com');
    cy.title().should('include', 'Example');
  });

  it('should find element on page', () => {
    cy.visit('https://example.com');
    cy.get('h1').should('have.text', 'Example Domain');
  });

  it('should handle navigation', () => {
    cy.visit('https://example.com');
    cy.get('a').should('have.attr', 'href').and('include', 'iana.org');
  });

  it('should capture page content', () => {
    cy.visit('https://example.com');
    cy.document().its('body').should('contain', 'Example');
  });

  it('should work with browser commands', () => {
    cy.visit('https://example.com');
    cy.window().its('innerWidth').should('be.greaterThan', 0);
  });
});
