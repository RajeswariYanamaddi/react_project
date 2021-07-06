const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = mongoose.model('User');
const requireToken = require('../middleware/requireToken');
require('dotenv').config()
const jwtkey = process.env.JWTKEY

router.post('/signup',async(req, res)=>{
    const {
      username, password, email, phonenumber
    }=req.body
    try {
        const user = new User({username, password, email, phonenumber})
        await user.save()
        const token = jwt.sign({userId: user._id},jwtkey)
        res.send({token, username, email, phonenumber})
    } catch (error) {
        return res.status(422).send(error.message)
    }
})

router.post('/signin', async (req, res) => {
    const { username, password } = req.body
    if ( !username || !password) {
      return res.status(422).send({error: "username and password required"})
    }
    const user = await User.findOne({username})
    if (!user) {
      return res.status(422).send({error: "username and password required"})
    }
    try{
      await user.comparePassword(password);
      const token = jwt.sign({userId: user._id}, jwtkey )
      res.send({token, username});
    }
    catch (err) {
      return res.status(422).send({error: "username and password required"})
    }
  });



  module.exports = router