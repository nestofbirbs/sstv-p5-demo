function setup() {
  createCanvas(320, 256);
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

  // Set canvasData to the current canvas image
  canvasData = drawingContext.getImageData(0, 0, width, height);
  
  noLoop();
}