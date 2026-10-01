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
  // 60 fois par seconde, en boucle
  background(220);
  
  // if (mouseX < width / 2){
  //   fill(255, 0, 0);
  //   ellipse(mouseX, mouseY, 200, 200);
  // } else {
  //   fill (0, 0, 255);
  //   ellipse(mouseX, mouseY, 200, 200);

  // }
  fill(255, 125, 125, 50);
  noStroke();
  // for (let i = 0; i < positions.length; i++){
  //     ellipse(positions[i][0], positions[i][1], 100, 100);
  // }
  for (let x = 0; x < 50; x++){
    for (let y = 0; y < 50; y++) {
        rect(x * 50, y * 50, 30, 30);
    }
  }
}
