const USERNAME_SELECTOR = '#user-name';
const PASSWORD_SELECTOR = '#password';
const LOGIN_BUTTON_SELECTOR = '#login-button';
const ERROR_MESSAGE_SELECTOR = '[data-test="error"]';

function login(username, password) {
  cy.get(USERNAME_SELECTOR).type(username);
  cy.get(PASSWORD_SELECTOR).type(password);
  cy.get(LOGIN_BUTTON_SELECTOR).click();
}

describe('Swag Login - Cypress', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Valid Login - Standard User', () => {
    // Test a valid login with standard user credentials
    login('standard_user', 'secret_sauce');
    cy.url().should('include', 'inventory.html');
  });

  it('Invalid Login - Locked Out User', () => {
    // Test login with a locked out user account
    login('locked_out_user', 'secret_sauce');
    cy.get(ERROR_MESSAGE_SELECTOR).should('contain.text', 'locked out');
  });

  it('Invalid Login - Wrong username', () => {
    // Test login with an incorrect username
    login('wrong_username', 'secret_sauce');
    cy.get(ERROR_MESSAGE_SELECTOR).should('contain.text', 'Username and password do not match');
  });

  it('Invalid Login - Wrong password', () => {
    // Test login with an incorrect password
    login('standard_user', 'wrong_password');
    cy.get(ERROR_MESSAGE_SELECTOR).should('contain.text', 'Username and password do not match');
  });

  it('Invalid Login - Empty username', () => {
    // Test login with an empty username
    login('', 'secret_sauce');
    cy.get(ERROR_MESSAGE_SELECTOR).should('contain.text', 'Username is required');
  });

  it('Invalid Login - Empty password', () => {
    // Test login with an empty password
    login('standard_user', '');
    cy.get(ERROR_MESSAGE_SELECTOR).should('contain.text', 'Password is required');
  });

  it('Valid Login - Problem User', () => {
    // Test a valid login with problem user credentials
    login('problem_user', 'secret_sauce');
    cy.url().should('include', 'inventory.html');
  });

  it('Valid Login - Performance Glitch User', () => {
    // Test a valid login with performance glitch user credentials and wait for the glitch to resolve
    login('performance_glitch_user', 'secret_sauce');
    cy.wait(2000);
    cy.url().should('include', 'inventory.html');
  });

  it('Valid Login - Error User', () => {
    // Test a valid login with error user credentials
    login('error_user', 'secret_sauce');
    cy.url().should('include', 'inventory.html');
  });

  it('Valid Login - Visual User', () => {
    // Test a valid login with visual user credentials
    login('visual_user', 'secret_sauce');
    cy.url().should('include', 'inventory.html');
  });
});
