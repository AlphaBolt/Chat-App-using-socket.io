// Node server which will handle socket.io connections
// const io = require('socket.io')(8000)
const io = require('socket.io')(8000, {cors: {origin: "*"}});

users = {};

// Check if any connection came or not, and if came, run an arrow function named socket{} .
// io.on is a socket.io instance which listens for many sockets connections
io.on('connection', socket =>{

    // socket.on -> What will happen to a particular connection.
    socket.on('new-user-joined', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);   // when new user joins, everyone can get a msg saying who joined
    });

    socket.on('send', message =>{
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]});
    });

    // When user disconnects
    socket.on('disconnect', name =>{
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });

    // When user is typing
    socket.on('typing', name => {
        socket.broadcast.emit('typing', name);
    });
});