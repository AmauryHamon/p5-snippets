// import express package
const express = require('express');

// create an express instance
const app = express();

// define the port to run the server on
const port = 3000;

// start the server and listen on the defined port
const server = app.listen(port);

// use static files in the public folder
app.use(express.static('public'));

console.log('Server is running...');

// import socket.io package
const { Server } = require('socket.io');

// create a new instance of socket.io 
// and attach it to the server
const io = new Server(server);

// listen for new connections to the server
io.sockets.on('connection', newConnection);

// import fs and path to save the drawing to disk
const fs = require('fs');
const path = require('path');

// file where the drawing is saved between server restarts
const HISTORY_FILE = path.join(__dirname, 'history.json');

// every dot drawn so far,
// so new clients can see what was drawn before they joined
const history = loadHistory();

// maximum number of dots kept in history (oldest are dropped first)
const MAX_HISTORY = 50000;

// true when history has changed since the last save
let historyChanged = false;

// save the drawing every 2 seconds if it changed,
// instead of writing the file on every single dot
setInterval(saveHistory, 2000);

// save one last time when the server is stopped with ctrl+c
process.on('SIGINT', () => {
    saveHistory();
    process.exit();
});

// function to read the saved drawing, or start empty
function loadHistory(){
    try {
        return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
    } catch (err) {
        // no file yet, or it's unreadable
        return [];
    }
}

// function to write the drawing to disk
function saveHistory(){
    if (!historyChanged) return;
    // write to a temp file then rename it,
    // so a crash mid-write can't corrupt the saved drawing
    fs.writeFileSync(HISTORY_FILE + '.tmp', JSON.stringify(history));
    fs.renameSync(HISTORY_FILE + '.tmp', HISTORY_FILE);
    historyChanged = false;
}

// function to handle new connections
function newConnection(socket){
    console.log(socket.id);

    // send the existing drawing to the client that just joined
    socket.emit('history', history);

    // listen for 'mouse' events from the client
    socket.on('mouse', mouseMessage);

    // listen for 'clear' events from the client
    socket.on('clear', clearMessage);

    // function to handle 'clear' events
    function clearMessage(){
        // forget the drawing so new clients start blank
        history.length = 0;
        historyChanged = true;

        // tell every client, including the sender, to clear
        io.sockets.emit('clear');
    }

    // function to handle 'mouse' events
    function mouseMessage(data){
        console.log(data);

        // store the dot, dropping the oldest one past the cap
        history.push(data);
        if (history.length > MAX_HISTORY) {
            history.shift();
        }
        historyChanged = true;

        // broadcast the 'mouse' event to all other clients 
        // except the sender
        socket.broadcast.emit('mouse', data);

        // alternatively, to broadcast to all clients 
        // including the sender, use:
        // io.sockets.emit('mouse', data);
    }
}