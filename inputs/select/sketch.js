// Make sure HTML select is not commented in index.html!
const HTMLSelect = document.getElementById("mySelect");
let p5Select;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // P5 Select setup
  p5Select = createSelect('Click me too!');
  p5Select.position(width/2, height/4*3);
  p5Select.option('red');
  p5Select.option('green');
  p5Select.option('blue');
  p5Select.option('yellow');

}

function draw() {
  // P5SelectBackgroundColor();
  HTMLSelectBackgroundColor();
}

function HTMLSelectBackgroundColor(){
  let c = HTMLSelect.value;
  background(c);
}

function P5SelectBackgroundColor(){
  let c = p5Select.selected();
  background(c);
}

