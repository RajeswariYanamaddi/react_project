const express=require('express')
const http=require('http')
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser=require('body-parser')
require('dotenv').config()
const hostname='localhost'
const port=3001
const mongouri=process.env.MONGODB_URI

const app=express()

app.use(cors())

require('./models/UserModel')
const requireToken = require('./middleware/requireToken')
const authroutes = require('./routes/authRoutes')
app.use(bodyParser.json())
app.use(authroutes)

mongoose.connect(mongouri, {useNewUrlParser: true, useUnifiedTopology: true})
mongoose.connection.on('connected', () => {
    console.log("connected to mongodb")
})

mongoose.connection.on('error',(error) =>{
    console.log("error occured",error)
})


//app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "http://localhost:3000");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

app.get('/', requireToken, (req, res) => {
    res.send({
      username: req.user.username,
      email: req.user.email,
      phonenumber: req.user.phonenumber
    })
  })
const server=http.createServer(app)
server.listen(port,() => {
    console.log(`server started at http://localhost:${port}/`)
})