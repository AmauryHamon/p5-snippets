console.log("My server is running.");
// This imports the express package into our server.js file
const express = require('express');
// Because express package is a function, we can assign it to a variable:
const app = express();
// Assign the port which we listen to our project:
const port = 3005;
// Create the server by assigning your app to the port above
const server = app.listen(port);

app.use(express.static('public'));

const { Server } = require('socket.io');

const io = new Server(server)

io.sockets.on('connection', newConnection);

function newConnection(socket){
    console.log(socket.id);
    socket.on('mouse', mouseMessage);

    function mouseMessage(data){
        socket.broadcast.emit('mouse', data)
    }


}