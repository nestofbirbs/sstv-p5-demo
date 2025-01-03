const SSTV_MODES = {
  M1: { name: "Martin M1", category: "Martin", class: MartinMOne},
  M2: { name: "Martin M2", category: "Martin", class: MartinMTwo},
  S1: { name: "Scottie 1", category: "Scottie", class: ScottieOne},
  S2: { name: "Scottie 2", category: "Scottie", class: ScottieTwo},
  SDX: { name: "Scottie DX", category: "Scottie", class: ScottieDX},
  WraaseSC2180: { name: "SC2-180", category: "Wraase", class: WraaseSC2180},
  PD50: { name: "PD-50", category: "PD", class: PD50},
  PD90: { name: "PD-90", category: "PD", class: PD90},
  PD120: { name: "PD-120", category: "PD", class: PD120},
  PD160: { name: "PD-160", category: "PD", class: PD160},
  PD180: { name: "PD-180", category: "PD", class: PD180},
  PD240: { name: "PD-240", category: "PD", class: PD240},
  PD290: { name: "PD-290", category: "PD", class: PD290},
};

class SSTVEncoder {
  constructor(initialMode = "M1") {
    this.format = null;
    this._mode = initialMode; // Use a different property to avoid recursive calls
    this.setMode(initialMode);
  }

  get mode() {
    return this._mode;
  }

  set mode(newMode) {
    this.setMode(newMode);
  }

  setMode(newMode) {
    let key = newMode;
    if (typeof key !== 'string' || !key.trim()) {
      console.error("Invalid key provided. Key must be a non-empty string.");
      return;
    }

    if (key in SSTV_MODES) {
      try {
        this.format = new SSTV_MODES[key].class();
        this._mode = key;
        console.log(`Mode set to: "${SSTV_MODES[key].name}"`);
      } catch (error) {
        this.format = null;
        console.error(`Failed to instantiate class for mode: '${key}'. Error: ${error.message}`);
      }
    } else {
      this.format = null;
      console.error(`Invalid mode selected: '${key}'`);
    }
  }

  // getters for format properties
  get numScanLines() {
    return this.format ? this.format.numScanLines : 0;
  }
  get pixelsPerLine() {
    return this.format ? this.format.pixelsPerLine : 0;
  }
  get blankingInterval() {
    return this.format ? this.format.blankingInterval : 0;
  }
  get scanLineLength() {
    return this.format ? this.format.scanLineLength : 0;
  }
  get syncPulseLength() {
    return this.format ? this.format.syncPulseLength : 0;
  }
  get VISCode() {
    return this.format ? this.format.VISCode : [];
  }
}