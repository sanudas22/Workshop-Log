class userconnection {
constructor(userId, connectionId, category, name, rsvp) {
  this.userId = userId;
  this.connectionId = connectionId;
  this.rsvp = rsvp;
  this.name = name;
  this.category = category;

}
}

module.exports.userconnection =  userconnection;
