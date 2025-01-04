// Create the dropdown menu to select the SSTV mode
// and the buttons to encode and download the audio
function createUserInterface(defaultMode) {

  if(!defaultMode) {
    console.error("Default mode is missing when creating interface.");
    return;
  }

  const workspace = createDiv();
  workspace.class('workspace');
  workspace.parent(document.body); // Append to body

  const canvasWrapper = createDiv();
  canvasWrapper.class('canvas-wrapper');
  canvasWrapper.parent(workspace); // Append wrapper to workspace

  sketchCanvas.parent(canvasWrapper); // Append canvas to wrapper

  const controlsContainer = createDiv();
  controlsContainer.class('controls');
  controlsContainer.parent(document.body); // Append to body

  const leftContainer = createDiv();
  leftContainer.class('left');
  leftContainer.parent(controlsContainer);

  const rightContainer = createDiv();
  rightContainer.class('right');
  rightContainer.parent(controlsContainer);

  modeSelect = createSelect();
  modeSelect.id("modeSelect");
  leftContainer.child(modeSelect);

  // Populate options using SSTV_MODES
  for (const [key, { name }] of Object.entries(SSTV_MODES)) {
    modeSelect.option(name, key);
  }

  // Retrieve the last selected mode from localStorage or set default
  const startingMode = localStorage.getItem("sstvMode") || defaultMode;
  modeSelect.selected(startingMode);
  sstv.mode = startingMode;
  updateCanvasFormat();

  // Set callback for mode selection
  modeSelect.changed(() => {
    const mode = modeSelect.value();
    console.log(`Selected mode: ${mode} (${SSTV_MODES[mode].name})`);
    sstv.mode = mode;
    localStorage.setItem("sstvMode", mode); // Save selected mode to localStorage
    updateCanvasFormat();
  });

  // Create button for encoding
  createValidatedButton("", "startButton", playCallback, rightContainer);

  // Create button for downloading
  createValidatedButton("Download .wav", "downloadButton", downloadCallback, rightContainer);

  // Create progress bar
  const progressBarContainer = createDiv();
  progressBarContainer.class('progress-bar-container');
  progressBarContainer.parent(document.body); // Append to body to position behind controls

  const progressBar = createDiv();
  progressBar.class('progress-bar');
  progressBar.id('progressBar');
  progressBar.parent(progressBarContainer);

  // Create overlay
  const overlay = createDiv();
  overlay.class('progress-overlay');
  overlay.id('progress-overlay');
  overlay.parent(document.querySelector('.workspace .canvas-wrapper'));

  // Add drop overlay
  const dropOverlay = createDiv('Drop image here');
  dropOverlay.class('drop-overlay');
  dropOverlay.parent(document.body);

  // Add event listeners for drag-and-drop
  document.body.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropOverlay.addClass('show');
  });

  document.body.addEventListener('dragleave', () => {
    dropOverlay.removeClass('show');
  });

  document.body.addEventListener('drop', (event) => {
    event.preventDefault();
    dropOverlay.removeClass('show');
    handleFileDrop(event.dataTransfer.files);
  });
}

function playCallback() {
  const playButton = document.getElementById("startButton");
  const progressBarContainer = document.querySelector(".progress-bar-container");
  const overlay = document.getElementById("progress-overlay");

  const isPlaying = encodeAudio(getCanvasData(), sstv.format, updateProgressBar, onEncodingComplete);

  updatePlayButton(playButton, isPlaying);
  toggleOverlay(overlay, isPlaying);
  toggleProgressBar(progressBarContainer, isPlaying);
}

function toggleProgressBar(progressBarContainer, isPlaying) {
  if (isPlaying) {
    progressBarContainer.classList.add("show");
  } else {
    progressBarContainer.classList.remove("show");
  }
}

function updateProgressBar(progress) {
  const progressBar = document.getElementById("progressBar");
  const overlay = document.getElementById("progress-overlay");
  let percent = Math.max(0, progress); // ignore negative values
  progressBar.style.width = `${percent * 100}%`;
  overlay.style.height = `${100 - percent * 100}%`;
}

function onEncodingComplete() {
  const playButton = document.getElementById("startButton");
  const overlay = document.getElementById("progress-overlay");
  const progressBarContainer = document.querySelector(".progress-bar-container");
  playButton.textContent = "Play Signal";
  overlay.style.display = "none";
  progressBarContainer.classList.remove("show");
}

function updatePlayButton(playButton, isPlaying) {
  playButton.classList.toggle("playing", isPlaying);
}

function toggleOverlay(overlay, isPlaying) {
  if (isPlaying) {
    overlay.style.display = "block";
    overlay.style.height = "100%";
  } else {
    overlay.style.display = "none";
  }
}

function downloadCallback() {
  console.log("Downloading audio...");
  downloadAudio(getCanvasData(), sstv.format);
}

function updateCanvasFormat() {
  console.log(`Updating canvas format for mode: ${sstv.mode}`);
  const w = sstv.pixelsPerLine;
  const h = sstv.numScanLines;
  console.log(`Canvas dimensions: ${w} x ${h}`);
  resizeCanvas(w, h);
}

function createValidatedButton(label, id, callback, container) {
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
  container.child(button);
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

function handleFileDrop(files) {
  if (files.length > 0) {
    const file = files[0];
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = loadImage(event.target.result, () => {
          image(img, 0, 0, width, height);
          drawCallsign();
        });
      };
      reader.readAsDataURL(file);
    } else {
      console.error("Dropped file is not an image.");
    }
  }
}