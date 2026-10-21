// MAMD Creative Coding & Future Web, 2026, Amaury Hamon

let img;
let cols, rows; 
let w, h;


async function setup() {
  createCanvas(windowWidth, windowHeight);
  img = await loadImage("assets/nokia.jpg");
}

async function draw() {
  background("orangered");
  displayImage();
}

function displayImage() {
  cols = map(mouseX, 0, width, 2, 100);
  rows = map(mouseY, 0, height, 2, 100);
  w = width / cols;
  h = height / rows;

  for(let x = 0; x < cols; x++){
    for(let y = 0; y < rows; y++){
      let imageX = map(x, 0, cols, 0, img.width);
      let imageY = map(y, 0, rows, 0, img.height);
      
      // https://p5js.org/reference/p5/get/
      let c = img.get(imageX, imageY);
      fill(c);
      if(brightness(c) > 50){
        ellipse(x * w + w / 2, y * h + h / 2, w, h);
      } else {
        rect(x * w, y * h, w, h);
      }
    }
  }
}

