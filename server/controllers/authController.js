const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./../models/user');

router.post('/signup' ,async (req , res) =>{
    try{
        const user = await User.findOne({email: req.body.email})

        if (user){
            return res.status(400).send({
                message : 'User already exists',
                success : false
            })
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        req.body.password = hashedPassword;

        const newUser = new User(req.body);
        await newUser.save();

        res.status(201).send({
            message : 'User created Successful',
            success : false
        })
    }catch(error){
        res.send({
            message: error.message,
            success : false
        });
    }
});

router.post('/login', async (req , res) => {
    try{
        const user = await User.findOne({email : req.body.email});
        if(!user){
            return res.status(400).send({
                message : 'User dose not exist',
                succes : false
            })
        }
            const isvalid = await bcrypt.compare(req.body.password , user.password);
            if(!isvalid){
             return res.status(400).send({
                message : 'invalid password',
                succes : false
            })
        }
        const token = jwt.sign({userId : user._id}, process.env.SECRET_KEY, {expiresIn :"1d"}); 

        res.send({
                message : 'user logged-in successfully', 
                succes : true, 
                token : token
        });


    }catch(error){
        res.send({
            message : error.message,
            succes : false
        })
    }
})

module.exports = router; 