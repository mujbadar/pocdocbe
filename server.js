////////////
// Dependencies
//////////////

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session')
const bodyParser = require('body-parser')
const open = require('open');
require('dotenv').config()


//Socket
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);

//Configuration
const PORT = process.env.PORT || 3003;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pocdoc'

//Controllers
const patientController = require('./controllers/patients.js')
const doctorController = require('./controllers/doctors.js')
const sessionController = require('./controllers/session.js')
const visitController = require('./controllers/visits.js')

//Database
mongoose.connect(MONGODB_URI, {useNewUrlParser: true})
mongoose.connection.once('open', () => {
  console.log('You are connected to MongoDb!');
})
mongoose.connection.on('error', (error) => {
  console.log(error.message + 'check mongodb');
})
mongoose.connection.on('diconnect', () => {
  console.log('MongoDb disconnected');
})
mongoose.connection.on('error', (error) => {
  console.log(error.message + 'check mongodb');
})
mongoose.set('useCreateIndex', true)

//Middleware
app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended: true }))


//Controller Routes
app.use('/patient', patientController);
app.use('/doctor', doctorController);
app.use('/login', sessionController);
app.use('/visit', visitController);

const sockets = {};
const users = {};

app.get('/', (req, res) => {
  console.log('get /');
  res.sendFile(__dirname + '/index.html');
});

const sendTo = (connection, message) => {
   connection.send(message);
}

io.on('connection', (socket) => {
  console.log("user connected");

  socket.on('disconnect', () => {
    console.log("user disconnected");
    if(socket.name){
      socket.broadcast.to("chatroom").emit('roommessage',{ type: "disconnect", username: socket.name})
      delete sockets[socket.name];
      delete users[socket.name];
    }

  })

  socket.on('message', (message) => {

  const data = message;

    switch (data.type) {

    case "login":
      console.log("User logged", data.name);

      //if anyone is logged in with this username then refuse
      if(sockets[data.name]) {
         sendTo(socket, {
            type: "login",
            success: false
         });
      } else {
         //save user connection on the server
         var templist = users;
         sockets[data.name] = socket;
         socket.name = data.name;
         sendTo(socket, {
            type: "login",
            success: true,
            username: data.name,
            userlist: templist
         });
         socket.broadcast.to("chatroom").emit('roommessage',{ type: "login", username: data.name})
         socket.join("chatroom");
         users[data.name] = socket.id
      }

      break;
      case "call_user":
      // chek if user exist
        if(sockets[data.name]){
          console.log("user called");
          console.log(data.name);
          console.log(data.callername);
        sendTo(sockets[data.name], {
           type: "answer",
           callername: data.callername
        });
      }else{
        sendTo(socket, {
           type: "call_response",
           response: "offline"
        });
      }
      break;
      default:
      sendTo(socket, {
         type: "error",
         message: "Command not found: " + data.type
      });
      break;
}

  })
})

server.listen(process.env.PORT, () => {
   console.log('server up and running at %s port', process.env.PORT);
 });
