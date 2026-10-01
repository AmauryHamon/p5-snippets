// MAMD Creative Coding & Future Web, 2026, Amaury Hamon

function setup() {
  createCanvas(windowWidth, windowHeight);
  ellipseMode(CORNER);
  rectMode(CENTER);
}

function draw() {
  background("orangered");
  fill(255);

  // rectangle
  rect(width/4, 100, width/2, 100);

  stroke(255);
  strokeWeight(4);
  // line
  line(100, 100, 300, 300);
  
  // arc
  arc(width/4*3, height/4*3, 200, 200, 0, PI + QUARTER_PI);
  
  // triangle
  triangle(width/2, height/2-100, width/2-100, height/2+100, width/2+100, height/2+100);
  
  // quad
  quad(width/4*3-100, height/2+100, width/4*3+100, height/2+100, width/4*3+200, height/2+200, width/4*3-200, height/2+200);
  
  // ellipse
  ellipse(width/4, height/4*3, 200, 200);

  // careful with order of drawing shapes, 
  // the last one will be on top of the others
  fill("orangered");
  ellipse(width/4, height/4*3, 100, 100);
  
}
