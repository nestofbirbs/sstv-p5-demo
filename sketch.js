
let config = {
  width: 320,
  height: 256,
  callsign: "SSTVXX",
  xPos: 160,
  yPos: 40,
  fontSize: 64,
};

function setup() {
  createCanvas(config.width, config.height);
  createUserInterface();
  pixelDensity(1);
}

function draw() {
  background(255);
  noStroke();
  for (let i = 0; i < 100; i++) {
    fill(random(255), random(255), random(255));
    ellipse(random(width), random(height), random(10, 100));
  }

  drawCallsign(config.callsign, config.xPos, config.yPos, config.fontSize);

  // Set global canvasData for encoding
  canvasData = drawingContext.getImageData(0, 0, width, height);

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
