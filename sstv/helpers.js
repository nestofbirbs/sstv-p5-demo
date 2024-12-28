// Based on https://github.com/CKegel/Web-SSTV/blob/main/encode.html

/*
MIT License

Copyright (c) 2024 Christian Kegel
Copyright (c) 2024 Raphaël de Courville

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
*/

function encodeAudio(canvasData) {
    if (!sstvFormat) {
        console.error("SSTV format is not selected.");
        return;
    }

    // Validate canvas data
    const hasInvalidData = canvasData.data.some(value => !isFinite(value));
    if (hasInvalidData) {
        console.error("Canvas data contains non-finite values.");
        return;
    }

    let oscillator = audioCtx.createOscillator();
    oscillator.type = "sine";

    oscillator.connect(audioCtx.destination);

    sstvFormat.prepareImage(canvasData.data);
    let startTime = audioCtx.currentTime + 1;
    let endTime = sstvFormat.encodeSSTV(oscillator, audioCtx.currentTime + 1);
    oscillator.start(startTime);
    oscillator.stop(endTime);
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

function downloadAudio(sstvFormat, canvasData) {
    if (!sstvFormat) {
        console.error("SSTV format is not selected.");
        return;
    }

    // Validate canvas data
    const hasInvalidData = canvasData.data.some(value => !isFinite(value));
    if (hasInvalidData) {
        console.error("Canvas data contains non-finite values.");
        return;
    }

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

    if (hasInvalidImageData) {
        console.error("Prepared image contains non-finite frequency values.");
        return;
    }

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
}