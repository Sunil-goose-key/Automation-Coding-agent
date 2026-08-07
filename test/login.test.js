const test = require('node:test');
const assert = require('node:assert');
const LoginPage = require('../login');

test('LoginPage - should create a new instance', () => {
  const loginPage = new LoginPage();
  assert.ok(loginPage);
  assert.strictEqual(loginPage.isLoggedIn, false);
});

test('LoginPage - should set username', () => {
  const loginPage = new LoginPage();
  loginPage.setUsername('testuser');
  assert.strictEqual(loginPage.username, 'testuser');
});

test('LoginPage - should set password', () => {
  const loginPage = new LoginPage();
  loginPage.setPassword('password123');
  assert.strictEqual(loginPage.password, 'password123');
});

test('LoginPage - should fail validation with empty username', () => {
  const loginPage = new LoginPage();
  loginPage.setPassword('password123');
  const isValid = loginPage.validateCredentials();
  assert.strictEqual(isValid, false);
  assert.strictEqual(loginPage.errorMessage, 'Username is required');
});

test('LoginPage - should fail validation with empty password', () => {
  const loginPage = new LoginPage();
  loginPage.setUsername('testuser');
  const isValid = loginPage.validateCredentials();
  assert.strictEqual(isValid, false);
  assert.strictEqual(loginPage.errorMessage, 'Password is required');
});

test('LoginPage - should fail validation with short username', () => {
  const loginPage = new LoginPage();
  loginPage.setUsername('ab');
  loginPage.setPassword('password123');
  const isValid = loginPage.validateCredentials();
  assert.strictEqual(isValid, false);
  assert.strictEqual(loginPage.errorMessage, 'Username must be at least 3 characters');
});

test('LoginPage - should fail validation with short password', () => {
  const loginPage = new LoginPage();
  loginPage.setUsername('testuser');
  loginPage.setPassword('12345');
  const isValid = loginPage.validateCredentials();
  assert.strictEqual(isValid, false);
  assert.strictEqual(loginPage.errorMessage, 'Password must be at least 6 characters');
});

test('LoginPage - should pass validation with valid credentials', () => {
  const loginPage = new LoginPage();
  loginPage.setUsername('testuser');
  loginPage.setPassword('password123');
  const isValid = loginPage.validateCredentials();
  assert.strictEqual(isValid, true);
  assert.strictEqual(loginPage.errorMessage, '');
});

test('LoginPage - should login successfully with valid credentials', () => {
  const loginPage = new LoginPage();
  loginPage.setUsername('testuser');
  loginPage.setPassword('password123');
  const result = loginPage.login();
  assert.strictEqual(result.success, true);
  assert.strictEqual(result.username, 'testuser');
  assert.strictEqual(loginPage.isLoggedIn, true);
});

test('LoginPage - should fail login with invalid credentials', () => {
  const loginPage = new LoginPage();
  loginPage.setUsername('ab');
  loginPage.setPassword('password123');
  const result = loginPage.login();
  assert.strictEqual(result.success, false);
  assert.ok(result.error);
  assert.strictEqual(loginPage.isLoggedIn, false);
});

test('LoginPage - should logout successfully', () => {
  const loginPage = new LoginPage();
  loginPage.setUsername('testuser');
  loginPage.setPassword('password123');
  loginPage.login();
  assert.strictEqual(loginPage.isLoggedIn, true);

  loginPage.logout();
  assert.strictEqual(loginPage.isLoggedIn, false);
  assert.strictEqual(loginPage.username, '');
  assert.strictEqual(loginPage.password, '');
});

test('LoginPage - should return correct login state', () => {
  const loginPage = new LoginPage();
  loginPage.setUsername('testuser');
  loginPage.setPassword('password123');
  loginPage.login();

  const state = loginPage.getLoginState();
  assert.strictEqual(state.isLoggedIn, true);
  assert.strictEqual(state.username, 'testuser');
  assert.strictEqual(state.errorMessage, '');
});
