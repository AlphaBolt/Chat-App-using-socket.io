// This is different from nodeServer.
const socket = io('http://localhost:8000')

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");
// To show {user} is typing
const feedback = document.getElementById('feedback');

const name = prompt("Enter your name to join chat:", "User");
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

var audio = new Audio("sounds/sound 1.mp3");

const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);

    // To show current time below text send
    if(position != 'center'){
        const timestampElement = document.createElement('div');
        timestampElement.classList.add('message-timestamp');
        const date = new Date();
        timestampElement.innerText = date.getHours() +":"+date.getMinutes();
    
        // Append child elements to the main message element
        messageElement.append(timestampElement);
    }

    // Append the main message element to the message container
    messageContainer.append(messageElement);

    // Playing audio for received messages (left-side messages):
    if(position == 'left'){
        audio.play();
        // When a new message arrives, this will automatically scroll the <div> to bottom of page
        messageContainer.scrollTop = messageContainer.scrollHeight;
    }
};


// Trying to implement {user} is typing message:
messageInput.addEventListener("keydown", function(event){
    // socket.emit('send',"Typing...");
    socket.emit('typing', name);
});

// .................Listen for events

socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'center');
});

socket.on('receive', data => {
    feedback.innerHTML = '';
    append(`${data.name}: ${data.message}`, 'left');
});

socket.on('left', name => {
    append(`${name} left the chat`, 'center');
});

socket.on('typing', name => {
    feedback.innerHTML = name + " is typing...";
});