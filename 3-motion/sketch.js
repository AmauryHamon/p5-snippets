// MAMD Creative Coding & Future Web, 2026, Amaury Hamon

let x;
let y;
let targetX;
let targetY;
let direction = 1;

let easing = 0.015;

// LERP (Linear Interpolation) variables
let lerpStart = 0;
let lerpEnd = 0;
let lerpCurrent = 0;
let lerpTarget = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  x = 1;
  y = 1;
  targetX = x;
  targetY = y;

  // Initialize LERP
  lerpStart = 100;
  lerpEnd = width - 100;
  lerpCurrent = lerpStart;
  lerpTarget = lerpEnd;

  textAlign(CENTER);
  textSize(20);
  
}

function draw() {
  background("orangered");
  
  // loopSingleDirSingleAxis();
  // loopBothDirSingleAxis();
  // easingCircle();
  // sinWave();
  // cosWave();
  // circleMove();
  // lerpMovement();
  randomMoveInterval();
  // perlinNoiseMove();
}

function loopSingleDirSingleAxis() {
  // This function makes the circle move
  // across the screen in a single direction.

  x += 5;
  ellipse(x, height/2, 50, 50);
  if (x > width) {
    x = 0;
  }
  text("Loop Single Direction", x, height/2 + 50);

}
function loopBothDirSingleAxis() {
  // This function makes the circle move 
  // back and forth across the screen.
  x += 5 * direction;
  if (x >= width || x <= 0) {
    direction *= -1;
  }
  ellipse(x, height/2, 50, 50);

  // Label
  text("Loop Both Directions", x, height/2 + 50);
}

function easingCircle() {
  // Easing is a technique to make the movement 
  // of an object more natural and smooth. 
  // Instead of moving the object directly 
  // to the target position, we move it 
  // a fraction of the distance towards 
  // the target each frame. This creates a smooth 
  // transition effect.

  let targetX = mouseX;
  let dX = targetX - x;
  x += dX * easing;

  let targetY = mouseY;
  let dY = targetY - y;
  y += dY * easing;

  ellipse(x, y, 50, 50);

  // Label
  text("Easing", x, y + 50);

}

function lerpMovement(){
  // LERP (Linear Interpolation)
  // Smoothly interpolate between current and target
  // lerp(current, target, amount) where amount is 0-1
  // Lower amount = slower, higher amount = faster
  lerpCurrent = lerp(lerpCurrent, lerpTarget, 0.05);

  // Switch direction when reaching target
  if (abs(lerpCurrent - lerpTarget) < 1) {
    if (lerpTarget == lerpEnd) {
      lerpTarget = lerpStart;
    } else {
      lerpTarget = lerpEnd;
    }
  }

  fill(255);
  noStroke();
  circle(lerpCurrent, height/2, 50);

  // Label
  text("LERP", lerpCurrent, height/2 + 50);
}

function sinWave(){
  // This function makes the circle move in a sine wave pattern.
  // sine wave is a mathematical function 
  // that describes a smooth, periodic oscillation.

  // The difference between sine and cosine is that
  // cosine starts at its maximum value when the angle is 0, 
  // while sine starts at 0.
  x = width / 2;
  y = height / 2 + sin(millis() / 1000) * 100;
  ellipse(x, y, 50, 50);

  // Label
  text("sin", x, y + 50);
}

function cosWave(){
  // This function makes the circle move in a cosine wave pattern.
  // cosine wave is a mathematical function 
  // that describes a smooth, periodic oscillation.

  // The difference between sine and cosine is that
  // cosine starts at its maximum value when the angle is 0, 
  // while sine starts at 0.
  x = width / 2;
  y = height / 2 + cos(millis() / 1000) * 100;
  ellipse(x, y, 50, 50);

  // Label
  text("cos", x, y + 50);
}

function circleMove(){
  // This function makes the circle move in a circular path.
  // A circle is a set of points that are all 
  // the same distance from a center point.
  // In this case, the center point is the middle of the screen.

  // More infos: https://p5js.org/examples/Angles-And-Motion-Sine-Cosine/
  let radius = 100;
  let angle = millis() / 1000; // Angle in radians based on time
  x = width / 2 + radius * cos(angle);
  y = height / 2 + radius * sin(angle);

  ellipse(x, y, 50, 50);
  text("Circle move", width/2, height/2);

}

function randomMoveInterval(){
  // This function makes the circle move to a random position
  // on the screen at regular intervals.
  if (frameCount % 60 === 0) { // Change position every second (assuming 60 FPS)
    targetX = random(width);
    targetY = random(height);
  }

  x = lerp(x, targetX, 0.1);
  y = lerp(y, targetY, 0.1);
  ellipse(x, y, 50, 50);

  text("Random Move Interval", width/2, height/2);
}

function perlinNoiseMove(){
  // This function makes the circle move in a smooth, 
  // random pattern using Perlin noise.
  // Perlin noise is a type of gradient 
  // noise that produces a more natural, 
  // smooth randomness compared to 
  // traditional random functions.

  let noiseScale = 0.001; // Scale for the noise function
  x = width * noise(millis() * noiseScale);
  y = height * noise((millis() + 1000) * noiseScale); // Offset for y to get different values

  ellipse(x, y, 50, 50);
  text("Perlin Noise Move", width/2, height/2);
}


