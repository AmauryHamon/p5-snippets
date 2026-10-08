// Make sure HTML input is not commented in index.html!
const HTMLSlider = document.getElementById("slider");

let p5Slider;
function setup() {
  createCanvas(windowWidth, windowHeight);

  //setting up p5 Slider
  p5Slider = createSlider(0, width, 100, 1);
  p5Slider.position(width/2-250, height-50);
  p5Slider.size(500);
}

function draw() {
  
  background(220);
  fill("orangered");
  
  // useHTMLSlider();
  useP5Slider();

}

function useHTMLSlider(){
  const diameter = map(
    Number(HTMLSlider.value), 
    HTMLSlider.min, 
    HTMLSlider.max, 
    100, 
    width);
  circle(width/2, height/2, diameter);
}

function useP5Slider(){
  let val = p5Slider.value();
  circle(width/2, height/2, val);
}