const mongoose = require('mongoose');
const express = require('express');
const Conversation = require('../models/conversation');

var app = express();

app.use(express.json());

app.post('/', function(req, res){
    let conversation = new Conversation({
        _id: new mongoose.Types.ObjectId,
        from:  req.body.from,
        message: req.body.message,
        to: req.body.to
    })

    conversation
        .save()
        .then(function(response){
            console.log(response);
            res.status(200).json({
                response
            })
        })
        .catch(function(error){
            console.log(error);
            res.status(500).json({
                error
            })
        })
})



app.get('/:conversationId', function(req, res){
    Conversation.findById({ _id: req.params.conversationId }).then(function(response){
        res.status(200).json({
            response: response
        })
    }).catch(function(error){
        res.status(500).json({
            err: error
        })
    });
})

app.get('/:userId',function(req, res){
    let userId = req.params.userId;
    Conversation.find().then(function(response){
        res.status(200).json({
            response
        })
    }).catch(function(err){
        res.status(500).json({
            err
        })
    })
})

app.get('/findFriends/:userId', function(req, res){
    let userId = req.params.userId;

    Conversation
        .find({from: userId})
        .populate('to')
        .sort({added_date: -1})
        .select('-_id -from')
        .exec()
        .then(function(response){
            let set = new Set();
            let result = [];

            response.forEach(function(data){
                let to = JSON.stringify(data.to);
                console.log(typeof to);
                if(!set.has(to)){
                    set.add(to);
                    result.push(data);
                }
            })
            console.log(result);
            res.status(200).json({ result });
        }).catch(function(err){
            res.status(500).json({err});
        })
})

app.get('/:sourceId/:destinationId', function(req, res){
    let sourceId = req.params.sourceId;
    let destinationId = req.params.destinationId;

    console.log(sourceId + " " + destinationId);
    Conversation
        .find({ $or: [ { from: sourceId, to: destinationId }, { from: destinationId, to: sourceId } ] })
        .exec()
        .then(function(response){
            console.log()
            res.status(200).json({
                response
            })
        })
        .catch(function(err){
            res.send(500).json({
                err
            })
        })
})

module.exports = app;
