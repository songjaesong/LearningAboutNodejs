const {Router} = require('express')
const blogRouter = Router();
const { Blog } = require('../models/Blog')
const { User } = require("../models/User")
const {isValidObjectId} = require('mongoose')

blogRouter.post('/', async(req, res) => {
    try{
        const {title, content, islive, userId} = req.body;
        if(typeof title !== 'string') res.status(400).send({err : "title is required"})
        if(typeof content !== 'string') res.status(400).send({err : "content is required"})
        if(islive && typeof islive !== 'boolean') res.status(400).send({err : "islive must be a boolean"})
        if(!isValidObjectId(userId)) res.status(400).send({ err : "userId is invalid"});
        
        // userId 형식은 맞으나 database에 있는지 여부 확인
        let user = await User.findOne(userId);
        if(!user) res.status(400).send({err : "user does not exist"});

        let blog = new Blog({ ...req.body, user});
        await blog.save();
        return res.send({blog});
    }catch(err){
        console.log(err);
        res.status(500).send({err : err.message});
    }
})

blogRouter.get('/', async(req, res) => {
    try{
        const blogs = await Blog.find({});
        return res.send({blogs})
    }catch(err){
        console.log(err);
        res.status(500).send({err : err.message});
    }
})

// 특정 blog를 불러오기
blogRouter.get('/:blogId', async(req, res) => {
    try{
        const {blogId} = req.params;
        if(!isValidObjectId(blogId)) res.status(400).send({ err : "blogId is invalid"});
       
        const blog = await Blog.findOne({_id : blogId});
        return res.send({blog});
    }catch(err){
        console.log(err);
        res.status(500).send({err : err.message});
    }
})

// blog의 전체적인 부분을 수정
blogRouter.put('/:blogId', async(req, res) => {
    try{
        const {blogId} = req.params;
        if(!isValidObjectId(blogId)) res.status(400).send({ err : "blogId is invalid"});
       
        const { title, content } = req.body;
        if(typeof title !== 'string') res.status(400).send({err : "title is required"})
        if(typeof content !== 'string') res.status(400).send({err : "content is required"})
        
        const blog = await Blog.findOneAndUpdate({_id : blogId }, { title, content}, { new : true})
        return res.send({blog})
    }catch(err){
        console.log(err);
        res.status(500).send({err : err.message});
    }
})

// blog의 특정 부분을 수정
blogRouter.patch('/:blogId/live', async(req, res) => {
    try{
        const {blogId} = req.params;
        if(!isValidObjectId(blogId)) res.status(400).send({ err : "blogId is invalid"});

        const { islive } = res.body;
        if(typeof islive !== 'boolean') res.status(400).send({ err : "boolean is live is required"});

        const blog = await Blog.findOneAndUpdate({_id : blogId}, {islive}, {new : true});
        return res.send({blog});
    }catch(err){
        console.log(err);
        res.status(500).send({err : err.message});
    }
})
module.exports = {blogRouter};
