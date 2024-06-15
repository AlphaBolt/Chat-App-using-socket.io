const express = require('express')
const app = express()
const path = require('path')

// Serving static files such as images, css and js
app.use('/static', express.static('static'))

// Node server which will handle socket.io connections
// const io = require('socket.io')(8000, {cors: {origin: "*"}});

const { Server } = require("socket.io");
const http = require('http');
const server = http.createServer(app);
const io = new Server(server);

users = {};

// Check if any connection came or not, and if came, run an arrow function named socket{} .
// io.on is a socket.io instance which listens for many sockets connections
io.on('connection', socket =>{

    // socket.on -> What will happen to a particular connection.
    socket.on('new-user-joined', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);   // when new user joins, everyone can get a msg saying who joined
        io.emit('update-user-list', users); // Update the list of users for all clients
    });

    socket.on('send', message =>{
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]});
    });

    // When user disconnects
    socket.on('disconnect', () => {
        if (users[socket.id]){      // this line was added
            socket.broadcast.emit('left', users[socket.id]);
            delete users[socket.id];
            io.emit('update-user-list', users); // Update the list of users for all clients
        }
    });

    // When user is typing
    socket.on('typing', name => {
        socket.broadcast.emit('typing', name);
    });
});




app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, './templates/index.html'))
})





const port = process.env.PORT || 3000
server.listen(port, () => {
    console.log(`App listening on port http://localhost:${port}`)
  })