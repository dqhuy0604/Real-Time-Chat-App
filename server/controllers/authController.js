const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('./../models/user');

router.post('/signup' ,async (req , res) =>{
    try{
        const user = await User.findOne({email: req.body.email})

        if (user){
            return res.send({
                message : 'User already exists',
                success : false
            })
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        req.body.password = hashedPassword;

        const newUser = new User(req.body);
        await newUser.save();

        res.send({
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

module.exports = router; 