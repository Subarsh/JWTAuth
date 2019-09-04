const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    message:{
        type: String,
        required: true
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    added_date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Conversation', conversationSchema);