class user {
  constructor(userId, firstname, lastname, email, password) {
    this.userId = userId;
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.password = password;
  }
}

module.exports.user = user;
