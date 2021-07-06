const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = mongoose.model('User')
require('dotenv').config()

const jwtkey = process.env.JWTKEY
module.exports = (req,res,next)=>{
    const {authorization} = req.headers
    if(!authorization){
        return res.status(401).send({error:"you are not logged in"})
    }
    const token = authorization.replace("Bearer ", "")
    jwt.verify(token, jwtkey, async(error, payload)=>{
        if(error){
            console.log(error)
            return res.status(401).send({error:"you are not logged in"})
        }
        const {userId} = payload
        const user = await User.findById(userId)
        req.user = user
        next()
    })
}