const sstv = new SSTVEncoder();

let isTesting = false;
let testPattern;

function preload() {
  testPattern = loadImage("./assets/images/PM5544.png");
}

function setup() {
  let w = sstv.pixelsPerLine;
  let h = sstv.numScanLines;

  const canvasContainer = createDiv();
  canvasContainer.class('canvas-container');
  canvasContainer.parent(document.body); // Append to body

  const canvasWrapper = createDiv();
  canvasWrapper.class('canvas-wrapper');
  canvasWrapper.parent(canvasContainer); // Append wrapper to container

  const canvas = createCanvas(w, h);
  canvas.parent(canvasWrapper); // Append canvas to wrapper

  createUserInterface(config.defaultMode);
  pixelDensity(1);
}

function draw() {
  if(isTesting) {
    image(testPattern, 0, 0, width, height);
    drawCallsign();
    noLoop();
    return;
  }

  background(255);
  noStroke();
  for (let i = 0; i < 100; i++) {
    fill(random(255), random(255), random(255));
    ellipse(random(width), random(height), random(10, 100));
  }

  drawCallsign();

  // Ensure width and height are valid before getting image data
  if (Number.isFinite(width) && Number.isFinite(height)) {
    canvasData = drawingContext.getImageData(0, 0, width, height);
  } else {
    console.error(`Invalid canvas dimensions: ${width} x ${height}`);
  }

  noLoop(); // Stop draw loop after one iteration
}

function drawCallsign(callsign = config.callsign, x = width * config.xPos, y = height * config.yPos, size = height * config.fontSize) {
  textSize(size);
  fill(0);
  stroke(255);
  strokeWeight(5);
  textAlign(CENTER, CENTER);
  text(callsign, x, y); // Corrected variable name
}

function keyPressed() {
  let k = key.toLowerCase();
  switch (k) {
    case "r":
      isTesting = false;
      redraw(); // Resume draw loop on mouse click
      break;
    case "t":
      isTesting = true;
      redraw(); // Resume draw loop on mouse click
      break;
    default:
      break;
  }
}
