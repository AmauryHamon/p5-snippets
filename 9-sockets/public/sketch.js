// MAMD Creative Coding & Future Web, 2026, Amaury Hamon

// socket.io instance, connected in setup()
let socket;

// this client's color, picked once per session
let myColor;

// local copy of every dot drawn so far,
// so the canvas can be redrawn after a resize
let dots = [];

let liveClients = 0;
let countLabel;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(220);

  // pick a random color for this user
  myColor = [floor(random(256)), floor(random(256)), floor(random(256))];

  // connect only once the canvas exists,
  // so the history can't arrive before we can draw it
  socket = io();

  // redraw everything drawn before this client joined
  // (also sent again on reconnect, e.g. after a server restart,
  // so start from a blank canvas to stay in sync with the server)
  socket.on('history', (history) => {
    dots = history;
    redrawAll();
  });

  // listen for 'mouse' events from the server
  socket.on('mouse', addDot);

  // listen for 'clear' events from the server
  socket.on('clear', () => {
    dots = [];
    clearCanvas();
  });


  socket.on('clients', (count) => {
    liveClients = count;
  })
  countLabel = createP('')
  countLabel.id('client-count')


  // button that clears the canvas for everyone
  const clearButton = createButton('Clear');
  clearButton.position(10, 10);
  clearButton.mousePressed(() => socket.emit('clear'));
  
  console.log(socket)
}

function clearCanvas(){
  background(220);
}

function draw() {
  drawLiveClientCount();
}

function mouseDragged(){
  // console.log(mouseX, mouseY);

  // create a data object
  // to send the mouse coordinates and this user's color
  const data = {
    x: mouseX / width,
    y: mouseY / height,
    color: myColor
  }
  // send the data object to the server
  socket.emit('mouse', data);
  // store and draw locally, same as remote drawings
  addDot(data);
}

// remember a dot and draw it
function addDot(data){
  dots.push(data);
  newDrawing(data);
}

// repaint the whole drawing from the local copy
function redrawAll(){
  clearCanvas();
  dots.forEach(newDrawing);
}

function newDrawing(data){
    noStroke();
    // use the color of the user who drew it
    fill(data.color);
    // use data coordinates received by the message
    ellipse(data.x * width, data.y * height, 20, 20);
}



function countLiveClients() {
    return liveClients;
}

function drawLiveClientCount() {
    countLabel.html(`Live clients: ${countLiveClients()}`);

}

function windowResized() {
  
  resizeCanvas(windowWidth, windowHeight);
  // resizing wipes the canvas, so repaint everything
  redrawAll();
}