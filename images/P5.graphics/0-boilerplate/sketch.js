// MAMD Creative Coding & Future Web, 
// MAVK Programming Designs
// HEAD–Geneva
// 2026, Amaury Hamon

let pg;

function setup() {

  createCanvas(windowWidth, windowHeight);
  
  // Separate layer for drawing
  pg = createGraphics(windowWidth/2, windowHeight/2);
}

function draw() {
  background("orangered");

  // dot syntax to draw on P5 Graphics objects
  pg.background("white");

  imageMode(CENTER);
  image(pg, width/2, height/2)

  
}
