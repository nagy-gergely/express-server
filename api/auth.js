const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../model/user');

const router = express.Router();

router.post('/register', async (req, res, next) => {
    try {
        let user = await User.findOne({  
            $or: [{ 
                username: req.body.username 
            }, 
            { 
                email: req.body.email 
            }] 
        });
    
        if(!user) {
            user = new User(req.body);
            await user.save();
            res.status(201).json(user);
        } else {
            let error = new Error('User already exists.');
            error.status = 401;
            throw error;
        }
    } catch (error) {
        next(error);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if(!user) {
            let error = new Error("User doesn't exists");
            error.status = 401;
            throw error;
        }
        const isMatch = await user.comparePassword(req.body.password, next);
        if(isMatch) {
            const { id, username, email } = user;
            const token = await jwt.sign({ id, username, email }, process.env.JWT_SECRET, { expiresIn: "1h" });
            res.status(200).json({ id, username, email, token });
        } else {
            let error = new Error('Wrong password');
            throw error;
        }
    } catch (error) {
        next(error);
    }
});

module.exports = router;