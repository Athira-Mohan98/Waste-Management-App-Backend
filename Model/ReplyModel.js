const mongoose = require('mongoose');

const ReplySchema = new mongoose.Schema({

     email: {
          type: String,
          required: true
     },

     response: {
          type: String,
          required: true
     },
     createdAt: {
          type: Date,
          default: Date.now
     },
     sender: String,
     
     recipient: String
})

module.exports = mongoose.model('Reply', ReplySchema);