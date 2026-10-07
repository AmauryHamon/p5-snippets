// MAMD Creative Coding & Future Web, 2026, Amaury Hamon

let positions;


function setup() {
  // une seule fois au début
  createCanvas(windowWidth, windowHeight);
  
  positions = [
    [0,0],
    [250, 500],
    [300, 300],
    [500, 500]
  ]
}

function draw() {

  background(220);

  fill(255, 125, 125, 50);
  noStroke();
  for (let i = 0; i < positions.length; i++){
      ellipse(positions[i][0], positions[i][1], 100, 100);
  }
  
}
