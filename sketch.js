function setup() {
  createCanvas(320, 256);
  createUserInterface();
  pixelDensity(1);
  randomSeed(999);
  noLoop();
}

function draw() {
  background(255);
  noStroke();
  for (let i = 0; i < 100; i++) {
    fill(random(255), random(255), random(255));
    ellipse(random(width), random(height), random(10, 100));
  }
}