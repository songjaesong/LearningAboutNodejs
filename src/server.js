const express = require("express");
const app = express();
const {userRouter} = require('./routes/userRoute');
const {blogRouter} = require("./routes/blogRoute");
const mongoose = require("mongoose");

const MONGO_URI = 'mongodb+srv://so971007:yk080202@mongodbtutorial.61epp.mongodb.net/BlogService?retryWrites=true&w=majority'

const server = async() =>{
    try{
        await mongoose.connect(MONGO_URI, {useNewUrlParser : true, useUnifiedTopology: true});
        console.log("MongoDb connected");
        app.use(express.json())

        app.use('/user', userRouter)
        app.use('/blog', blogRouter)

        app.listen(3001, () =>{
            console.log("server listening on port 3001");
        })

    }catch(err){
        console.log(err);
    }
}

server();