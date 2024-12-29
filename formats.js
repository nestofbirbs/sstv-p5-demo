let sstvFormat;

function initializeFormat(mode) {
  console.log(`Selected mode: ${mode} (${SSTV_MODES[mode].label})`);
  updateFormat(mode);
}

function updateFormat(encodingMode = "M1") {
  switch (encodingMode) {
    case "M1":
      sstvFormat = new MartinMOne();
      break;
    case "M2":
      sstvFormat = new MartinMTwo();
      break;
    case "S1":
      sstvFormat = new ScottieOne();
      break;
    case "S2":
      sstvFormat = new ScottieTwo();
      break;
    case "SDX":
      sstvFormat = new ScottieDX();
      break;
    case "PD50":
      sstvFormat = new PD50();
      break;
    case "PD90":
      sstvFormat = new PD90();
      break;
    case "PD120":
      sstvFormat = new PD120();
      break;
    case "PD160":
      sstvFormat = new PD160();
      break;
    case "PD180":
      sstvFormat = new PD180();
      break;
    case "PD240":
      sstvFormat = new PD240();
      break;
    case "PD290":
      sstvFormat = new PD290();
      break;
    case "RobotBW8":
      sstvFormat = new RobotBW8();
      break;
    case "WrasseSC2180":
      sstvFormat = new WrasseSC2180();
      break;
    default:
      sstvFormat = null; // Or handle invalid mode here
      console.error(`Invalid mode selected: '${modeSelect.value()}'`);
  }
}