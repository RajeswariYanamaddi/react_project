const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userschema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required:true,
        minlength: 6,
    },
    email:{
        type: String,
        required: true,
        unique: false
    },
    phonenumber:{
        type: String,
        required: true,
        unique: true
    }
})

userschema.pre('save',function(next){
    const user = this
    if(!user.isModified('password')){
        return next()
    }
    bcrypt.genSalt(10,(error, salt)=>{
        if(error){
            return next(error)
        }
        bcrypt.hash(user.password, salt, (error, hash)=>{
            if(error){
                return next(error)
            }
            user.password=hash
            next()
        })
    })
})
userschema.methods.comparePassword=function (candidatePassword) {
    const user=this
    return new Promise((resolve, reject)=>{
        bcrypt.compare(candidatePassword,user.password,(error, isMatch)=>{
            if(error){
                return reject(error)
            }
            if(!isMatch){
                return reject(error)
            }
            resolve(true)
        })
    })
    
}
mongoose.model('User',userschema)