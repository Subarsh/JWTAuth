const mongoose = require('mongoose');
const express = require('express');
const FriendList = require('../models/friendlist');

var app = express();

app.get('/', function(req,res){
    FriendList
        .find()
        .exec()
        .then(function(response){
            res.send(200).json({
                result: response
            })
        })
        .catch(function(err){
            res.send(500).json({
                message: '500 Server Error'
            })
        });
})

app.get('/:friendName', function(req, res){
    let friendName = req.params.friendName;

})


module.exports = app;
