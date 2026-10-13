// Make sure HTML input is not commented in index.html!
const HTMLColorPicker = document.getElementById("HTMLColorPicker");

let p5ColorPicker;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  let p5Color = "#00ff00";
  p5ColorPicker = createColorPicker(p5Color);
  //setting up p5 Slider
  p5ColorPicker.position(width/2-250, height-50);
}

function draw() {
  background(220);
  
  useHTMLColorPicker();
  // useP5ColorPicker();

}

function useHTMLColorPicker(){
  let HTMLColor = HTMLColorPicker.value;
  background(HTMLColor)

}

function useP5ColorPicker(){
  let val = p5ColorPicker.value();
  background(val);
}