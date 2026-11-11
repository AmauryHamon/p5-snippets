// MAMD Creative Coding & Future Web, 2026, Amaury Hamon
// Glitch mosaic: a random photo rebuilt from corrupted pixel tiles
//
// mouse X        → tile size
// mouse Y        → glitch intensity
// click / space  → new random image
// F              → freeze / unfreeze the glitch
// S              → save PNG
// H              → hide / show help

let img; // the source photo
let imageSeed = 0; // picsum seed of the current photo
let isLoading = false;
let loadFailed = false;

let tileSize = 16;
let targetTileSize = 16;
let glitch = 0.4; // 0 = clean mosaic, 1 = total corruption
let targetGlitch = 0.4;

let frozen = false;
let glitchTick = 0; // changes a few times per second → new glitch pattern
let showHelp = true;
let saveRequested = false;

const EFFECTS = ["swap", "invert", "smear", "coarse", "displace", "static"];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  textFont("monospace");
  loadRandomImage();
}

function draw() {
  background(0);

  if (!img) {
    drawMessage(loadFailed ? "could not load image · click to retry" : "loading image…");
    return;
  }

  // ease towards the mouse values so changes feel smooth
  tileSize = lerp(tileSize, targetTileSize, 0.2);
  glitch = lerp(glitch, targetGlitch, 0.05);

  // pick a new glitch pattern every 4 frames (unless frozen)
  if (!frozen && frameCount % 4 === 0) glitchTick++;
  // same seed → same "random" glitch until the tick changes
  randomSeed(imageSeed + glitchTick);

  drawMosaic();
  tearSlices();
  drawScanlines();

  // save before drawing the help box, so it is not in the PNG
  if (saveRequested) {
    saveCanvas(`glitch-mosaic-${imageSeed}`, "png");
    saveRequested = false;
  }
  if (showHelp) drawHelp();
}

// ---------------------------------------------------------------------------
// mosaic

function drawMosaic() {
  let s = tileSize;
  let cols = ceil(width / s);
  let rows = ceil(height / s);

  // red and blue are read a bit left and right of green (chromatic aberration)
  let rgbOffset = glitch * s * 1.5;
  // fewer color levels = more "digital" look
  let levels = floor(map(glitch, 0, 1, 24, 4));

  let rowShifts = makeRowShifts(rows);
  let blocks = makeCorruptedBlocks(cols, rows);

  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      let x = col * s;
      let y = row * s;
      // where to read the photo: center of the tile, moved by the row tear
      let sx = x + s / 2 + rowShifts[row];
      let sy = y + s / 2;

      let c;
      let block = findBlock(blocks, col, row);
      if (block) {
        c = corruptedColor(block, col, sx, sy, s, rgbOffset);
      } else {
        c = sampleRGB(sx, sy, rgbOffset);
      }

      fill(quantize(c[0], levels), quantize(c[1], levels), quantize(c[2], levels));
      rect(x, y, s + 1, s + 1); // +1 hides the thin seams between tiles
    }
  }
}

// split the rows into bands, some bands get shifted sideways (torn rows)
function makeRowShifts(rows) {
  let shifts = [];
  while (shifts.length < rows) {
    let bandHeight = floor(random(1, 8));
    let shift = 0;
    if (random() < glitch * 0.3) {
      shift = random(-0.4, 0.4) * width * glitch;
    }
    for (let i = 0; i < bandHeight; i++) shifts.push(shift);
  }
  return shifts;
}

// rectangles of tiles that get a special effect
function makeCorruptedBlocks(cols, rows) {
  let blocks = [];
  let count = floor(glitch * glitch * 14); // few at low glitch, many at high
  for (let i = 0; i < count; i++) {
    let w = floor(random(2, max(3, cols * 0.5)));
    let h = floor(random(1, max(2, rows * 0.12)));
    blocks.push({
      col: floor(random(cols - w)),
      row: floor(random(rows - h)),
      w: w,
      h: h,
      effect: random(EFFECTS),
      dx: random(-0.5, 0.5) * width,
      dy: random(-0.5, 0.5) * height,
    });
  }
  return blocks;
}

function findBlock(blocks, col, row) {
  for (let block of blocks) {
    let insideBlock =
      col >= block.col &&
      col < block.col + block.w &&
      row >= block.row &&
      row < block.row + block.h;
    if (insideBlock) return block;
  }
  return undefined;
}

function corruptedColor(block, col, sx, sy, s, rgbOffset) {
  if (block.effect === "swap") {
    // channels in the wrong order
    let [r, g, b] = sampleRGB(sx, sy, rgbOffset);
    return [g, b, r];
  }
  if (block.effect === "invert") {
    // photo negative
    let [r, g, b] = sampleRGB(sx, sy, rgbOffset);
    return [255 - r, 255 - g, 255 - b];
  }
  if (block.effect === "smear") {
    // every tile copies the first column of the block → horizontal streaks
    let firstColX = sx - (col - block.col) * s;
    return sampleRGB(firstColX, sy, rgbOffset);
  }
  if (block.effect === "coarse") {
    // read the photo at a 4x lower resolution → big pixels
    let big = s * 4;
    let bx = floor(sx / big) * big + big / 2;
    let by = floor(sy / big) * big + big / 2;
    return sampleRGB(bx, by, rgbOffset);
  }
  if (block.effect === "displace") {
    // show a piece of the photo from somewhere else
    return sampleRGB(sx + block.dx, sy + block.dy, rgbOffset);
  }
  // "static": TV noise
  let v = random(255);
  return [v, v, v];
}

// ---------------------------------------------------------------------------
// reading the photo

// read red, green and blue from slightly different places → RGB split
function sampleRGB(x, y, offset) {
  let r = img.pixels[pixelIndex(x - offset, y)];
  let g = img.pixels[pixelIndex(x, y) + 1];
  let b = img.pixels[pixelIndex(x + offset, y) + 2];
  return [r, g, b];
}

// canvas position → index in img.pixels
// the photo covers the whole canvas (like CSS object-fit: cover)
function pixelIndex(x, y) {
  let zoom = max(width / img.width, height / img.height);
  let offsetX = (width - img.width * zoom) / 2;
  let offsetY = (height - img.height * zoom) / 2;
  let ix = floor((x - offsetX) / zoom);
  let iy = floor((y - offsetY) / zoom);
  // wrap around horizontally (glitchy!), stay inside vertically
  ix = ((ix % img.width) + img.width) % img.width;
  iy = constrain(iy, 0, img.height - 1);
  // each pixel takes 4 values in the array: r, g, b, a
  return (iy * img.width + ix) * 4;
}

// reduce a 0-255 value to a few steps (posterize)
function quantize(value, levels) {
  let step = 255 / (levels - 1);
  return round(value / step) * step;
}

function loadRandomImage() {
  if (isLoading) return;
  isLoading = true;
  loadFailed = false;
  // Math.random() and not random(): random() is seeded in draw(),
  // so it would always give the same "random" image
  let seed = floor(Math.random() * 100000);
  // picsum.photos sends a random photo for each seed
  // and allows us to read its pixels (CORS)
  let url = `https://picsum.photos/seed/${seed}/1200/800`;
  loadImage(
    url,
    (loaded) => {
      loaded.loadPixels(); // fill loaded.pixels once, read it every frame
      img = loaded;
      imageSeed = seed;
      isLoading = false;
      glitch = 1; // burst of corruption that settles down
    },
    () => {
      loadFailed = true;
      isLoading = false;
    }
  );
}

// ---------------------------------------------------------------------------
// post effects

// cut thin horizontal slices of the finished image and slide them sideways
function tearSlices() {
  let count = floor(glitch * 6);
  for (let i = 0; i < count; i++) {
    let y = floor(random(height));
    let h = floor(random(2, 30));
    let dx = floor(random(-80, 80) * glitch);
    let slice = get(0, y, width, h);
    image(slice, dx, y);
  }
}

function drawScanlines() {
  fill(0, 60);
  for (let y = 0; y < height; y += 3) {
    rect(0, y, width, 1);
  }
}

// ---------------------------------------------------------------------------
// text

function drawHelp() {
  let status = `picsum seed ${imageSeed}`;
  if (isLoading) status = "loading new image…";
  if (loadFailed) status = "load failed · click to retry";
  if (frozen) status += " · FROZEN";

  let lines = [
    `glitch ${round(glitch * 100)}% · tiles ${round(tileSize)}px · ${status}`,
    "mouse X tiles · mouse Y glitch · click new image · F freeze · S save · H hide",
  ];

  push();
  textSize(12);
  textLeading(18);
  textAlign(LEFT, TOP);
  let padding = 10;
  let boxWidth = max(textWidth(lines[0]), textWidth(lines[1])) + padding * 2;
  let boxHeight = 18 * lines.length + padding * 2;
  let boxY = height - boxHeight - 12;
  fill(0, 200);
  rect(12, boxY, boxWidth, boxHeight);
  fill(0, 255, 120);
  text(lines.join("\n"), 12 + padding, boxY + padding + 2);
  pop();
}

function drawMessage(message) {
  push();
  fill(0, 255, 120);
  textSize(14);
  textAlign(CENTER, CENTER);
  text(message, width / 2, height / 2);
  pop();
}

// ---------------------------------------------------------------------------
// input

function mouseMoved() {
  targetTileSize = map(mouseX, 0, width, 10, 80, true);
  targetGlitch = map(mouseY, 0, height, 0, 1, true);
}

function mouseDragged() {
  mouseMoved();
}

function mousePressed() {
  loadRandomImage();
}

function keyPressed() {
  if (key === " ") loadRandomImage();
  if (key === "f" || key === "F") frozen = !frozen;
  if (key === "s" || key === "S") saveRequested = true;
  if (key === "h" || key === "H") showHelp = !showHelp;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
