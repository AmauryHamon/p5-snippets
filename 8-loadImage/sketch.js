// MAMD Creative Coding & Future Web, 2026, Amaury Hamon

let img;

async function setup() {
  createCanvas(windowWidth, windowHeight);
  img = await loadImage("assets/nokia.jpg");
}

async function draw() {
  background("orangered");
  
  displayImage();
  
  
}

function displayImage() {
  fill(255);
  imageMode(CENTER);
  image(img, mouseX, mouseY, 200, 200);
}