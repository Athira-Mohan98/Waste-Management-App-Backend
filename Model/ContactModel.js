const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({

    name: {
        type: String,
           required: true
    },
    email: {
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true
    } ,
    city: {
       type: String,
        required: true 
    },
    subject: {
        type: String,
        enum: ['Suggestion', 'Report an Issue', 'Join as collection agent'],
        required: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Reviewed', 'Resolved'],
        default: 'Pending'
    },
    age:{
        type: Number
    }
});

module.exports = mongoose.model('ContactMessage', contactSchema);
