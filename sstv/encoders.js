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

//---------- Format Encode Implementation ----------//
class MartinBase extends Format {
	prepareImage(data) {
		let preparedImage = [];
		for(let scanLine = 0; scanLine < this.numScanLines; ++scanLine){
			let red = [];
			let green = [];
			let blue = [];
			for(let vertPos = 0; vertPos < this.vertResolution; ++vertPos){
  				let freqs = this.getRGBValueAsFreq(data, scanLine, vertPos);
  				red.push(freqs[0]);
  				green.push(freqs[1]);
  				blue.push(freqs[2]);
  			}
  			preparedImage.push([green, blue, red]);
		}

		super.prepareImage(preparedImage);
	}

	encodeSSTV(oscillator, startTime) {
		let time = startTime;

		time = super.encodePrefix(oscillator, time);
		time = super.encodeHeader(oscillator, time);

		for(let scanLine = 0; scanLine < super.numScanLines; ++scanLine){
			oscillator.frequency.setValueAtTime(SYNC_PULSE_FREQ, time);
			time += super.syncPulseLength;
			oscillator.frequency.setValueAtTime(BLANKING_PULSE_FREQ, time);
			time += super.blankingInterval;
			for(let dataLine = 0; dataLine < 3; ++dataLine) {
				oscillator.frequency.setValueCurveAtTime(super.preparedImage[scanLine][dataLine], time, super.scanLineLength);
				time += super.scanLineLength;
				oscillator.frequency.setValueAtTime(BLANKING_PULSE_FREQ, time);
				time += super.blankingInterval;
			}
		}

		return time;
	}
	getEncodedLength() {
		return (super.numScanLines * (super.syncPulseLength + super.blankingInterval + 3 * (super.scanLineLength + super.blankingInterval)));
	}
}
class MartinMOne extends MartinBase {
	constructor() {
		let numScanLines = 256;
		let vertResolution = 320;
		let blankingInterval = 0.000572;
		let scanLineLength = 0.146432;
		let syncPulseLength = 0.004862;
		let VISCode = [false, true, false, true, true, false, false];

		super(numScanLines, vertResolution, blankingInterval, scanLineLength, syncPulseLength, VISCode);
	}
}
class MartinMTwo extends MartinBase {
	constructor() {
		let numScanLines = 256;
		let vertResolution = 320;
		let blankingInterval = 0.000572;
		let scanLineLength = 0.073216;
		let syncPulseLength = 0.004862;
		let VISCode = [false, true, false, true, false, false, false];

		super(numScanLines, vertResolution, blankingInterval, scanLineLength, syncPulseLength, VISCode);
	}
}

class ScottieBase extends Format {
	prepareImage(data) {
		let preparedImage = [];
		for(let scanLine = 0; scanLine < this.numScanLines; ++scanLine){
			let red = [];
			let green = [];
			let blue = [];
			for(let vertPos = 0; vertPos < this.vertResolution; ++vertPos){
  				let freqs = this.getRGBValueAsFreq(data, scanLine, vertPos);
  				red.push(freqs[0]);
  				green.push(freqs[1]);
  				blue.push(freqs[2]);
  			}
  			preparedImage.push([green, blue, red]);
		}

		super.prepareImage(preparedImage);
	}

	encodeSSTV(oscillator, startTime) {
		let time = startTime;

		time = super.encodePrefix(oscillator, time);
		time = super.encodeHeader(oscillator, time);

		oscillator.frequency.setValueAtTime(SYNC_PULSE_FREQ, time);
		time += super.syncPulseLength;

		for(let scanLine = 0; scanLine < super.numScanLines; ++scanLine){
			for(let dataLine = 0; dataLine < 3; ++dataLine) {
				if(dataLine == 2){
					oscillator.frequency.setValueAtTime(SYNC_PULSE_FREQ, time);
					time += super.syncPulseLength;
				}
				oscillator.frequency.setValueAtTime(BLANKING_PULSE_FREQ, time);
				time += super.blankingInterval;
				oscillator.frequency.setValueCurveAtTime(super.preparedImage[scanLine][dataLine], time, super.scanLineLength);
				time += super.scanLineLength;
			}
		}

		return time;
	}

	getEncodedLength() {
		return (super.syncPulseLength + (super.numScanLines * (super.syncPulseLength / 2 + super.blankingInterval + super.scanLineLength)));
	}
}
class ScottieOne extends ScottieBase {
	constructor() {
		let numScanLines = 256;
		let vertResolution = 320;
		let blankingInterval = 0.0015;
		let scanLineLength = 0.138240;
		let syncPulseLength = 0.009;
		let VISCode = [false, true, true, true, true, false, false];

		super(numScanLines, vertResolution, blankingInterval, scanLineLength, syncPulseLength, VISCode);
	}
}
class ScottieTwo extends ScottieBase {
	constructor() {
		let numScanLines = 256;
		let vertResolution = 320;
		let blankingInterval = 0.0015;
		let scanLineLength = 0.088064;
		let syncPulseLength = 0.009;
		let VISCode = [false, true, true, true, false, false, false];

		super(numScanLines, vertResolution, blankingInterval, scanLineLength, syncPulseLength, VISCode);
	}
}
class ScottieDX extends ScottieBase {
	constructor() {
		let numScanLines = 256;
		let vertResolution = 320;
		let blankingInterval = 0.0015;
		let scanLineLength = 0.3456;
		let syncPulseLength = 0.009;
		let VISCode = [true, false, false, true, true, false, false];

		super(numScanLines, vertResolution, blankingInterval, scanLineLength, syncPulseLength, VISCode);
	}
}

class PDBase extends Format {
	prepareImage(data) {
		let preparedImage = [];
		for(let scanLine = 0; scanLine < this.numScanLines; ++scanLine){
			let Y = [];
			let RY = [];
			let BY = [];
			for(let vertPos = 0; vertPos < this.vertResolution; ++vertPos){
  				let freqs = this.getYRYBYValueAsFreq(data, scanLine, vertPos);
  				Y.push(freqs[0]);
  				RY.push(freqs[1]);
  				BY.push(freqs[2]);
  			}
  			preparedImage.push([Y, RY, BY]);
		}
		for(let scanLine = 0; scanLine < this.numScanLines; scanLine += 2){
			for(let vertPos = 0; vertPos < this.vertResolution; ++vertPos){
				let RY = preparedImage[scanLine][1][vertPos] + preparedImage[scanLine + 1][1][vertPos]
				preparedImage[scanLine][1][vertPos] = RY / 2;
				let BY = preparedImage[scanLine][2][vertPos] + preparedImage[scanLine + 1][2][vertPos]
				preparedImage[scanLine][2][vertPos] = BY / 2;
			}
		}
		super.prepareImage(preparedImage);
	}

	encodeSSTV(oscillator, startTime) {
		let time = startTime;

		time = super.encodePrefix(oscillator, time);
		time = super.encodeHeader(oscillator, time);

		for(let scanLine = 0; scanLine < super.numScanLines; scanLine += 2){
			oscillator.frequency.setValueAtTime(SYNC_PULSE_FREQ, time);
			time += super.syncPulseLength;
			oscillator.frequency.setValueAtTime(BLANKING_PULSE_FREQ, time);
			time += super.blankingInterval;

			oscillator.frequency.setValueCurveAtTime(super.preparedImage[scanLine][0], time, super.scanLineLength);
			time += super.scanLineLength;
			oscillator.frequency.setValueCurveAtTime(super.preparedImage[scanLine][1], time, super.scanLineLength);
			time += super.scanLineLength;
			oscillator.frequency.setValueCurveAtTime(super.preparedImage[scanLine][2], time, super.scanLineLength);
			time += super.scanLineLength;
			oscillator.frequency.setValueCurveAtTime(super.preparedImage[scanLine + 1][0], time, super.scanLineLength);
			time += super.scanLineLength;
		}

		return time;
	}

	getEncodedLength() {
		return (super.numScanLines * (super.syncPulseLength + super.blankingInterval + super.scanLineLength * 4));
	}
}
class PD50 extends PDBase {
	constructor() {
		let numScanLines = 256;
		let vertResolution = 320;
		let blankingInterval = 0.00208;
		let scanLineLength = 0.091520;
		let syncPulseLength = 0.02;
		let VISCode = [true, false, true, true, true, false, true];

		super(numScanLines, vertResolution, blankingInterval, scanLineLength, syncPulseLength, VISCode);
	}
}
class PD90 extends PDBase {
	constructor() {
		let numScanLines = 256;
		let vertResolution = 320;
		let blankingInterval = 0.00208;
		let scanLineLength = 0.170240;
		let syncPulseLength = 0.02;
		let VISCode = [true, true, false, false, false, true, true];

		super(numScanLines, vertResolution, blankingInterval, scanLineLength, syncPulseLength, VISCode);
	}
}
class PD120 extends PDBase {
	constructor() {
		let numScanLines = 496;
		let vertResolution = 640;
		let blankingInterval = 0.00208;
		let scanLineLength = 0.121600;
		let syncPulseLength = 0.02;
		let VISCode = [true, false, true, true, true, true, true];

		super(numScanLines, vertResolution, blankingInterval, scanLineLength, syncPulseLength, VISCode);
	}
}
class PD160 extends PDBase {
	constructor() {
		let numScanLines = 400;
		let vertResolution = 512;
		let blankingInterval = 0.00208;
		let scanLineLength = 0.195584;
		let syncPulseLength = 0.02;
		let VISCode = [true, true, false, false, true, false, false];

		super(numScanLines, vertResolution, blankingInterval, scanLineLength, syncPulseLength, VISCode);
	}
}
class PD180 extends PDBase {
	constructor() {
		let numScanLines = 496;
		let vertResolution = 640;
		let blankingInterval = 0.00208;
		let scanLineLength = 0.18304;
		let syncPulseLength = 0.02;
		let VISCode = [true, true, false, false, false, false, false];

		super(numScanLines, vertResolution, blankingInterval, scanLineLength, syncPulseLength, VISCode);
	}
}
class PD240 extends PDBase {
	constructor() {
		let numScanLines = 496;
		let vertResolution = 640;
		let blankingInterval = 0.00208;
		let scanLineLength = 0.24448;
		let syncPulseLength = 0.02;
		let VISCode = [true, true, false, false, false, false, true];

		super(numScanLines, vertResolution, blankingInterval, scanLineLength, syncPulseLength, VISCode);
	}
}
class PD290 extends PDBase {
	constructor() {
		let numScanLines = 616;
		let vertResolution = 800;
		let blankingInterval = 0.00208;
		let scanLineLength = 0.2288;
		let syncPulseLength = 0.02;
		let VISCode = [true, false, true, true, true, true, false];

		super(numScanLines, vertResolution, blankingInterval, scanLineLength, syncPulseLength, VISCode);
	}
}

class WrasseSC2 extends Format {
	prepareImage(data) {
		let preparedImage = [];
		for(let scanLine = 0; scanLine < this.numScanLines; ++scanLine){
			let red = [];
			let green = [];
			let blue = [];
			for(let vertPos = 0; vertPos < this.vertResolution; ++vertPos){
  				let freqs = this.getRGBValueAsFreq(data, scanLine, vertPos);
  				red.push(freqs[0]);
  				green.push(freqs[1]);
  				blue.push(freqs[2]);
  			}
  			preparedImage.push([red, green, blue]);
		}

		super.prepareImage(preparedImage);
	}

	encodeSSTV(oscillator, startTime) {
		let time = startTime;

		time = super.encodePrefix(oscillator, time);
		time = super.encodeHeader(oscillator, time);

		for(let scanLine = 0; scanLine < super.numScanLines; ++scanLine){
			oscillator.frequency.setValueAtTime(SYNC_PULSE_FREQ, time);
			time += super.syncPulseLength;
			oscillator.frequency.setValueAtTime(BLANKING_PULSE_FREQ, time);
			time += super.blankingInterval;
			for(let dataLine = 0; dataLine < 3; ++dataLine) {
				oscillator.frequency.setValueCurveAtTime(super.preparedImage[scanLine][dataLine], time, super.scanLineLength);
				time += super.scanLineLength;
			}
		}

		return time;
	}

	getEncodedLength() {
		return (super.numScanLines * (super.syncPulseLength + super.blankingInterval + super.scanLineLength * 3));
	}
}
class WrasseSC2180 extends WrasseSC2 {
	constructor() {
		let numScanLines = 256;
		let vertResolution = 320;
		let blankingInterval = 0.0005;
		let scanLineLength = 0.235;
		let syncPulseLength = 0.0055225;
		let VISCode = [false, true, true, false, true, true, true];

		super(numScanLines, vertResolution, blankingInterval, scanLineLength, syncPulseLength, VISCode);
	}
}