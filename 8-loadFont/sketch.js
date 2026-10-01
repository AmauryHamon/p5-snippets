// MAMD Creative Coding & Future Web, 2026, Amaury Hamon

let font;

async function setup() {
  createCanvas(windowWidth, windowHeight);
  font = await loadFont("assets/SCKirbyBETA-Black.otf");
}

async function draw() {
  background("orangered");
  displayMessage();
  
  
}

function displayMessage() {
  fill(255);
  textFont (font);
  textSize(100);
  textAlign(CENTER, CENTER);
  text("Hello World", width/2, height/2);
}