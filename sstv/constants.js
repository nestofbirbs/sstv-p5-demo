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

//---------- Encoding Constants ----------//

const PREFIX_PULSE_LENGTH = 0.1;  //100 ms
const HEADER_PULSE_LENGTH = 0.3;  //300 ms
const HEADER_BREAK_LENGTH = 0.01; //10 ms
const VIS_BIT_LENGTH = 0.03;      //30 ms
const SYNC_PULSE_FREQ = 1200;
const BLANKING_PULSE_FREQ = 1500;
const COLOR_FREQ_MULT = 3.1372549;
const VIS_BIT_FREQ = {
	ONE: 1100,
	ZERO: 1300,
};

const SSTV_MODES = {
    M1: { label: "Martin M1", class: "Martin", horizontalResolution: 320, lines: 256, headerLines: 16 },
    M2: { label: "Martin M2", class: "Martin", horizontalResolution: 160, lines: 256, headerLines: 16 },
    S1: { label: "Scottie 1", class: "Scottie", horizontalResolution: 320, lines: 256, headerLines: 16 },
    S2: { label: "Scottie 2", class: "Scottie", horizontalResolution: 160, lines: 256, headerLines: 16 },
    SDX: { label: "Scottie DX", class: "Scottie", horizontalResolution: 320, lines: 256, headerLines: 16 },
    WrasseSC2180: { label: "SC2-180", class: "Wrasse", horizontalResolution: 320, lines: 256 },
    PD50: { label: "PD-50", class: "PD", horizontalResolution: 320, lines: 256, headerLines: 16 },
    PD90: { label: "PD-90", class: "PD", horizontalResolution: 320, lines: 256, headerLines: 16 },
    PD120: { label: "PD-120", class: "PD", horizontalResolution: 640, lines: 496, headerLines: 16 },
    PD160: { label: "PD-160", class: "PD", horizontalResolution: 512, lines: 400, headerLines: 16 },
    PD180: { label: "PD-180", class: "PD", horizontalResolution: 640, lines: 496, headerLines: 16 },
    PD240: { label: "PD-240", class: "PD", horizontalResolution: 640, lines: 496, headerLines: 16 },
    PD290: { label: "PD-290", class: "PD", horizontalResolution: 800, lines: 616, headerLines: 16 },
};