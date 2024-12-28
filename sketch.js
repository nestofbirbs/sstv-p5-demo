let startButton;
let downloadButton;

let canvasData;

let sstvFormat;

const audioCtx = new AudioContext();

const SSTV_MODES = {
  M1: { label: "Martin M1", class: "Martin" },
  M2: { label: "Martin M2", class: "Martin" },
  S1: { label: "Scottie 1", class: "Martin" },
  S2: { label: "Scottie 2", class: "Martin" },
  SDX: { label: "Scottie DX", class: "Scottie" },
  WrasseSC2180: { label: "SC2-180", class: "Wrasse" },
  PD50: { label: "PD-50", class: "PD" },
  PD90: { label: "PD-90", class: "PD" },
  PD120: { label: "PD-120", class: "PD" },
  PD160: { label: "PD-160", class: "PD" },
  PD180: { label: "PD-180", class: "PD" },
  PD240: { label: "PD-240", class: "PD" },
  PD290: { label: "PD-290", class: "PD" },
};

function setup() {
  createCanvas(320, 256);
  createUserInterface();
  pixelDensity(1);

  randomSeed(999)

  noLoop();
}

function draw() {
  background(255);
  noStroke();
  for(let i = 0; i < 100; i++) {
    fill(random(255), random(255), random(255));
    ellipse(random(width), random(height), random(10, 100));
  }

  // Save the color data from the canvas as a Uint8ClampedArray 
  // so the callback functions of the buttons can access it later
  canvasData = drawingContext.getImageData(0, 0, width, height);
}

function createUserInterface() {
  modeSelect = createSelect();
  modeSelect.position(10, 10);

  // Populate options using SSTV_MODES
  for (const [key, { label }] of Object.entries(SSTV_MODES)) {
    modeSelect.option(label, key);
  }

  // Retrieve the last selected mode from localStorage or set default
  const startingMode = localStorage.getItem('sstvMode') || 'M1';
  modeSelect.selected(startingMode);
  initializeFormat(startingMode);

  // Set callback for mode selection
  modeSelect.changed(() => {
    const mode = modeSelect.value();
    console.log(`Selected mode: ${mode} (${SSTV_MODES[mode].label})`);
    updateFormat(mode);
    localStorage.setItem('sstvMode', mode); // Save selected mode to localStorage
  });

  startButton = createButton("Encode");
  startButton.id("startButton");

  downloadButton = createButton("Download");
  downloadButton.id("downloadButton");

  startButton.mousePressed(() => {
    if (validateCanvasData(canvasData)) {
      encodeAudio(canvasData);
    } else {
      console.error("Invalid canvas data. Encoding aborted.");
    }
  });

  downloadButton.mousePressed(() => {
    if (validateCanvasData(canvasData)) {
      downloadAudio(canvasData);
    } else {
      console.error("Invalid canvas data. Download aborted.");
    }
  });
}

function initializeFormat(mode) {
  console.log(`Selected mode: ${mode} (${SSTV_MODES[mode].label})`);
  updateFormat(mode);
}

function updateFormat(encodingMode = "M1") {
  switch (encodingMode) {
    case "M1":
      sstvFormat = new MartinMOne();
      break;
    case "M2":
      sstvFormat = new MartinMTwo();
      break;
    case "S1":
      sstvFormat = new ScottieOne();
      break;
    case "S2":
      sstvFormat = new ScottieTwo();
      break;
    case "SDX":
      sstvFormat = new ScottieDX();
      break;
    case "PD50":
      sstvFormat = new PD50();
      break;
    case "PD90":
      sstvFormat = new PD90();
      break;
    case "PD120":
      sstvFormat = new PD120();
      break;
    case "PD160":
      sstvFormat = new PD160();
      break;
    case "PD180":
      sstvFormat = new PD180();
      break;
    case "PD240":
      sstvFormat = new PD240();
      break;
    case "PD290":
      sstvFormat = new PD290();
      break;
    case "RobotBW8":
      sstvFormat = new RobotBW8();
      break;
    case "WrasseSC2180":
      sstvFormat = new WrasseSC2180();
      break;
    default:
      sstvFormat = null; // Or handle invalid mode here
      console.error(`Invalid mode selected: '${modeSelect.value()}'`);
  }
}

function validateCanvasData(canvasData) {
  // Check if canvasData exists and has valid data
  if (!canvasData || !canvasData.data) {
    console.error("Canvas data is missing or invalid.");
    return false;
  }

  // Check if canvasData.data is an instance of Uint8ClampedArray
  if (!(canvasData.data instanceof Uint8ClampedArray)) {
    console.error("Canvas data is not a Uint8ClampedArray.");
    return false;
  }

  // Check if canvasData.data has a length greater than zero
  if (canvasData.data.length === 0) {
    console.error("Canvas data is empty.");
    return false;
  }

  // Ensure all data values are finite numbers
  for (let value of canvasData.data) {
    if (!isFinite(value)) {
      console.error("Canvas data contains non-finite values.");
      return false;
    }
  }

  // Check if canvasData.data is full of zeros
  if (canvasData.data.every(value => value === 0)) {
    console.warn("Canvas data is valid but all values are zero.");
  }

  return true;
}
