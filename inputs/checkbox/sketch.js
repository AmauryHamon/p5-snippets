// Make sure HTML input is not commented in index.html!
const HTMLCheckbox = document.getElementById("myCheckbox");
let p5Checkbox;

let foregroundCol;
let backgroundCol;


function setup() {
  foregroundCol = color(random(0,255),random(0,255), random(0,255));
  backgroundCol = color(random(0,255),random(0,255), random(0,255));
  createCanvas(windowWidth, windowHeight);
  
  background(backgroundCol);
  fill(foregroundCol);
  circle(width/2, height/2, height/2);
  
  // p5 checkbox setup
  p5Checkbox = createCheckbox();
  p5Checkbox.position(width/2-250, height-50);

}

function draw() {
  handleP5Checkbox();
  // handleHTMLCheckbox();
  
}

function handleP5Checkbox(){
  let isChecked = p5Checkbox.checked();
  swapColors(isChecked);
}
function handleHTMLCheckbox(){
  let isChecked = HTMLCheckbox.checked;
  swapColors(isChecked);

}
function swapColors(bool){
  if(bool){
    background(backgroundCol);
    fill(foregroundCol);
    circle(width/2, height/2, height/2);
  } else {
    background(foregroundCol);
    fill(backgroundCol);
    circle(width/2, height/2, height/2);
  }
}