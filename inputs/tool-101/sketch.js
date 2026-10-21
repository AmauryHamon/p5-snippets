// setting up HTML inputs
const uiWrapper = document.getElementById("ui");

const fontColor = document.getElementById("fontColor");
const bgColor = document.getElementById("bgColor");
const shapeColor = document.getElementById("shapeColor");
const numXinput = document.getElementById("myNumberInputX");
const numYinput = document.getElementById("myNumberInputY");
const mySlider = document.getElementById("mySlider");
const myText = document.getElementById("myText");
const autoplayCheckbox = document.getElementById("autoplayCheckbox");
const intervalSlider = document.getElementById("intervalSlider");
const openUIBtn = document.getElementById("openUIBtn");
const closeUIBtn = document.getElementById("closeUIBtn");

let showUI = true;
let lastRandomizeTime = 0;

let tilesX;
let tilesY;
let tilesW;
let tilesH;


function setup() {
  createCanvas(windowWidth, windowHeight);
  background(bgColor.value);
  fill(shapeColor.value);
  noStroke();
}

function draw() {
  drawGrid();
  drawText();

  // const now = millis();
  // if (handleAutoplay() && now - lastRandomizeTime >= handleInterval()) {
  //   randomize();
  //   lastRandomizeTime = now;
  // }
}

// Colors
function handleTextColor(){
  let col = fontColor.value
  return col
}
function handleBGColor(){
  let col = bgColor.value
  return col
}
function handleShapeColor(){
  let col = shapeColor.value
  return col
}
// Grid Rows and columns
function handleXInput(){
  tilesX = Number(numXinput.value);
  tilesW = width / tilesX;
}
function handleYInput(){
  tilesY = Number(numYinput.value);
  tilesH = height / tilesY;
}
// Draw grid from number inputs
function drawGrid(){
  handleXInput();
  handleYInput();
  let counter=0;
  background(handleBGColor());
  fill(handleShapeColor());
  noStroke();
  for(let x = 0; x < tilesX; x++){
    for(let y = 0; y < tilesY; y++){
      if(counter % 2 === 0){
        rect(x * tilesW, y * tilesH, tilesW, tilesH);
      }
      counter++;
    }
  }
}

function drawText(){
  let value = myText.value
  fill(handleTextColor());
  textAlign(CENTER, CENTER);
  textSize(handleSlider());
  text(value, width / 2, height / 2);
}
// Fontsize slider
function handleSlider(){
  let val = map(Number(mySlider.value), 
    mySlider.min, 
    mySlider.max, 
    16, 
    500);
  return val  
}

// Autoplay toggle
function handleAutoplay(){
  return autoplayCheckbox.checked;
}
// Interval slider
function handleInterval(){
  return map(
    Number(intervalSlider.value),
    Number(intervalSlider.min),
    Number(intervalSlider.max),
    100,   // shortest interval, ms
    5000   // longest interval, ms)
  )
}

function randomRGB(){
  function toHex(){
    // random number between 0 and 255, convert to hex, pad with 0 if needed
    return Math.floor(random(256)).toString(16).padStart(2, "0");
  }
  return `#${toHex()}${toHex()}${toHex()}`;
}

// when clicking button
function randomize(){
  numXinput.value = Math.floor(random(1,50))
  numYinput.value = Math.floor(random(1,50))
  mySlider.value = random(mySlider.min, mySlider.max)
  fontColor.value = randomRGB()
  bgColor.value = randomRGB()
  shapeColor.value = randomRGB()

  drawGrid();
  drawText();
}

// ==============================================
// ADVANCED: 
// saving and loading presets as JSON files

// activated when clicking the "Save JSON" button
function savePreset(){
  // 1. store current values in an object
  const preset = {
    text: myText.value,
    gridX: Number(numXinput.value),
    gridY: Number(numYinput.value),
    sliderValue: Number(mySlider.value),
    fontColor: fontColor.value,
    bgColor: bgColor.value,
    shapeColor: shapeColor.value
  };
  // 2. create a Blob from the JSON string
  const blob = new Blob([JSON.stringify(preset, null, 2)], { type: "application/json" });

  // 3. create a temp download link
  const downloadUrl = URL.createObjectURL(blob);
  const downloadLink = document.createElement("a");
  downloadLink.href = downloadUrl;
  downloadLink.download = "p5-tool-preset.json";
  // 4. programmatic click to trigger the download
  downloadLink.click();
  // 5. revoke the object URL after a short delay to free memory
  setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
}

// activated when clicking the "Load JSON" button
function loadPreset(event){
  // 1. get the selected file
  const file = event.target.files[0];

  // 2. check if a file was selected
  if (!file) return;

  // 3. read the file as text
  // https://developer.mozilla.org/en-US/docs/Web/API/FileReader
  const reader = new FileReader();
  reader.onload = () => {
    try {
      // 4. parse the JSON and validate its structure
      const preset = JSON.parse(reader.result);
      const validGridX = Number.isInteger(preset.gridX) && preset.gridX >= Number(numXinput.min) && preset.gridX <= Number(numXinput.max);
      const validGridY = Number.isInteger(preset.gridY) && preset.gridY >= Number(numYinput.min) && preset.gridY <= Number(numYinput.max);
      const validSlider = Number.isFinite(preset.sliderValue) && preset.sliderValue >= Number(mySlider.min) && preset.sliderValue <= Number(mySlider.max);
      const validColors = [preset.fontColor, preset.bgColor, preset.shapeColor].every((value) => /^#[0-9a-f]{6}$/i.test(value));
      // 5.1 if any of the values are invalid, throw an error
      if (typeof preset.text !== "string" || !validGridX || !validGridY || !validSlider || !validColors) {
        throw new Error("Invalid preset values");
      }
      // 5.2 if valid, apply the values to the inputs
      myText.value = preset.text;
      numXinput.value = preset.gridX;
      numYinput.value = preset.gridY;
      mySlider.value = preset.sliderValue;
      fontColor.value = preset.fontColor;
      bgColor.value = preset.bgColor;
      shapeColor.value = preset.shapeColor;
    } catch {
      // 5.3 if parsing or validation fails, show an alert
      window.alert("Could not load preset. Choose a valid JSON preset saved by this tool.");
    }
    // 6. clear the file input value so the same file can be selected again if needed
    event.target.value = "";
  };
  // 7. handle file read errors
  reader.onerror = () => {
    window.alert("Could not read the selected preset file.");
    event.target.value = "";
  };
  // 8. start reading the file as text
  reader.readAsText(file);
}

function exportSketch(){
  saveCanvas("myCanvas", "png");
}

function toggleUI(){
  showUI = !showUI;
  console.log("showUI", showUI);
  if(!showUI){
    uiWrapper.classList.add('hidden');
    openUIBtn.classList.remove('hidden');
  } else {
    uiWrapper.classList.remove('hidden');
    openUIBtn.classList.add('hidden');
  }
}

function keyPressed(e){
  if(key === "Escape"){
    toggleUI();
  }
  if(key === "r"){
    randomize();
  }
  if(key === "s"){
    exportSketch();
  }

}