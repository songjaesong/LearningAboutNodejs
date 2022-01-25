const {Router} = require('express');
const commentRouter = Router({mergeParams : true});
const {Comment, User, Blog} = require('../models/');
const {isValidObjectId} = require('mongoose');

commentRouter.post('/', async(req, res) => {
    try{
        const {blogId} = req.params;
        const {content, userId} = req.body;
        if(!isValidObjectId(blogId))
            return res.status(400).send({err : "blogId is invalid"})
        if(!isValidObjectId(userId))
            return res.status(400).send({err : "userId is invalid"})
        if(typeof content !== "string")
            return res.status(400).send({ err : "content is required"})

        const [blog, user] = await Promise.all([
            await Blog.findByIdAndUpdate(blogId),
            await User.findByIdAndUpdate(userId)
        ])
        if(!blog || !user)
            return res.status(400).send({err : "blog or user does not exist"});
        if(!blog.islive) res.status(400).send({err : "blog is not avaliable"});
        const comment = new Comment({content, user, blog});
        await comment.save();
        return res.send({comment});
    }catch(err){
        console.log(err);
        return res.status(500).send({err : err.message});
    }
    
})

commentRouter.get('/', async(req, res) => {
    try{
        const {blogId} = req.params;
        if(!isValidObjectId(blogId))
            return res.status(400).send({err : "blogId is invalid"})
        
        const comments = await Comment.find({blog:blogId});
        return res.send({comments})
    }catch(err){
        console.log(err);
        res.status(500).send({err : err.message});
    }
})

module.exports = {commentRouter}