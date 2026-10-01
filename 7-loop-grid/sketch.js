// MAMD Creative Coding & Future Web, 2026, Amaury Hamon

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Set angle mode so that atan2() returns angles in degrees
  
}

function draw() {
  background("orangered");

  gridAim();
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

