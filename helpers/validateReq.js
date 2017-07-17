// validate request
function validateReq({ email, name, favoriteBook, password, confirmPassword }) {
  if (email && name && favoriteBook && password && confirmPassword) {
    // confirm if password match
    if(password === confirmPassword) {
      return { valid: true };
    } else{
      return { valid: false, message: 'Password do not match' };
    }
  } else {
    return { valid: false, message: 'All fields are required' };
  }
}

module.exports = validateReq;
