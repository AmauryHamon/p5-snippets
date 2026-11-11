// MAMD Creative Coding & Future Web, 2026, Amaury Hamon

// 3D letter (stacked copies)
// Type a letter in the box (top left).
// Move the mouse to turn the letter.

let font;
let letterInput; // HTML text box
let depth = 60; // how thick the letter is, in pixels

function preload() {
  // In 3D (WEBGL), text() only works with a font loaded by loadFont()
  font = loadFont("assets/SCKirbyBETA-Black.otf");
}

function setup() {
  // WEBGL turns on 3D. (0, 0) is now the CENTER of the canvas.
  createCanvas(windowWidth, windowHeight, WEBGL);

  // createInput() makes a text box. "A" is the starting text.
  letterInput = createInput("A");
  letterInput.position(20, 20);
  letterInput.size(50);
  letterInput.style("font-size", "32px");
  letterInput.style("text-align", "center");
  letterInput.input(keepLastLetter); // runs every time you type

  textFont(font);
  textSize(400);
  textAlign(CENTER, CENTER);
}

function draw() {
  background("orangered");

  // Turn the letter with the mouse.
  // We stay between -60° and 60° so the front always faces us.
  // (No orbitControl() here: seen from behind, the copies hide each other.
  // See the letter-3D-points sketch for a version you can spin all the way around.)
  let angleY = map(mouseX, 0, width, -PI / 3, PI / 3);
  let angleX = map(mouseY, 0, height, PI / 4, -PI / 4);
  rotateY(angleY);
  rotateX(angleX);

  let letter = letterInput.value();

  // The 3D trick: draw the same flat letter many times,
  // each copy 1 pixel further back (on the z axis).
  // Stacked together, they look like one thick letter.
  // We draw from the back to the front so the copies overlap correctly.
  for (let z = -depth; z < 0; z++) {
    // Copies at the back are darker, like a shadow
    let shade = map(z, -depth, 0, 40, 200);
    fill(shade);

    push();
    translate(0, 0, z);
    text(letter, 0, 0);
    pop();
  }

  // The front face, in white, drawn last so it stays on top
  fill(255);
  text(letter, 0, 0);
}

function keepLastLetter() {
  // Keep only the last letter typed,
  // so typing a new key replaces the old letter.
  let typed = letterInput.value();
  letterInput.value(typed.slice(-1)); // slice(-1) = last character
}
