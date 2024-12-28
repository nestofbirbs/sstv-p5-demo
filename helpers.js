//---------- Frontend Controls ----------//

const audioCtx = new AudioContext();
let imageLoaded = false;

let modeSelect = document.getElementById("modeSelect");
let startButton = document.getElementById("startButton");
let downloadButton = document.getElementById('downloadButton');
let imgPicker = document.getElementById("imgPicker");
let warningText = document.getElementById("warningText");
let callSignEntry = document.getElementById("callSign");
let callSignLocation = document.getElementById("callSignLocation");

let canvas = document.getElementById("defaultCanvas0");
let canvasCtx = canvas.getContext("2d");
let rawImage = new Image();
let sstvFormat = new Format();

modeSelect.addEventListener("change", (e) => {
	if(modeSelect.value != "none"){
			warningText.textContent = "";
			startButton.disabled = !imageLoaded;
			downloadButton.disabled = !imageLoaded;
        }
	if(modeSelect.value == "M1")
		sstvFormat = new MartinMOne();
	else if(modeSelect.value == "M2")
		sstvFormat = new MartinMTwo();
	else if(modeSelect.value == "S1")
		sstvFormat = new ScottieOne();
	else if(modeSelect.value == "S2")
		sstvFormat = new ScottieTwo();
	else if(modeSelect.value == "SDX")
		sstvFormat = new ScottieDX();
	else if(modeSelect.value == "PD50")
		sstvFormat = new PD50();
	else if(modeSelect.value == "PD90")
		sstvFormat = new PD90();
	else if(modeSelect.value == "PD120")
		sstvFormat = new PD120();
	else if(modeSelect.value == "PD160")
		sstvFormat = new PD160();
	else if(modeSelect.value == "PD180")
		sstvFormat = new PD180();
	else if(modeSelect.value == "PD240")
		sstvFormat = new PD240();
	else if(modeSelect.value == "PD290")
		sstvFormat = new PD290();
	else if(modeSelect.value == "RobotBW8")
		sstvFormat = new RobotBW8();
	else if(modeSelect.value == "WrasseSC2180")
		sstvFormat = new WrasseSC2180();

	if(imageLoaded)
		drawPreview();
});

startButton.onclick = () => {

	if(modeSelect.value == "none") {
		warningText.textContent = "You must select a mode";
		startButton.disabled = true;
		return;
	}

	if(!imageLoaded){
		warningText.textContent = "You must upload an image";
		startButton.disabled = true;
		return;
	}

	let canvasData = canvasCtx.getImageData(0, 0, canvas.width, canvas.height);

	warningText.textContent = "";
	if (audioCtx.state === "suspended") {
    	audioCtx.resume();
    }

    let oscillator = audioCtx.createOscillator();
	oscillator.type = "sine";

	oscillator.connect(audioCtx.destination);

	sstvFormat.prepareImage(canvasData.data);
	let startTime = audioCtx.currentTime + 1;
	let endTime = sstvFormat.encodeSSTV(oscillator, audioCtx.currentTime + 1);
	oscillator.start(startTime);
	oscillator.end(endTime);
};

function createWAVHeader(audioLength) {
    const headerSize = 44;
    const header = new ArrayBuffer(headerSize);
    const view = new DataView(header);
    // RIFF chunk
    view.setUint32(0, 0x52494646, false); // "RIFF"
    view.setUint32(4, 36 + audioLength, true); // File size
    view.setUint32(8, 0x57415645, false); // "WAVE"
    // fmt chunk
    view.setUint32(12, 0x666d7420, false); // "fmt "
    view.setUint32(16, 16, true); // Chunk size
    view.setUint16(20, 1, true); // Audio format (PCM)
    view.setUint16(22, 1, true); // Number of channels (mono)
    view.setUint32(24, 48000, true); // Sample rate
    view.setUint32(28, 48000 * 1 * 16 / 8, true); // Byte rate
    view.setUint16(32, 1 * 16 / 8, true); // Block align
    view.setUint16(34, 16, true); // Bits per sample
    // data chunk
    view.setUint32(36, 0x64617461, false); // "data"
    view.setUint32(40, audioLength, true); // Data size
    
    return header;
}



downloadButton.onclick = () => {

    if (modeSelect.value == "none") {
        warningText.textContent = "You must select a mode";
        startButton.disabled = true;
        return;
    }

    if (!imageLoaded) {
        warningText.textContent = "You must upload an image";
        startButton.disabled = true;
        return;
    }

    let canvasData = canvasCtx.getImageData(0, 0, canvas.width, canvas.height);

    warningText.textContent = "";

    if (audioCtx.state === "suspended") {
        audioCtx.resume();
    }

    sstvSignalDuration = sstvFormat.getEncodedLength() + 1;
    const offlineCtx = new OfflineAudioContext(1, 48000 * sstvSignalDuration, 48000);
    let oscillator = offlineCtx.createOscillator();
    oscillator.type = "sine";

    oscillator.connect(offlineCtx.destination);

    sstvFormat.prepareImage(canvasData.data);
    endTime = sstvFormat.encodeSSTV(oscillator, 1);
    console.log(endTime - 1);
    oscillator.start(1);

    offlineCtx.startRendering().then((audioBuffer) => {
        const audioData = audioBuffer.getChannelData(0); // Get first audio channel

        // Convert Float32Array to Int16Array
        const audioLength = audioData.length;
        const audioInt16 = new Int16Array(audioLength);
        for (let i = 0; i < audioLength; i++) {
            audioInt16[i] = Math.max(-1, Math.min(1, audioData[i])) * 32767;
        }

        // Convert the audio data to a Blob for download
        const wavHeader = createWAVHeader(audioInt16.length * 2); // 2 bytes per sample
        const wavFile = new Uint8Array(wavHeader.byteLength + audioInt16.byteLength);
        wavFile.set(new Uint8Array(wavHeader), 0);
        wavFile.set(new Uint8Array(audioInt16.buffer), wavHeader.byteLength);

        const blob = new Blob([wavFile], { type: 'audio/wav' });

        // Download the Blob
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sstv_signal.wav';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
};