// MAMD Creative Coding & Future Web, 2026, Amaury Hamon

let secondsRadius;
let minutesRadius;
let hoursRadius;
let clockDiameter;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);

  let radius = min(width, height) / 2;
  secondsRadius = radius * 0.5;
  minutesRadius = radius * 0.45;
  hoursRadius = radius * 0.25;
  clockDiameter = radius * 1;
  
}

function draw() {
  background("orangered");

  translate(width / 2, height / 2);

  fill(255);
  ellipse (0,0, clockDiameter*1.01, clockDiameter*1.01);
  fill("orangered");
  ellipse (0,0, clockDiameter, clockDiameter);

  let secAngle = map(second(), 0, 60, 0, 360);
  let minAngle = map(minute(), 0, 60, 0, 360);
  let hourAngle = map(hour(), 0, 12, 0, 360);
  
  stroke(255);

  push();
  strokeWeight(1);
  line(0, 0, secondsRadius * cos(secAngle), secondsRadius * sin(secAngle));
  pop();

  push();
  strokeWeight(2);
  line(0, 0, minutesRadius * cos(minAngle), minutesRadius * sin(minAngle));
  pop();

  push();
  strokeWeight(4);
  line(0, 0, hoursRadius * cos(hourAngle), hoursRadius * sin(hourAngle));
  pop();
  
}
