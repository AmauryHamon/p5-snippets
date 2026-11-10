
let mySound;

function preload() {
  mySound = loadSound("assets/878406__josefpres__piano-loops-217-octave-down-short-loop-120-bpm.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
}

function mousePressed() {
  userStartAudio();
  if (mySound.isPlaying()) {
    mySound.pause();
  } else {
    mySound.play();
  }
}
