// MAMD Creative Coding & Future Web, 2026, Amaury Hamon

// Bouncing ball
let ball;

async function setup() {
  createCanvas(windowWidth, windowHeight);
  ball = {
    x: width/2,
    y: height/2,
    diameter: 50,
    speedX: 1,
    speedY: 5
  };
}

async function draw() {
  background("orangered");
  // basicBouncingBall()
  gravityBouncingBall()
  
}

function basicBouncingBall(){
  // Update ball position
  ball.x += ball.speedX;
  ball.y += ball.speedY;

  // Check for collision with canvas edges
  if (ball.x < ball.diameter / 2 || ball.x > width - ball.diameter / 2) {
    ball.speedX *= -1; // Reverse horizontal direction
  }
  if (ball.y < ball.diameter / 2 || ball.y > height - ball.diameter / 2) {
    ball.speedY *= -1; // Reverse vertical direction
  }

  // Draw the ball
  fill(255);
  ellipse(ball.x, ball.y, ball.diameter);
}

function gravityBouncingBall() {
  // Apply gravity to the ball
  ball.speedY += 0.1; // Increase vertical speed (simulate gravity)
  // Update ball position
  ball.x += ball.speedX;
  ball.y += ball.speedY;

  // Check for collision with canvas edges
  if (ball.x < ball.diameter / 2 || ball.x > width - ball.diameter / 2) {
    ball.speedX *= -1; // Reverse horizontal direction
  }
  if (ball.y < ball.diameter / 2 || ball.y > height - ball.diameter / 2) {
    ball.speedY *= -1; // Reverse vertical direction
  }

  // Draw the ball
  fill(255);
  ellipse(ball.x, ball.y, ball.diameter);
}
