// Make sure HTML input is not commented in index.html!
const HTMLTextInput = document.getElementById("textInput");

let p5TextInput;

function setup() {
  createCanvas(windowWidth, windowHeight);

  //setting up p5 text input
  p5TextInput = createInput("Change me", width, 100, 1);
  p5TextInput.position(width/2-250, height-50);
  p5TextInput.size(500);
  textSize(250);
  textAlign(CENTER, CENTER);
}

function draw() {
  
  background(220);
  fill("orangered");
  
  // useHTMLTextInput();
  useP5TextInput();

}

function useHTMLTextInput(){
  let value = HTMLTextInput.value
  text(value, width / 2, height / 2);

}

function useP5TextInput(){
  let val = p5TextInput.value();
  text(val, width / 2, height / 2);
}