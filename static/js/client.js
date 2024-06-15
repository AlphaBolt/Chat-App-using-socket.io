// This is different from nodeServer.
const socket = io('http://localhost:8000')

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");
const chatList = document.querySelector(".chat-list"); // Select the chat list
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

var audio = new Audio("../static/sounds/sound 1.mp3");

const append = (message, position) => {
    const messageElement = document.createElement('div');
    // messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);

    // Create <p> tag to better manage message content
    const messageContent = document.createElement('p');
    messageContent.classList.add('message-content');
    messageContent.innerText = message;
    messageElement.append(messageContent);

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

// Display user's list
const displayUsersList = (users) => {
    // Chat Group
    console.log(users)

    // for (const userId in users) {
    //     console.log(users[userId]);
    //     const userElement = document.createElement('div');
    //     userElement.classList.add('user');

    //     const profilePic = document.createElement('div');
    //     profilePic.classList.add('profile-pic');
    //     profilePic.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="40" width="40" viewBox="0 0 512 512"><path d="M399 384.2C376.9 345.8 335.4 320 288 320H224c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 16a72 72 0 1 0 0-144 72 72 0 1 0 0 144z"/></svg>`;
        
    //     const userName = document.createElement('div');
    //     userName.classList.add('preview');
    //     userName.innerText = users[userId];

    //     userElement.appendChild(profilePic);
    //     userElement.appendChild(userName);
    //     chatList.appendChild(userElement);    
    // }
    
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

// Update the list of users when a new user joins or leaves
socket.on('update-user-list', users => {
    displayUsersList(users);
});