if(process.env.NODE_ENV !=='production'){
  require('dotenv').config()
}
const express = require('express')
const app = express()
const bcrypt=require('bcryptjs')
const passport=require('passport')
const flash =require('express-flash')
const session =require('express-session')
const methodOverride = require('method-override')
const initializePassport=require('./passport-config')
initializePassport(
  passport,
  email=>users.find(user=>user.email===email),
  id=>users.find(user=>user.id===id)
)
// const cors = require('cors')
// app.use(cors())
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});
const { v4: uuidV4 } = require('uuid')
const users=[]
app.use('/peerjs', peerServer);
app.use(express.urlencoded({extended:false}))
app.use(flash())
app.use(session({
  secret:process.env.SESSION_SECRET,
  resave:false,
  saveUninitialized:false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.get('/login', checkNotAuthenticated,(req, res) => {
  res.render('login.ejs')
})
app.post('/login',checkNotAuthenticated,passport.authenticate('local',{
  successRedirect:'/',
  failureRedirect:'/login',
  failureFlash:true
}))
app.get('/register',checkNotAuthenticated, (req, res) => {
  res.render('register.ejs')
})
app.post('/register',checkNotAuthenticated,async(req,res)=>{
  try{
    const hashedPassword=await bcrypt.hash(req.body.password,10)
    users.push({
      id:Date.now().toString(),
      name:req.body.name,
      email:req.body.email,
      password:hashedPassword
    })
    res.redirect('/login')
  }
  catch{
    res.redirect('/register')
  }
  console.log(users)
})
app.get('/',checkAuthenticated, (req, res) => {
  res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId);
    // messages
    socket.on('message', (message) => {
      //send message to the same room
      io.to(roomId).emit('createMessage', message)
  }); 

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})
app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})
function checkAuthenticated(req, res, next){
  if(req.isAuthenticated())
  {
    return next()
  }
  res.redirect('/login')
}
function checkNotAuthenticated(req, res, next){
  if(req.isAuthenticated())
  {
    return res.redirect('/')
  }
  next()
}

server.listen(process.env.PORT||3030)
