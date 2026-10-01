// MAMD Creative Coding & Future Web, 2026, Amaury Hamon

let x, y;
let vx = 3;
let vy = 3;
let w, h;
let col;

function setup() {
  createCanvas(windowWidth, windowHeight);

  textAlign(CENTER, CENTER);
  textSize(50);

  // measure the label so we bounce off its edges, not its center
  w = textWidth("DVD Player");
  h = textAscent() + textDescent();

  x = random(w / 2, width - w / 2);
  y = random(h / 2, height - h / 2);
  
  col = randomColor();
}

function draw() {
  background(0);

  moveText();

  fill(col);
  noStroke();
  text("DVD Player", x, y);
}

function moveText() {
  // move the text
  x += vx;
  y += vy;

  // bounce off left/right walls
  if (x - w / 2 <= 0 || x + w / 2 >= width) {
    // reverse direction
    vx *= -1;
    x = constrain(x, w / 2, width - w / 2);
    col = randomColor();
  }

  // bounce off top/bottom walls
  if (y - h / 2 <= 0 || y + h / 2 >= height) {
    // reverse direction
    vy *= -1;
    y = constrain(y, h / 2, height - h / 2);
    col = randomColor();
  }
}

function randomColor() {
  colorMode(HSB);
  let c = color(random(360), 80, 100);
  colorMode(RGB);
  return c;
}

// adapt sketch to window resizing
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  x = constrain(x, w / 2, width - w / 2);
  y = constrain(y, h / 2, height - h / 2);
}
