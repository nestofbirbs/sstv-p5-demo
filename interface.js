// Create the dropdown menu to select the SSTV mode
// and the buttons to encode and download the audio
function createUserInterface() {
  modeSelect = createSelect();
  modeSelect.position(10, 10);

  // Populate options using SSTV_MODES
  for (const [key, { label }] of Object.entries(SSTV_MODES)) {
    modeSelect.option(label, key);
  }

  // Retrieve the last selected mode from localStorage or set default
  const startingMode = localStorage.getItem("sstvMode") || "M1";
  modeSelect.selected(startingMode);
  initializeFormat(startingMode);

  // Set callback for mode selection
  modeSelect.changed(() => {
    const mode = modeSelect.value();
    console.log(`Selected mode: ${mode} (${SSTV_MODES[mode].label})`);
    updateFormat(mode);
    localStorage.setItem("sstvMode", mode); // Save selected mode to localStorage
  });

  // Create button for encoding
  createValidatedButton("Encode", "startButton", encodeAudio);

  // Create button for downloading
  createValidatedButton("Download", "downloadButton", downloadAudio);
}

function createValidatedButton(label, id, callback) {
  // Check that drawingContext exists
  if (!drawingContext) {
    console.error("drawingContext is missing.");
    return;
  }
  let button = createButton(label);
  button.id(id);
  button.mousePressed(() => {
    const data = getCanvasData(); // Retrieve canvas data using the getter
    if (validateCanvasData(data)) {
      callback(data);
    } else {
      console.error(`Invalid canvas data. ${label} aborted.`);
    }
  });
}

function getCanvasData() {
  return drawingContext.getImageData(0, 0, width, height);
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
  if (canvasData.data.every((value) => value === 0)) {
    console.warn("Canvas data is valid but all values are zero.");
  }

  return true;
}
