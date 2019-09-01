const express = require('express');
const Users = require('../models/users');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');

var app = express();
app.use(express.json());

app.post('/signup', function(req,res){
    const { name, email, password } = req.body;

    Users
        .find({email: email})
        .exec()
        .then(function(result){
            if(result.length >= 1){
                console.log(result.length);
                res.status(200).json({
                    message: 'Email already exists'
                })
            }else{
                bcrypt.hash(password, 10, function(err, hash){
                    if(err){
                        res.status(404).json({
                            error: err
                        })
                    }else{
                        console.log(hash);
                        let user = new Users({
                            _id: new mongoose.Types.ObjectId,
                            name: name,
                            email: email,
                            password: hash
                        });
            
                        user
                            .save()
                            .then(function(result){
                                console.log(result);
                                res.status(200).json({user: result});
                            })
                            .catch(function(err){
                                console.log("eerror: ", err);
                                res.status(404).json({ err: err})
                            });
                    }
                })
            }
        }).catch(function(err){
            console.log("ERROR: ", err);
        })
});

app.post('/login', function(req, res){
    let {email, password} = req.body;
    console.log(email);
    console.log(password);
  
    Users
        .findOne({ email: email })
        .exec()
        .then(function(user){
            console.log(user);
            if(user){
                if(user.length < 1){
                    return res.status(401).json({
                            message: 'Auth Failed'
                    })
                }
                bcrypt.compare(password, user.password, function(err, response){
                    if(err){
                        return res.status(500).json({
                            message: 'Auth Failed'
                        })
                    }else if(response){
                        jwt
                            .sign({
                                email: user.email,
                                id: user._id
                            },
                            process.env.JWT_KEY,
                            {
                                expiresIn: '5mins'
                            },
                            function(err, token){
                                if(err){
                                    return res.status(500).json({
                                        messsage: 'JWT Auth failed'
                                    })
                                }else{
                                    return res.status(200).json({
                                        message: 'Auth Successful',
                                        user: user,
                                        token: token
                                    })
                                }
                        });
                        
                    }else{
                        return res.status(400).json({
                            message: 'Auth Failed'
                        })
                    }
                })
            }else if(!user){
                res.status(404).json({message: 'User Credential doesnt match'})
            }
        })
        .catch(function(error){
            console.log(error);
            res.status(404).json({message: 'User Credential doesnt match'})
        })
})

app.get('/:userId', checkAuth, function(req, res){
    let userId = req.params.userId;
    Users
        .findById(userId)
        .exec()
        .then(function(data){
            console.log(req.params.userId)
            res.status(200).json({
                message: 'UserID Found',
                user: data
            })
        })
        .catch(function(err){
            console.log(err);
            res.status(404).json(
                {
                    message: 'Error!! NOT FOUND',
                })
        })
});

app.delete('/:userId', function(req, res){
    let userId = req.params.userId;
    Users
        .findByIdAndRemove(userId)
        .exec()
        .then(function(data){
            res.status(400).json({
                message: 'Succesfully deleted',
                user: data
            })
        })
        .catch(function(err){
            res.status(404).json({
                message: `User with id ${userId} not found`
            })
        })
});

app.get('/', function(req, res){
    Users
        .find()
        .exec()
        .then(function(docs){
            res.status(200).json(docs);
        })
        .catch(function(error){
            res.status(500).json(error);
        });
})

app.patch('/:userId', function(req, res){
    const id = req.params.userId;
    let updateParams = {};
    for(let updateProps of req.body){
        updateParams[updateProps.propName] = updateProps.value; 
    }
    Users
        .update({id: id},{$set: updateParams})
        .exec()
        .then(function(result){
            res.status(200).json({
                message: 'User Details updated successfully',
                data: result
            })
        })
        .catch(function(err){
            res.status(404).json({
                message: `Cannot find user with ${id} id`,
                error: err
            })
        });
})
module.exports = app;
