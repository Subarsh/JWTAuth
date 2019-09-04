require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const userRoute = require('./server-side/src/routes/user');
const conversationRoute = require('./server-side/src/routes/conversation');
const friendlistRoute = require('./server-side/src/routes/friendlist');

app.use('/user', userRoute);
app.use('/conversation', conversationRoute);
app.use('/friendlist', friendlistRoute);

app.get('/', function(req, res){
    res.send('HEllow World');
})
mongoose
    .connect('mongodb+srv://subarsh:' + process.env.MONGO_ATLAS_PWD + '@chat-db-sefmf.mongodb.net/test?retryWrites=true&w=majority',
        {
            useNewUrlParser: true
        })
    .catch(function(err){
        console.log(err);
    })


app.listen(process.env.PORT, function(){
    console.log(`Listening on 127.0.0.1:${process.env.PORT}`);
})