// MAMD Creative Coding & Future Web, 2026, Amaury Hamon

// 3D letter (opentype.js points)
// Type a letter in the box (top left).
// Move the slider to shake the points with Perlin noise.
// Drag with the mouse to turn the letter, scroll to zoom.
//
// How it works:
// 1. opentype.js reads the font file and gives us the DRAWING of a letter:
//    a list of pen moves, like "move here, draw a line to there, draw a curve to there".
// 2. We follow the pen and drop points along the way.
// 3. We draw those points twice, at the front and at the back,
//    so the letter has some depth.
// 4. Perlin noise pushes each point a little. The slider says how much.
// 5. Small points draw a line between each point and the next one.

let fontFile; // the font file, as raw bytes
let font; // the font, read by opentype.js
let letterInput; // HTML text box
let perlinSlider; // HTML slider: how far the noise pushes the points
let turning = false; // true while you drag on the canvas (not on the slider)

let fontSize = 400; // how big the letter is, in pixels
let depth = 60; // how thick the letter is, in pixels
let spacing = 25; // distance between two big points, in pixels: try 10 or 60
let smallPoints = 3; // small points on the line between two big points: try 0 or 10
let noiseScale = 0.01; // how different the noise is from one point to the next: try 0.002 or 0.05

let contours = []; // the outlines of the letter, each one is a list of points

function preload() {
  // Load the font file as raw bytes, opentype.js will read them in setup()
  fontFile = loadBytes("assets/SCKirbyBETA-Black.otf");
}

function setup() {
  // WEBGL turns on 3D. (0, 0) is now the CENTER of the canvas.
  let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.mousePressed(startTurning); // runs when you press the mouse ON the canvas

  // opentype.parse() turns the bytes into a font we can ask questions to
  font = opentype.parse(fontFile.bytes.buffer);

  // createInput() makes a text box. "A" is the starting text.
  letterInput = createInput("A");
  letterInput.position(20, 20);
  letterInput.size(50);
  letterInput.style("font-size", "32px");
  letterInput.style("text-align", "center");
  letterInput.input(keepLastLetter); // runs every time you type

  // createSlider(min, max, start): the Perlin factor, from 0 to 100 pixels
  perlinSlider = createSlider(0, 100, 20);
  perlinSlider.position(20, 80);
  perlinSlider.size(150);

  let label = createSpan("perlin");
  label.position(180, 80);

  contours = getContours(letterInput.value());
}

function draw() {
  background("orangered");

  // orbitControl(): drag to turn the letter around, scroll to zoom.
  // orbitControl(0, 0, 1) only zooms: we use it when you are not dragging
  // on the canvas, so moving the slider does not turn the letter.
  if (turning) {
    orbitControl();
  } else {
    orbitControl(0, 0, 1);
  }
  rotateY(frameCount * 0.01); // slowly turn on its own

  // The front points, in white
  stroke(255);
  drawPoints(depth / 2, 0);

  // The back points, darker like a shadow.
  // A different noise offset (1000) so they move on their own.
  stroke(40);
  drawPoints(-depth / 2, 1000);
}

function startTurning() {
  turning = true;
}

function mouseReleased() {
  turning = false;
}

// Draw all the points of the letter, at depth z
function drawPoints(z, noiseOffset) {
  for (let c = 0; c < contours.length; c++) {
    let points = contours[c];

    // 1. Push every point a little with the noise
    let moved = [];
    for (let i = 0; i < points.length; i++) {
      let p = points[i];
      let x = p.x + perlinPush(p, noiseOffset);
      let y = p.y + perlinPush(p, noiseOffset + 100);
      let z2 = z + perlinPush(p, noiseOffset + 200);
      moved.push(createVector(x, y, z2));
    }

    // 2. A big point on each of them
    strokeWeight(8);
    for (let i = 0; i < moved.length; i++) {
      point(moved[i].x, moved[i].y, moved[i].z);
    }

    // 3. Small points on the line between each point and the next one.
    // (The last point of an outline is on its first point,
    // so this goes all the way around.)
    strokeWeight(3);
    for (let i = 0; i < moved.length - 1; i++) {
      let a = moved[i];
      let b = moved[i + 1];
      for (let s = 1; s <= smallPoints; s++) {
        let t = s / (smallPoints + 1); // between 0 (point a) and 1 (point b)
        point(lerp(a.x, b.x, t), lerp(a.y, b.y, t), lerp(a.z, b.z, t));
      }
    }
  }
}

// How far the noise pushes point p, between -slider and +slider pixels.
// noise() is Perlin noise: a smooth random number between 0 and 1.
// Points close to each other get close numbers, so they move together.
// "offset" picks another part of the noise: x, y and z, and the front
// and back points, each get their own part, so they all move differently.
function perlinPush(p, offset) {
  let time = frameCount * 0.01; // the noise slowly changes over time
  let n = noise(p.x * noiseScale + offset, p.y * noiseScale, time);
  let amount = perlinSlider.value();
  return map(n, 0, 1, -amount, amount);
}

function keepLastLetter() {
  // Keep only the last letter typed,
  // so typing a new key replaces the old letter.
  let typed = letterInput.value();
  letterInput.value(typed.slice(-1)); // slice(-1) = last character

  contours = getContours(letterInput.value()); // new letter = new points
}

// From the drawing of the letter to points
function getContours(letter) {
  // getPath() gives the drawing of the letter, at (0, 0)
  let path = font.getPath(letter, 0, 0, fontSize);

  // Find the box around the letter, and draw it again
  // moved so the CENTER of the letter is at (0, 0)
  let box = path.getBoundingBox();
  let centerX = (box.x1 + box.x2) / 2;
  let centerY = (box.y1 + box.y2) / 2;
  path = font.getPath(letter, -centerX, -centerY, fontSize);

  // path.commands is the list of pen moves. Each one has a type:
  // "M" = move the pen (a new outline starts)
  // "L" = draw a straight line
  // "C" = draw a curve with 2 control points (used by .otf fonts)
  // "Q" = draw a curve with 1 control point (used by .ttf fonts)
  // "Z" = close the outline (draw a line back to its first point)
  let allContours = [];
  let points = []; // the points of the outline we are drawing now

  for (let i = 0; i < path.commands.length; i++) {
    let cmd = path.commands[i];

    if (cmd.type === "M") {
      // A new outline: start a new list of points
      points = [];
      allContours.push(points);
      points.push(createVector(cmd.x, cmd.y));
    } else {
      // The pen goes from where it is now (the last point we added)...
      let start = points[points.length - 1];

      // ...to the end of this move. "Z" goes back to the first point.
      let endX = cmd.x;
      let endY = cmd.y;
      if (cmd.type === "Z") {
        endX = points[0].x;
        endY = points[0].y;
      }

      // Longer moves get more points, so they are evenly spaced
      let steps = max(1, round(dist(start.x, start.y, endX, endY) / spacing));

      // t goes from 0 (start of the move) to 1 (end of the move)
      for (let s = 1; s <= steps; s++) {
        let t = s / steps;
        let x, y;
        if (cmd.type === "C") {
          // bezierPoint() is a p5 function for curves with 2 control points
          x = bezierPoint(start.x, cmd.x1, cmd.x2, endX, t);
          y = bezierPoint(start.y, cmd.y1, cmd.y2, endY, t);
        } else if (cmd.type === "Q") {
          x = quadraticPoint(start.x, cmd.x1, endX, t);
          y = quadraticPoint(start.y, cmd.y1, endY, t);
        } else {
          // "L" or "Z": a straight line, lerp() slides from start to end
          x = lerp(start.x, endX, t);
          y = lerp(start.y, endY, t);
        }
        points.push(createVector(x, y));
      }
    }
  }

  return allContours;
}

// Like bezierPoint(), but for a curve with only 1 control point:
// we slide from a to control, and from control to b,
// then slide between those two.
function quadraticPoint(a, control, b, t) {
  let a1 = lerp(a, control, t);
  let b1 = lerp(control, b, t);
  return lerp(a1, b1, t);
}
