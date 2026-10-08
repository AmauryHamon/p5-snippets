// Make sure HTML input is not commented in index.html!
const HTMLNumberInputX = document.getElementById("myNumberInputX");
const HTMLNumberInputY = document.getElementById("myNumberInputY");

let p5NumberInputX;
let p5NumberInputY;

let tilesX;
let tilesY;

let tilesW;
let tilesH;


function setup() {
  createCanvas(windowWidth, windowHeight);

}

function draw() {
  // Read inputs every frame so changes apply live
  tilesX = Number(HTMLNumberInputX.value);
  tilesY = Number(HTMLNumberInputY.value);

  tilesW = width / tilesX;
  tilesH = height / tilesY;

  background(0);
  fill(255);
  noStroke();

  let counter=0;

  for(let x =0; x < tilesX; x++){
    for(let y = 0; y < tilesY; y++){
      if(counter % 2 === 0){
        rect(x * tilesW, y * tilesH, tilesW, tilesH);
      }
      counter++;
    }
  }
  
}
