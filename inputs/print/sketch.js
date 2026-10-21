// Colors for the balls
const colors = [
  "#ff4200", 
  "#0042ff", 
  "#42ff00", 
  "#dddddd", 
  "#000000", 
  "#bbbbbb"];

// A3 dimensions
// 842 x 1191 pixels at 72 DPI
const posterWidth = 842;
const posterHeight = 1191;


function generateComposition() {
  // Clear existing balls
  const existingBalls = document.querySelectorAll(".ball");
  existingBalls.forEach((ball) => ball.remove());

  // Generate new balls
  const numBalls = Math.floor(Math.random() * 15) + 10; // 10-24 balls

  for (let i = 0; i < numBalls; i++) {
    createBall();
  }
}

function createBall() {
  // 1. Create new HTML element
  const ball = document.createElement("div");
  // 2. Add class for CSS styling
  ball.className = "ball";

  // Random size+position properties
  const radius = Math.random() * 100 + 10; // 10-50px radius
  const x = Math.random() * (posterWidth - radius * 2) + radius;
  const y = Math.random() * (posterHeight - radius * 2) + radius;
  
  // Set ball size + position properties
  ball.style.width = radius * 2 + "px";
  ball.style.height = radius * 2 + "px";
  ball.style.left = x + "px";
  ball.style.top = y + "px";
  
  
  // store color indexes for the ball
  ball.colorIndexes = [];
  for (let i = 0; i < 4; i++) {
    let colorIndex = Math.floor(Math.random() * colors.length);
    ball.colorIndexes.push(colorIndex);
  }
  
  // random gradient position
  ball.gradientX = Math.random() * 100;
  ball.gradientY = Math.random() * 100;
  
  // Set ball background gradient
  setBallBackground(ball);

  // Add HTML element to poster
  document
    .getElementById("poster")
    .appendChild(ball);
}

function setBallBackground(ball) {
  let ballColors = ball.colorIndexes.map((index) => colors[index]);
  ball.style.background = `radial-gradient(circle at ${ball.gradientX}% ${ball.gradientY}%, ${ballColors.join(", ")})`;
}

function updateBallColors() {
  let balls = document.querySelectorAll(".ball");
  balls.forEach((ball) => setBallBackground(ball));
}


// Initialize when page loads
document.addEventListener("DOMContentLoaded", function () {
  // Generate initial composition
  generateComposition();

  // Set up event listeners
  document
    .getElementById("regenerateBtn")
    .addEventListener("click", generateComposition);

  document
    .getElementById("printBtn")
    .addEventListener("click", printPoster);

  document
    .getElementById("randomColorsBtn")
    .addEventListener("click", randomizeColors);

  // set initial color input values based on the colors array
  document.getElementById("color1").value = colors[0];
  document.getElementById("color2").value = colors[1];
  document.getElementById("color3").value = colors[2];
  document.getElementById("color4").value = colors[3];

  // listen to color inputs change
  document.getElementById("color1").addEventListener("input", function (e) {
    colors[0] = e.target.value;
    updateBallColors();
  });
  document.getElementById("color2").addEventListener("input", function (e) {
    colors[1] = e.target.value;
    updateBallColors();
  });
  document.getElementById("color3").addEventListener("input", function (e) {
    colors[2] = e.target.value;
    updateBallColors();
  });
  document.getElementById("color4").addEventListener("input", function (e) {
    colors[3] = e.target.value;
    updateBallColors();
  });
});

// optional: lighten colors
function lightenColor(color, factor) {
  const hex = color.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  const newR = Math.min(255, Math.floor(r + (255 - r) * factor));
  const newG = Math.min(255, Math.floor(g + (255 - g) * factor));
  const newB = Math.min(255, Math.floor(b + (255 - b) * factor));

  return `rgb(${newR}, ${newG}, ${newB})`;
}

function printPoster() {
  window.print();
}

function randomizeColors(){
  for (let i = 0; i < colors.length; i++) {
    colors[i] = `#${Math.floor(Math.random()*16777215).toString(16)}`;
  }
  // Update the color input values
  document.getElementById("color1").value = colors[0];
  document.getElementById("color2").value = colors[1];
  document.getElementById("color3").value = colors[2];
  document.getElementById("color4").value = colors[3];
  updateBallColors();
}