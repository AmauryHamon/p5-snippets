//  ================================================================
//  1. Express setup: serves the files in the public folder
//  ================================================================

const express = require('express');
const app = express();

// define the port to run the server on
const port = process.env.PORT || 3000;

// use static files in the public folder
app.use(express.static('public'));

// start the server and listen on the defined port
const server = app.listen(port);

console.log('Server is running...');


//  ================================================================
//  2. Socket.io setup: real-time messages between clients
//  ================================================================

const { Server } = require('socket.io');

// create a new instance of socket.io and attach it to the server
const io = new Server(server);

// listen for new connections to the server
io.on('connection', newConnection);

// function to handle new connections
function newConnection(socket) {
    console.log(socket.id);

    // send the existing drawing to the client that just joined
    socket.emit('history', history);

    // listen for events from this client
    socket.on('mouse', mouseMessage);
    socket.on('clear', clearMessage);

    // function to handle 'mouse' events
    function mouseMessage(data) {
        console.log(data);
        addToHistory(data);

        // broadcast to all other clients except the sender
        socket.broadcast.emit('mouse', data);

        // alternatively, to include the sender, use:
        // io.emit('mouse', data);
    }

    // function to handle 'clear' events
    function clearMessage() {
        clearHistory();

        // tell every client, including the sender, to clear
        io.emit('clear');
    }

    // Handle client count updates
    sendClientCount();
    socket.on('disconnect', () => sendClientCount());
}

function sendClientCount() {
    io.emit('clients', io.engine.clientsCount);

}


//  ================================================================
//  3. History: remembers the drawing and saves it to disk
//  ================================================================

const fs = require('fs');
const path = require('path');

// file where the drawing is saved between server restarts
const HISTORY_FILE = path.join(__dirname, 'history.json');

// maximum number of dots kept in history (oldest are dropped first)
const MAX_HISTORY = 50000;

// every dot drawn so far,
// so new clients can see what was drawn before they joined
const history = loadHistory();

// true when history has changed since the last save
let historyChanged = false;

// read the saved drawing, or start empty
function loadHistory() {
    try {
        return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
    } catch (err) {
        // no file yet, or it's unreadable
        return [];
    }
}

// write the drawing to disk (only if it changed)
function saveHistory() {
    if (!historyChanged) return;
    // write to a temp file then rename it,
    // so a crash mid-write can't corrupt the saved drawing
    fs.writeFileSync(HISTORY_FILE + '.tmp', JSON.stringify(history));
    fs.renameSync(HISTORY_FILE + '.tmp', HISTORY_FILE);
    historyChanged = false;
}

// store a dot, dropping the oldest one past the cap
function addToHistory(dot) {
    history.push(dot);
    if (history.length > MAX_HISTORY) {
        history.shift();
    }
    historyChanged = true;
}

// forget the drawing so new clients start blank
function clearHistory() {
    history.length = 0;
    historyChanged = true;
}

// save every 2 seconds if it changed,
// instead of writing the file on every single dot
setInterval(saveHistory, 2000);

// save one last time when the server is stopped with ctrl+c
process.on('SIGINT', () => {
    saveHistory();
    process.exit();
});
