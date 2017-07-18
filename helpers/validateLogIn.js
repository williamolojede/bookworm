// validate login
function validateLogin({ email, password }) {
  if (email && password) {
    return { valid: true };
  } else {
    return { valid: false, message: 'Email and password are required', status: 401 }
  }
}

module.exports = validateLogin;
