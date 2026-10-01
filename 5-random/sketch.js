// MAMD Creative Coding & Future Web, 2026, Amaury Hamon

let circleX;
let circleY;
let circleColor;

function setup() {
  createCanvas(windowWidth, windowHeight);
  setPositionAndColor();

}

function draw() {
  
  drawCircle();
}

function setPositionAndColor(){
  circleX = random(0, width);
  circleY = random(0, height);
  circleColor = color(random(0, 255), random(0, 255), random(0, 255));
}

function mousePressed(){
  setPositionAndColor();
}

function drawCircle(){
  fill(circleColor);
  circle(circleX, circleY, 100);
}