const mongoose = require('mongoose');

const PurchaseSchema = new mongoose.Schema({
  itemName: {
    type: String
  },
  price: {
    type: Number
  },
  date: {
    type: Date,
    default: Date.now
  }
})


const userSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
  },
  address: {
    type: String

  },
  profilephoto:
  {
    type: String

  },
  feedback:{
    rating:Number,
    comment:String
  },

  purchases: [PurchaseSchema]


});

module.exports = mongoose.model('Users', userSchema);
