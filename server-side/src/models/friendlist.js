const mongoose = require('mongoose');
const Users = require('./users');

const friendListSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    user_id : {
        type: String,
        ref: 'Users'
    },
    friend_id : {
        type: String,
        ref: 'Friends'
    },
    message : {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('FriendList', friendListSchema);