const sstv = new SSTVEncoder();

let sketchCanvas;

let isTesting = false;
let testPattern;

function preload() {
  testPattern = loadImage("./assets/images/PM5544.png");
}

function setup() {
  let w = sstv.pixelsPerLine;
  let h = sstv.numScanLines;

  sketchCanvas = createCanvas(w, h);
  pixelDensity(1);

  createUserInterface(config.defaultMode);
}

function draw() {
  background(255);
  
  noStroke();

  for (let i = 0; i < 100; i++) {
    fill(random(255), random(255), random(255));
    ellipse(random(width), random(height), random(10, 100));
  }

  drawCallsign();

  saveCanvasData();

  noLoop(); // Stop draw loop after one iteration
}

function saveCanvasData() {
  // Ensure width and height are valid before getting image data
  if (Number.isFinite(width) && Number.isFinite(height)) {
    canvasData = drawingContext.getImageData(0, 0, width, height);
  } else {
    console.error(`Invalid canvas dimensions: ${width} x ${height}`);
  }
}

function drawTestCard(){
  image(testPattern, 0, 0, width, height);
  drawCallsign();
  noLoop();
  return;
}

function drawCallsign(
  callsign = config.callsign,
  x = width * config.xPos,
  y = height * config.yPos,
  size = height * config.fontSize
) {
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
      redraw(); // Resume draw loop on mouse click
      break;
    case "t":
      drawTestCard();
      break;
    default:
      break;
  }
}
