// MAMD Creative Coding & Future Web, 2026, Amaury Hamon

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Set angle mode so that atan2() returns angles in degrees
  
}

function draw() {
  background("orangered");

  
  
  // singleAim();
  // gridAim();
  eyeAim();  
}

function singleAim() {
  // move origin to center of canvas 
  translate(width / 2, height / 2);
  // Get the mouse's coordinates relative to the origin
  let x = mouseX - width/2;
  let y = mouseY - height/2;

  // Calculate the angle between the mouse and the origin
  // https://p5js.org/reference/p5/atan2/
  let a = atan2(y, x);

  // Rotate
  rotate(a);

  // Draw the shape
  rect(-width/8, -10, width/4, 20);
}

function gridAim() {
  // move origin to center of canvas 
  translate(width / 2, height / 2);

  // Draw a grid of shapes all aiming at the mouse
  for (let x = -width/2; x < width/2; x += 50) {
    for (let y = -height/2; y < height/2; y += 50) {
      push();
      translate(x, y);
      let a = atan2(mouseY - (height/2 + y), mouseX - (width/2 + x));
      rotate(a);
      rect(width/32, -5, -width/16, 10);
      pop();
    }
  }
}

function eyeAim() {
  // angleMode(DEGREES);
  fill(255);
  // move origin to center of canvas 
  // translate(width / 2, height / 2);

  // Draw left eye
  let leftX = width / 2 - width / 6;
  let leftY = height / 2;

  // Calculate angle between left eye and mouse
  let leftAngle = atan2(mouseY - leftY, mouseX - leftX);

  push();
  translate(leftX, leftY);
  // eye socket
  fill(255);
  ellipse(0, 0, width / 6, width / 6);
  // pupil
  rotate(leftAngle);
  fill(0);
  ellipse(width / 24, 0, width / 12, width / 12);
  pop();

  // Draw right eye
  let rightX = width / 2 + width / 6;
  let rightY = height / 2;

  // Calculate angle between right eye and mouse
  let rightAngle = atan2(mouseY - rightY, mouseX - rightX);

  push();
  translate(rightX, rightY);
  // eye socket
  fill(255);
  ellipse(0, 0, width / 6, width / 6);
  // pupil
  rotate(rightAngle);
  fill(0);
  ellipse(width / 24, 0, width / 12, width / 12);
  pop();

  
}