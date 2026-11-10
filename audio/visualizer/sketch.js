// MAMD Creative Coding & Future Web, 2026, Amaury Hamon

// Audio visualizer
// Click the canvas to play / pause the song.
// Choose a visualizer with the dropdown (bottom left),
// and tweak it with the sliders above the dropdown.

let mySound;
let amplitude; // measures how LOUD the sound is
let fft; // splits the sound into FREQUENCIES (low to high)
let dropdown; // HTML <select> menu to pick a visualizer
let smoothSlider; // how smooth (slow) or jumpy (fast) the values are
let binsSlider; // how many frequency bands the FFT uses

function preload() {
  mySound = loadSound("assets/878406__josefpres__piano-loops-217-octave-down-short-loop-120-bpm.mp3");
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  // Only clicks ON THE CANVAS play / pause.
  // (So clicking the dropdown doesn't pause the song.)
  canvas.mousePressed(togglePlay);

  // createSelect() makes a dropdown menu
  dropdown = createSelect();
  dropdown.option("Volume circle");
  dropdown.option("Spectrum bars");
  dropdown.option("Waveform line");
  dropdown.option("Bass mid treble");
  dropdown.position(20, height - 50); // bottom left
  dropdown.style("font-size", "16px");

  // createSlider(min, max, start value, step)
  // Smoothing: 0 = jumpy, 0.99 = very smooth
  smoothSlider = createSlider(0, 0.99, 0.9, 0.01);
  smoothSlider.position(20, height - 120);
  smoothSlider.size(150);
  smoothSlider.input(updateSmoothing); // runs every time the slider moves

  // FFT bins must be a power of 2: 16, 32, 64 ... 1024
  // So the slider goes from 4 to 10, and we use 2^value (pow(2, value))
  binsSlider = createSlider(4, 10, 6, 1); // starts at 2^6 = 64 bins
  binsSlider.position(20, height - 90);
  binsSlider.size(150);
  binsSlider.input(updateBins);

  amplitude = new p5.Amplitude();
  amplitude.smooth(smoothSlider.value());

  // new p5.FFT(smoothing, bins)
  fft = new p5.FFT(smoothSlider.value(), pow(2, binsSlider.value()));

  textAlign(CENTER);
  textSize(20);
}

function draw() {
  background("orangered");

  // value() gives the option currently picked in the dropdown
  let choice = dropdown.value();

  if (choice === "Volume circle") {
    volumeCircle();
  } else if (choice === "Spectrum bars") {
    spectrumBars();
  } else if (choice === "Waveform line") {
    waveformLine();
  } else if (choice === "Bass mid treble") {
    bassMidTreble();
  }

  drawControls(choice);

  if (!mySound.isPlaying()) {
    fill(255);
    noStroke();
    text("Click to play", width / 2, height - 40);
  }
}

function togglePlay() {
  userStartAudio(); // browsers only allow sound after a click
  if (mySound.isPlaying()) {
    mySound.pause();
  } else {
    mySound.loop();
  }
}

function updateSmoothing() {
  let smoothing = smoothSlider.value();
  amplitude.smooth(smoothing);
  fft.smooth(smoothing);
}

function updateBins() {
  // The number of bins can't change on an existing FFT,
  // so we delete the old one and make a new one.
  let bins = pow(2, binsSlider.value());
  fft.dispose();
  fft = new p5.FFT(smoothSlider.value(), bins);
}

function drawControls(choice) {
  // Show only the sliders that change the chosen visualizer,
  // with a label next to each one.
  push();
  textAlign(LEFT, CENTER);
  textSize(16);
  fill(255);
  noStroke();

  // Smoothing doesn't change the waveform (it's the raw sound wave)
  if (choice === "Waveform line") {
    smoothSlider.hide();
  } else {
    smoothSlider.show();
    text("Smoothing: " + nf(smoothSlider.value(), 1, 2), 180, height - 110);
  }

  // The volume circle uses p5.Amplitude, not the FFT
  if (choice === "Volume circle") {
    binsSlider.hide();
  } else {
    binsSlider.show();
    text("FFT bins: " + pow(2, binsSlider.value()), 180, height - 80);
  }

  pop();
}

function volumeCircle() {
  // getLevel() gives the volume right now,
  // from 0 (silence) to about 1 (very loud).
  let level = amplitude.getLevel();

  // map() turns the volume into a size in pixels.
  // If the circle stays small, lower the 0.5.
  let diameter = map(level, 0, 0.5, 20, height);

  fill(255);
  noStroke();
  circle(width / 2, height / 2, diameter);

  // nf() rounds the number to 2 decimals
  text("Volume: " + nf(level, 1, 2), width / 2, 40);
}

function spectrumBars() {
  // analyze() returns a list (array) of numbers, one per bin
  // (16 to 1024, see the "FFT bins" slider).
  // Each number is how loud one frequency is, from 0 to 255.
  // Left = low sounds (bass), right = high sounds.
  let spectrum = fft.analyze();

  let barWidth = width / spectrum.length;

  fill(255);
  noStroke();
  for (let i = 0; i < spectrum.length; i++) {
    let x = i * barWidth;
    let barHeight = map(spectrum[i], 0, 255, 0, height);
    // Bars grow up from the bottom of the screen
    rect(x, height - barHeight, barWidth, barHeight);
  }

  text("Spectrum", width / 2, 40);
}

function waveformLine() {
  // waveform() returns a list of numbers between -1 and 1,
  // one per bin (more bins = more detailed line).
  // It is the shape of the sound wave right now.
  let wave = fft.waveform();

  noFill();
  stroke(255);
  strokeWeight(3);

  // beginShape() + vertex() + endShape() = connect the dots
  beginShape();
  for (let i = 0; i < wave.length; i++) {
    let x = map(i, 0, wave.length, 0, width);
    let y = map(wave[i], -1, 1, height, 0);
    vertex(x, y);
  }
  endShape();

  fill(255);
  noStroke();
  text("Waveform", width / 2, 40);
}

function bassMidTreble() {
  // getEnergy() tells how loud a group of frequencies is (0 to 255).
  // https://v1.p5js.org/reference/p5.FFT/getEnergy/
  // analyze() must be called first, every frame.
  fft.analyze();
  let bass = fft.getEnergy("bass");
  let mid = fft.getEnergy("mid");
  let treble = fft.getEnergy("treble");

  // The energy (0 to 255) is used directly as the circle size
  fill(255);
  noStroke();
  circle(width * 0.25, height / 2, bass);
  circle(width * 0.5, height / 2, mid);
  circle(width * 0.75, height / 2, treble);

  text("Bass", width * 0.25, height / 2 + 160);
  text("Mid", width * 0.5, height / 2 + 160);
  text("Treble", width * 0.75, height / 2 + 160);
}
