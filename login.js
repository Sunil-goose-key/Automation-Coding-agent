class LoginPage {
  constructor() {
    this.username = '';
    this.password = '';
    this.isLoggedIn = false;
    this.errorMessage = '';
  }

  setUsername(username) {
    this.username = username;
  }

  setPassword(password) {
    this.password = password;
  }

  validateCredentials() {
    this.errorMessage = '';

    if (!this.username || this.username.trim() === '') {
      this.errorMessage = 'Username is required';
      return false;
    }

    if (!this.password || this.password.trim() === '') {
      this.errorMessage = 'Password is required';
      return false;
    }

    if (this.username.length < 3) {
      this.errorMessage = 'Username must be at least 3 characters';
      return false;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters';
      return false;
    }

    return true;
  }

  login() {
    if (!this.validateCredentials()) {
      return {
        success: false,
        error: this.errorMessage
      };
    }

    this.isLoggedIn = true;
    return {
      success: true,
      username: this.username
    };
  }

  logout() {
    this.username = '';
    this.password = '';
    this.isLoggedIn = false;
    this.errorMessage = '';
  }

  getLoginState() {
    return {
      isLoggedIn: this.isLoggedIn,
      username: this.username,
      errorMessage: this.errorMessage
    };
  }
}

module.exports = LoginPage;
