// Make sure HTML input is not commented in index.html!
const HTMLButton = document.getElementById("myButton");
let p5Button;

let bgColor;



function setup() {
  createCanvas(windowWidth, windowHeight);

  // HTML Button
  bgColor = color(0,0,0);
  background(bgColor);

  // P5 Button
  p5Button = createButton('Click me too!');
  p5Button.position(width/2, height/4*3);
  p5Button.mousePressed(randomBackgroundColor);

}

function draw() {
  
}

function randomBackgroundColor(){
  bgColor = color(random(0,255), random(0,255), random(0,255));
  background(bgColor);
}
