let socket;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(220);
  
  socket = io();
  
  
}

function draw() {
  console.log(socket.id);
}

function mouseDragged(){
  // console.log(mouseX, mouseY);

  // create a data object
  // to send the mouse coordinates and this user's color
  // const data = {
  //   x: mouseX,
  //   y: mouseY,
  //   color: myColor
  // }
  // send the data object to the server
  // socket.emit('mouse', data);
  // draw locally with the same function used for remote drawings
  newDrawing();
}

function newDrawing(){
  noStroke();
  fill(0);
  ellipse(mouseX, mouseY, 25, 25);
  // use the color of the user who drew it
  // fill(data.color);
  // use data coordinates received by the message
  // ellipse(data.x, data.y, 20, 20);
}
