const BASE_URL = 'https://the-internet.herokuapp.com/login';
const USERNAME = 'tomsmith';
const PASSWORD = 'SuperSecretPassword!';

describe('Swag Login - Cypress', () => {
  beforeEach(() => {
    cy.visit(BASE_URL);
  });

  it('should display login form', () => {
    cy.get('#username').should('be.visible');
    cy.get('#password').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('should login with valid credentials', () => {
    cy.get('#username').type(USERNAME);
    cy.get('#password').type(PASSWORD);
    cy.get('button[type="submit"]').click();
    cy.get('.flash.success').should('contain', 'You logged into a secure area');
  });

  it('should fail login with invalid credentials', () => {
    cy.get('#username').type('invalid');
    cy.get('#password').type('invalid');
    cy.get('button[type="submit"]').click();
    cy.get('.flash.error').should('contain', 'Your username is invalid');
  });

  it('should logout successfully', () => {
    cy.get('#username').type(USERNAME);
    cy.get('#password').type(PASSWORD);
    cy.get('button[type="submit"]').click();
    cy.get('a[href="/logout"]').click();
    cy.get('h2').should('contain', 'Login Page');
  });

  it('should handle page without errors', () => {
    cy.get('#username').type(USERNAME);
    cy.get('#password').type(PASSWORD);
    cy.get('button[type="submit"]').click();
    cy.get('.flash.success').should('be.visible');
  });
});
