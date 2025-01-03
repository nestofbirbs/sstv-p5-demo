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

class Format {

	#modeName;
	#numScanLines;
	#pixelsPerLine;
	#blankingInterval;
	#scanLineLength;
	#syncPulseLength;
	#VISCode;
	#preparedImage = [];

	constructor(numScanLines, pixelsPerLine, blankingInterval, scanLineLength, syncPulseLength, VISCode) {
		this.#numScanLines = numScanLines;
		this.#pixelsPerLine = pixelsPerLine;
		this.#blankingInterval = blankingInterval;
		this.#scanLineLength = scanLineLength;
		this.#syncPulseLength = syncPulseLength;
		this.#VISCode = VISCode;
	}

	getGreyscaleFreq(data, scanLine, vertPos) {
		const index = scanLine * (this.#pixelsPerLine * 4) + vertPos * 4;
		let grey = data[index] * 0.299 + 0.587 * data[index + 1] + 0.114 * data[index + 2]
		return grey * COLOR_FREQ_MULT + 1500
	}

	getRGBValueAsFreq(data, scanLine, vertPos) {
		const index = scanLine * (this.#pixelsPerLine * 4) + vertPos * 4;
		let red = data[index] * COLOR_FREQ_MULT + 1500;
		let green = data[index + 1] * COLOR_FREQ_MULT + 1500;
		let blue = data[index + 2] * COLOR_FREQ_MULT + 1500;
		return [red, green, blue];
	}

	getYRYBYValueAsFreq(data, scanLine, vertPos) {
		const index = scanLine * (this.#pixelsPerLine * 4) + vertPos * 4;
		let red = data[index];
		let green = data[index + 1];
		let blue = data[index + 2];

		let Y = 6.0 + (.003906 * ((65.738 * red) + (129.057 * green) + (25.064 * blue)));
		let RY = 128.0 + (.003906 * ((112.439 * red) + (-94.154 * green) + (-18.285 * blue)));
		let BY = 128.0 + (.003906 * ((-37.945 * red) + (-74.494 * green) + (112.439 * blue)));
		return [1500 + Y * COLOR_FREQ_MULT , 1500 + RY * COLOR_FREQ_MULT, 1500 + BY * COLOR_FREQ_MULT];
	}

	encodePrefix(oscillator, startTime) {
		let time = startTime;

		oscillator.frequency.setValueAtTime(1900, time);
		time += PREFIX_PULSE_LENGTH;
		oscillator.frequency.setValueAtTime(1500, time);
		time += PREFIX_PULSE_LENGTH;
		oscillator.frequency.setValueAtTime(1900, time);
		time += PREFIX_PULSE_LENGTH;
		oscillator.frequency.setValueAtTime(1500, time);
		time += PREFIX_PULSE_LENGTH;
		oscillator.frequency.setValueAtTime(2300, time);
		time += PREFIX_PULSE_LENGTH;
		oscillator.frequency.setValueAtTime(1500, time);
		time += PREFIX_PULSE_LENGTH;
		oscillator.frequency.setValueAtTime(2300, time);
		time += PREFIX_PULSE_LENGTH;
		oscillator.frequency.setValueAtTime(1500, time);
		time += PREFIX_PULSE_LENGTH;

		return time;
	}

	encodeHeader(oscillator, startTime) {
		let time = startTime;

		//----- Format Header -----//
		oscillator.frequency.setValueAtTime(1900, time);
		time += HEADER_PULSE_LENGTH;
		oscillator.frequency.setValueAtTime(SYNC_PULSE_FREQ, time);
		time  += HEADER_BREAK_LENGTH;
		oscillator.frequency.setValueAtTime(1900, time);
		time += HEADER_PULSE_LENGTH;

		//-----VIS Code-----//
		//--- Start Bit ---//
		oscillator.frequency.setValueAtTime(SYNC_PULSE_FREQ, time);
		time += VIS_BIT_LENGTH;
		//--- 7 Bit Format Code ---//
		let parity = 0;
		let bitFreq;
		this.#VISCode.reverse().forEach((bit) => {
			if(bit){
				bitFreq = VIS_BIT_FREQ.ONE;
				++parity;
			}
			else
				bitFreq = VIS_BIT_FREQ.ZERO;
			oscillator.frequency.setValueAtTime(bitFreq, time)
			time += VIS_BIT_LENGTH;
		});
		//--- Even Parity Bit ---//
		bitFreq = parity % 2 == 0 ? VIS_BIT_FREQ.ZERO : VIS_BIT_FREQ.ONE;
		oscillator.frequency.setValueAtTime(bitFreq, time)
		time += VIS_BIT_LENGTH;
		//--- End Bit ---//
		oscillator.frequency.setValueAtTime(SYNC_PULSE_FREQ, time);
		time += VIS_BIT_LENGTH;

		return time;
	}

	prepareImage(data) {
		 this.#preparedImage = data;
	}

	encodeSSTV(oscillator, startTime) {
		throw new Error("Must be defined by a subclass");
	}

	getEncodedLength() {
		throw new Error("Must be defined by a subclass");
	}

	get modeName() {
		return this.#modeName;
	}

	set modeName(value) {
		this.#modeName = value;
	}

	get numScanLines() {
		return this.#numScanLines;
	}
	get pixelsPerLine() {
		return this.#pixelsPerLine;
	}
	get blankingInterval() {
		return this.#blankingInterval;
	}
	get scanLineLength() {
		return this.#scanLineLength;
	}
	get syncPulseLength() {
		return this.#syncPulseLength;
	}
	get VISCode() {
		return this.#VISCode;
	}
	get preparedImage(){
		return this.#preparedImage;
	}
}