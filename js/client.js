// This is different from nodeServer.
const socket = io('http://localhost:8000')

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");

const name = prompt("Enter your name to join chat:");
socket.emit('new-user-joined', name);  //This will emit an event which will be recieved by index.js of nodeServer

form.addEventListener('submit', (event) => {
    event.preventDefault();     // this will prevent the page from reloading when we press send
    const message = messageInput.value;
    
    if(message.trim() != ""){         //this condition will not allow blank spaces to be send as text messages
        append(`You: ${message}`, 'right');
        socket.emit('send', message);
    }
    messageInput.value = '';
});


const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    // Playing audio:
    if(position == 'left'){
        var audio = new Audio("sounds/sound 1.mp3");
        audio.play();
    }
};

socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'right');
});

socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left');
});

socket.on('left', data => {
    append(`${name}: left the chat`, 'left');
});