require('dotenv').config()

const express = require('express')
const http = require('http')
const { Server } = require('socket.io');
const cors = require('cors')
const path = require('path');
const port = process.env.PORT || 3000;
const app = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST']
  }
});
global.io = io;

io.on('connection', (socket) => {
  console.log('User connected:'+ socket.id);

  socket.on('hello', (data) => {
    console.log('Received hello:'+ data);
  });

  socket.emit('welcome', 'Hello from server!');

  socket.on('disconnect', () => {
    console.log('User disconnected:'+ socket.id);
  });
});

const Router = require('./Route/Router')
const db = require('./Config/db')

app.get('/',(req,res)=>{
    console.log("Hello World");
    
})

app.use(express.json())
app.use(cors())
app.use(Router)

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
server.listen(port,()=>{
    console.log("Event listening to Port", port);
    
})