// MAMD Creative Coding & Future Web, 2026, Amaury Hamon

// socket.io instance, connected in setup()
let socket;

// this client's color, picked once per session
let myColor;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(220);

  // pick a random color for this user
  myColor = [random(255), random(255), random(255)];

  // connect only once the canvas exists,
  // so the history can't arrive before we can draw it
  socket = io();

  // redraw everything drawn before this client joined
  // (also sent again on reconnect, e.g. after a server restart,
  // so start from a blank canvas to stay in sync with the server)
  socket.on('history', (dots) => {
    clearCanvas();
    dots.forEach(newDrawing);
  });

  // listen for 'mouse' events from the server
  socket.on('mouse', newDrawing);

  // listen for 'clear' events from the server
  socket.on('clear', clearCanvas);

  // button that clears the canvas for everyone
  const clearButton = createButton('Clear');
  clearButton.position(10, 10);
  clearButton.mousePressed(() => socket.emit('clear'));
}

function clearCanvas(){
  background(220);
}

function draw() {
}

function mouseDragged(){
  console.log(mouseX, mouseY);

  // create a data object
  // to send the mouse coordinates and this user's color
  const data = {
    x: mouseX,
    y: mouseY,
    color: myColor
  }
  // send the data object to the server
  socket.emit('mouse', data);
  // draw locally with the same function used for remote drawings
  newDrawing(data);
}

function newDrawing(data){
    noStroke();
    // use the color of the user who drew it
    fill(data.color);
    // use data coordinates received by the message
    ellipse(data.x, data.y, 20, 20);
}
