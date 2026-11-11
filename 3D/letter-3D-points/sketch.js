// MAMD Creative Coding & Future Web, 2026, Amaury Hamon

// 3D letter (textToPoints)
// Type a letter in the box (top left).
// Drag with the mouse to turn the letter, scroll to zoom.

let font;
let letterInput; // HTML text box
let depth = 60; // how thick the letter is, in pixels
let points = []; // points along the letter's outline

function preload() {
  // textToPoints() needs a font loaded by loadFont()
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

  updatePoints();
}

function draw() {
  background("orangered");

  // The letter is made of real 3D boxes,
  // so orbitControl() works: drag to turn it around, scroll to zoom.
  orbitControl();
  rotateY(frameCount * 0.01); // slowly turn on its own

  // lights() adds light and shadow to 3D shapes
  lights();
  noStroke();
  fill(255);

  // One thin, long box on each point of the outline
  for (let i = 0; i < points.length; i++) {
    let p = points[i];

    let z = 0;
    // Try this to make the letter wave:
    // z = sin(frameCount * 0.05 + i * 0.1) * 50;

    push();
    translate(p.x, p.y, z);
    box(6, 6, depth); // box(width, height, depth)
    pop();
  }
}

function keepLastLetter() {
  // Keep only the last letter typed,
  // so typing a new key replaces the old letter.
  let typed = letterInput.value();
  letterInput.value(typed.slice(-1)); // slice(-1) = last character

  updatePoints(); // new letter = new outline points
}

function updatePoints() {
  let letter = letterInput.value();

  // textToPoints() returns a list of points along the OUTLINE of the letter.
  // Each point has an x and a y.
  // sampleFactor = how many points: 0.05 = few, 0.3 = many
  points = font.textToPoints(letter, 0, 0, 400, { sampleFactor: 0.15 });

  if (points.length === 0) {
    return; // no letter (empty box or a space)
  }

  // The points start from the letter's bottom left corner.
  // To put the letter in the middle of the screen, we find the
  // average position of all the points (its center)...
  let centerX = 0;
  let centerY = 0;
  for (let i = 0; i < points.length; i++) {
    centerX += points[i].x;
    centerY += points[i].y;
  }
  centerX = centerX / points.length;
  centerY = centerY / points.length;

  // ...and move every point so that center is at (0, 0)
  for (let i = 0; i < points.length; i++) {
    points[i].x -= centerX;
    points[i].y -= centerY;
  }
}
