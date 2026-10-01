// MAMD Creative Coding & Future Web, 2026, Amaury Hamon

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255, 0 , 0 , 255);
}

function draw() {
  // Styles stick until you change them.
  // Think as if you were holding a pen 
  // and need to change and pick another one.


  // background(), 
  // fill(), 
  // stroke(), 
  // noFill(), 
  // noStroke(), 
  // strokeWeight()
  

  // background("orangered"); // string color name
  // background("#ccc"); // hex 3-digit color name
  // background("#191919"); // hex 6-digit color name

  // background(255); // grayscale color value
  // background(255, 255, 255); // RGB color value
  
  // background(255, 0 , 0 , 5); // RGB with Alpha
  
  
  if (mouseIsPressed === true) {
    circle(mouseX, mouseY, 100);
    
    fill(255);
} 

  
}
