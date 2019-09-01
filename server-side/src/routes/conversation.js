const mongoose = require('mongoose');
const express = require('express');
const Conversation = require('../models/conversation');

var app = express();

app.use(express.json());

app.post('/', function(req, res){
    let conversation = new Conversation({
        _id: mongoose.Types.ObjectId,
        source_id:  req.body.source_id,
        message: req.body.message,
        destination_id: req.body.destination_id
    })

    conversation
        .save()
        .then(function(response){
            console.log(response);
            res.status(200).json({
                response: response
            })
        })
        .catch(function(error){
            console.log(error);
        })
})

// app.get('/:')