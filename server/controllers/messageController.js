const router = require('express').Router();
const authMiddleware = require('./../middlewares/authMiddleware');
const Chat = require('./../models/chat');
const Message = require('./../models/message'); 

router.post('/new-message', authMiddleware , async (req,res) => {
    try{
        const newMessage = new Message(req.body);
        const saveMessage = await newMessage.save();

        const currentChat = await Chat.findOneAndUpdate({
            _id : req.body.chatId
        },{
            lastMessage : saveMessage._id,
            $inc : {unreadMessageCount : 1}
        });

        res.status(201).send({
            message : "Message  sent successfully",
            success : true,
            data : saveMessage
        })

    }catch(error){
        res.status(400).send({
            message : error.message,
            success : false
        })
    }
})

router.get('/get-all-messages/:chatId', authMiddleware , async (req, res) => {
    try{
        const allMessages = await Message.find({chatId: req.params.chatId})
                                            .sort({createdAt: 1}); 
        res.send({
            message : 'Messages fetched successfully',
            success : true,     
            data : allMessages  
        })
    }catch(error){   
        res.status(400).send({
            message : error.message,
            success : false
        })
    }
})



module.exports = router;