let startButton;
let downloadButton;

let canvas;
let canvasCtx;

let sstvFormat;

const audioCtx = new AudioContext();

function setup() {
  createCanvas(320, 256);

  sstvFormat = new MartinMOne();

  background(220);
  ellipse(50, 50, 80, 80);

  modeSelect = createSelect();
  modeSelect.position(10, 10);

  // Populate options using SSTV_MODES
  for (const [key, { label }] of Object.entries(SSTV_MODES)) {
      modeSelect.option(label, key);
  }

  modeSelect.changed(() => {
      const mode = modeSelect.value();
      console.log(`Selected mode: ${mode} (${SSTV_MODES[mode].label})`);
      updateFormat(mode);
  });

  startButton = createButton('Encode');
  startButton.id('startButton');

  downloadButton = createButton('Download');
  downloadButton.id('downloadButton');

  let cnvData = drawingContext.getImageData(0,0,width,height);

  startButton.mousePressed(() => {
    if (validateCanvasData(cnvData)) {
      encodeAudio(sstvFormat, cnvData);
    } else {
      console.error("Invalid canvas data. Encoding aborted.");
    }
  });

  downloadButton.mousePressed(() => {
    if (validateCanvasData(cnvData)) {
      downloadAudio(sstvFormat, cnvData);
    } else {
      console.error("Invalid canvas data. Download aborted.");
    }
  });
}

function draw() {
  // Draw optional graphics or interface elements
}

function updateFormat(encodingMode){
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

  // Ensure all data values are finite numbers
  for (let value of canvasData.data) {
    if (!isFinite(value)) {
      console.error("Canvas data contains non-finite values.");
      return false;
    }
  }

  return true;
}
