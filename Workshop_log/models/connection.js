class connection {

constructor(wid,topic,name,details,venue,date,time){
  this.workshopId = wid;
  this.topic = topic;
  this.name = name;
  this.details = details;
  this.venue = venue;
  this.date = date;
  this.time = time;
}

  get WorkshopId() {
    return this.workshopId;
  }

  get Name() {
    return this.name;
  }

  get Topic() {
    return this.topic;
  }

  get Details() {
    return this.details;
  }

  get Venue() {
    return this.venue;
  }

  get Date() {
    return this.date;
  }

  get Time() {
    return this.time;
  }

  set WorkshopId(workshopId) {
    this.workshopId = workshopId;
  }

  set Name(name) {
    this.name = name;
  }

  set Topic(topic) {
    this.topic = topic;
  }

  set Details(details) {
    this.details = details;
  }

  set Venue(venue) {
    this.venue = venue;
  }

  set Date(date) {
    this.date = date;
  }

  set Time(time) {
    this.time = time;
  }
}


module.exports.connection = connection;
