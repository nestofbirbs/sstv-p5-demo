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