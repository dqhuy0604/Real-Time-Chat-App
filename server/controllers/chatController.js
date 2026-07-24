const route = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
const Chat = require('./../models/chat');

route.post('/create-new-chat',authMiddleware, async (req, res )=> {
    try{
        const chat = new Chat(req.body);
        const savedChat = await chat.save();

         res.status(201).send({
            message: 'Chat created successfully', 
            success : true,
            data : savedChat
        })
    }catch(error){
        res.status(400).send({
            message : error.message,
            success : false
        })
    }
})

route.get('/get-all-chats',authMiddleware, async (req, res )=> {
    try{
        const allChats = await Chat.find({members : {$in :req.body.userId}});

         res.status(200).send({
            message: 'Chat featched successfully', 
            success : true,
            data : allChats
        })
    }catch(error){
        res.status(400).send({
            message : error.message,
            success : false
        })
    }
})
module.exports = route;