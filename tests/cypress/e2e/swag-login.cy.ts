function login(username, password) {
  if (username) cy.get('#user-name').type(username);
  if (password) cy.get('#password').type(password);
  cy.get('#login-button').click();
}

describe('Swag Login - Cypress', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Valid Login - Standard User', () => {
    login('standard_user', 'secret_sauce');
    cy.url().should('include', 'inventory.html');
  });

  it('Invalid Login - Locked Out User', () => {
    login('locked_out_user', 'secret_sauce');
    cy.get('[data-test="error"]').should('contain.text', 'locked out');
  });

  it('Invalid Login - Wrong username', () => {
    login('wrong_username', 'secret_sauce');
    cy.get('[data-test="error"]').should('contain.text', 'Username and password do not match');
  });

  it('Invalid Login - Wrong password', () => {
    login('standard_user', 'wrong_password');
    cy.get('[data-test="error"]').should('contain.text', 'Username and password do not match');
  });

  it('Invalid Login - Empty username', () => {
    login('', 'secret_sauce');
    cy.get('[data-test="error"]').should('contain.text', 'Username is required');
  });

  it('Invalid Login - Empty password', () => {
    login('standard_user', '');
    cy.get('[data-test="error"]').should('contain.text', 'Password is required');
  });

  it('Valid Login - Problem User', () => {
    login('problem_user', 'secret_sauce');
    cy.url().should('include', 'inventory.html');
  });

  it('Valid Login - Performance Glitch User', () => {
    login('performance_glitch_user', 'secret_sauce');
    cy.wait(2000);
    cy.url().should('include', 'inventory.html');
  });

  it('Valid Login - Error User', () => {
    login('error_user', 'secret_sauce');
    cy.url().should('include', 'inventory.html');
  });

  it('Valid Login - Visual User', () => {
    login('visual_user', 'secret_sauce');
    cy.url().should('include', 'inventory.html');
  });
});
