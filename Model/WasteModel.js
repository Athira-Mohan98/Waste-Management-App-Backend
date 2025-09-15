const mongoose = require('mongoose');

const wasteSchema = new mongoose.Schema({

  username: {
    type: String
  },

  phone: {
    type: String 
  },

  address: {
    type: String
  },

  date: {
    type: String
  },

  timeSlot: {
    type: String 
  },

  wasteType: {
    type: String 
  },

  description: {
    type: String
  },

  quantity: {
    type: Number
  },

  location: {
    type: String
  },

  status: {
    type: String,
    enum: ['AwaitingApproval','Pending', 'Approved', 'Rejected','completed'],
     default: 'Pending'
  },

  createdAt: {
    type: Date,
    default: Date.now
  },
  approvedByAdmin: Boolean
});

module.exports = mongoose.model("wastes", wasteSchema);