const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    source_id: {
        type: String,
        required: true
    },
    message:{
        type: String,
        required: true
    },
    destination_id: {
        type: String,
        required: true
    },
    added_date: {
        type: new Date(),
        required: true
    }
})

module.exports = mongoose.model('Conversation', conversationSchema);