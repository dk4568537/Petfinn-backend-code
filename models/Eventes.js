const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  email: { type: String, required: true },
  firtname: { type: String, required: true },
  lastname: { type: String, required: true },
  address: { type: String, required: true },
  appartment: { type: String, required: true },
  city: { type: String, required: true },
  zipcode: { type: String, required: true },
  phoneno: { type: String, required: true }
});

module.exports = mongoose.model('Event', eventSchema);