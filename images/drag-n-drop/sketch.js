// MAMD Creative Coding & Future Web, 2026, Amaury Hamon

let images = [];
let draggedImage;
let dragOffsetX = 0;
let dragOffsetY = 0;
let originalImageWidth;
let originalImageHeight;

function preload() {
  // load images and store them in an array of objects
  let imageFiles = ["carpet.jpg", "cat.jpg", "nokia.jpg"];
  images = imageFiles.map((file) => ({
    image: loadImage(`assets/${file}`),
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  }));
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  positionImages();
}

function draw() {
  background("orangered");

  for (let item of images) {
    image(item.image, item.x, item.y, item.width, item.height);
  }
}

function positionImages() {
  let maxWidth = 240;
  let maxHeight = 240;

  for (let index = 0; index < images.length; index++) {
    let item = images[index];
    // calculate the scale to fit 
    // the image within the max dimensions
    let scale = 1;
    let scaleToFitWidth = maxWidth / item.image.width;
    let scaleToFitHeight = maxHeight / item.image.height;
    // choose the smaller scale to fit within the max dimensions
    if (scaleToFitWidth < scale) {
      scale = scaleToFitWidth;
    }
    if (scaleToFitHeight < scale) {
      scale = scaleToFitHeight;
    }
    // set the width and height 
    // of the image based on the scale
    item.width = item.image.width * scale;
    item.height = item.image.height * scale;
    // calculate the position of the image 
    // to center it horizontally and vertically
    let spaceBetweenCenters = width / (images.length + 1);
    let imageCenterX = spaceBetweenCenters * (index + 1);

    item.x = imageCenterX - item.width / 2;
    item.y = height / 2 - item.height / 2;
  }
}
function mouseMoved() {
  cursor(ARROW);

  for (let item of images) {
    let insideImage =
      mouseX >= item.x &&
      mouseX <= item.x + item.width &&
      mouseY >= item.y &&
      mouseY <= item.y + item.height;

    if (insideImage) {
      cursor(HAND);
      break;
    }
  }
}
function mousePressed() {
  // start loop from the last image to the first one 
  // to detect which image is on top
  for (let index = images.length - 1; index >= 0; index--) {
    let item = images[index];

    // boolean: detect if mouse is inside the image
    let insideImage = 
      mouseX >= item.x && 
      mouseX <= item.x + item.width &&
      mouseY >= item.y && 
      mouseY <= item.y + item.height;

    if (insideImage) {
      // store the dragged image 
      draggedImage = item;
      originalImageWidth = item.width;
      originalImageHeight = item.height;
      // store the offset
      dragOffsetX = mouseX - item.x;
      dragOffsetY = mouseY - item.y;
      
      // extract dragged image from array
      images.splice(index, 1);
      // place it back on top of others
      images.push(item);
      return;
    }
  }
}

function mouseDragged() {
  if (draggedImage) {
    // update the position of the dragged image
    scaleDraggedImage();
    draggedImage.x = mouseX - dragOffsetX;
    draggedImage.y = mouseY - dragOffsetY;
  }
}

function scaleDraggedImage(){
  if (draggedImage) {
    draggedImage.width = lerp(draggedImage.width, originalImageWidth * 1.1, 0.1);
    draggedImage.height = lerp(draggedImage.height, originalImageHeight * 1.1, 0.1);
  }
}


function mouseReleased() {
  // reset the dragged image 
  // when mouse is released
  if (draggedImage) {
    draggedImage.width = originalImageWidth;
    draggedImage.height = originalImageHeight;
  }
  draggedImage = undefined;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  positionImages();
}
