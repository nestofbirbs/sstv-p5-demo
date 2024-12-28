let startButton, downloadButton;

const SSTV_MODES = {
    "M1": { label: "Martin M1", class: "Martin" },
    "M2": { label: "Martin M2", class: "Martin" },
    "S1": { label: "Scottie 1", class: "Martin" },
    "S2": { label: "Scottie 2", class: "Martin" },
    "SDX": { label: "Scottie DX", class: "Scottie" },
    "WrasseSC2180": { label: "SC2-180", class: "Wrasse" },
    "PD50": { label: "PD-50", class: "PD" },
    "PD90": { label: "PD-90", class: "PD" },
    "PD120": { label: "PD-120", class: "PD" },
    "PD160": { label: "PD-160", class: "PD" },
    "PD180": { label: "PD-180", class: "PD" },
    "PD240": { label: "PD-240", class: "PD" },
    "PD290": { label: "PD-290", class: "PD" }
};

let encodingMode = "M1";

function setup() {
  createCanvas(400, 200);
  background(220);

  modeSelect = createSelect();
  modeSelect.position(10, 10);

  // Populate options using SSTV_MODES
  for (const [key, { label }] of Object.entries(SSTV_MODES)) {
      modeSelect.option(label, key);
  }

  modeSelect.changed(updateFormat);

  startButton = createButton('Encode');
  startButton.id('startButton');
  // startButton.position(50, 50);

  downloadButton = createButton('Download');
  downloadButton.id('downloadButton');
  // downloadButton.position(200, 50);
  
  // Add mousePressed callbacks (optional)
  startButton.mousePressed(() => {
    console.log('Encode button clicked');
  });

  downloadButton.mousePressed(() => {
    console.log('Download button clicked');
  });
}

function draw() {
  // Draw optional graphics or interface elements
}

function updateFormat(){
  selectedMode = modeSelect.value();
  console.log(`Selected mode: ${selectedMode}`);
}
