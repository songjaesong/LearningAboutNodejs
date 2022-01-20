const Router = require('express');
const userRouter = Router();
const mongoose = require('mongoose')
const { User } = require("../models/User")

userRouter.get('/', async (req, res) => {
    try{
        const users = await User.find({});
        return res.send({users});
    } catch(err){
        console.log(err)
        return res.status(500).send({ err : err.message})
    }
    
})
userRouter.get('/:userId', async(req, res)=>{
    //:userId 이 형태로 해당 userId를 구별 가능하다.
    
    try{
        const { userId } = req.params;
        if(!mongoose.isValidObjectId(userId)) return res.status(400).send({ err : "invalid userId"})
        const user = await User.findOne({_Id: userId});
        return res.send({user});
    } catch(err){
        console.log(err)
        return res.status(500).send({ err : err.message})
    }
})
// save함수는 mongoose함수인데 여기서 저장이 완료되어야 하므로
// await을 통해 기다린 후에 저장이 되면 다음 줄로 가도록 한다.
userRouter.post('/', async(req,res) => {
    try{
        let { username, name} = req.body;
        if(!username) return res.status(400).send({err:"username is required"});
        if(!name || !name.first || !name.last) return res.status(400).send({err:"Both first and last names are required"});
        
        const user = new User(req.body);
        await user.save();
        return res.send({ user })
    }catch(err){
        console.log(err)
        return res.status(500).send({ err : err.message})
    }
})
userRouter.delete('/:userId', async (req, res) =>{
    try{
        const { userId } = req.params;
        if(!mongoose.isValidObjectId(userId)) return res.status(400).send({ err : "invalid userId"})
        const user = await User.findOneAndDelete({ _id: userId});
        //findOneAndDelete user라는 객체가 send가 되면 잘 된 것이고 null이면 삭제할 id가 없는 것이다..
        return res.send({user})
    }catch(err){
        console.log(err)
        return res.status(500).send({ err : err.message})
    }
})

userRouter.put('/:userId', async (req, res) => {
    try{
        const { userId } = req.params;
        if(!mongoose.isValidObjectId(userId)) return res.status(400).send({ err : "invalid userId"})
        const { age, name } = req.body;
        if(!age && !name) return res.status(400).send({err : "age must be a number"});
        if(age && typeof age !== 'number') return res.status(400).send({err: "age must be a number"});
        if(name && typeof name.first !== 'string' && typeof name.last !== 'string') return res.status(400).send({err : "first and last name are strings"});

        // let updateBody = {};
        // if(age) updateBody.age = age;
        // if(name) updateBody.name = name;
        // const user = await User.findOneAndUpdate(userId, updateBody, {new : true});
        
        // 아래와 같은 코드이다.

        let user = await User.findOne(userId);
        if(age) user.age = age;
        if(name) user.name = name;
        await user.save();
        return res.send({user});
    }catch(err){
        console.log(err)
        return res.status(500).send({ err : err.message})    
    }
})

module.exports = {
    userRouter
}