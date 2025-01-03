const sstv = new SSTVEncoder();

function setup() {
  let w = sstv.pixelsPerLine;
  let h = sstv.numScanLines;
  createCanvas(w, h);
  createUserInterface(config.defaultMode);
  pixelDensity(1);
}

function draw() {
  background(255);
  noStroke();
  for (let i = 0; i < 100; i++) {
    fill(random(255), random(255), random(255));
    ellipse(random(width), random(height), random(10, 100));
  }

  drawCallsign(config.callsign, width * config.xPos, height * config.yPos, height * config.fontSize);

  // Ensure width and height are valid before getting image data
  if (Number.isFinite(width) && Number.isFinite(height)) {
    canvasData = drawingContext.getImageData(0, 0, width, height);
  } else {
    console.error(`Invalid canvas dimensions: ${width} x ${height}`);
  }

  noLoop(); // Stop draw loop after one iteration
}

function drawCallsign(callsign, x = width/2, y = 40, size = 64) {
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
  }
}
