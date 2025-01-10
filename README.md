# SSTV Encoding for p5.js

This project demonstrates how to encode images created with [p5.js](https://p5js.org/) into audio signals that can be transmitted over radio using [Slow Scan Television](https://en.wikipedia.org/wiki/Slow-scan_television) (SSTV).

Try out the [Demo](https://sableraf.github.io/sstv-p5-demo/).

This is a fun way to learn about  encoding images and radio communication. It is not intended for anything serious. However, feel free to use it for educational purposes, to build cool art projects, or just for fun! Plus, if the internet disappears and you need to transmit your generative art over radio, you'll be ready 🙃

> [!NOTE]
> This project is heavily based on the amazing [Web-SSTV](https://github.com/CKegel/Web-SSTV/) by Christian Kegel. 

## About p5.js
[p5.js](https://p5js.org/) is a friendly tool for learning how to code and make code-based art. It is inspired by [Processing](https://processing.org/), but is written in Javascript and runs in the browser.

## About SSTV
[Slow Scan Television](https://en.wikipedia.org/wiki/Slow-scan_television) (SSTV) is a method of transmitting static images via radio waves, used mainly by [amateur radio operators](https://en.wikipedia.org/wiki/Amateur_radio_operator).

## Features
- Encode the p5.js canvas into an SSTV audio signal
- Download the SSTV audio file
- Support for various SSTV modes

## Limitations
Decoding is not currently supported. If you'd like to help with this, please head over to the [Web-SSTV](https://github.com/CKegel/Web-SSTV/) repository.

## Usage
1. Clone the repository.
2. Navigate to the project directory.
3. Open `index.html` in your web browser to run the application.
4. Modify the p5.js code in the sketch.js file to create custom visuals that can be encoded into SSTV signals.

## Decoding Images
To decode the image from the audio, you will need an SSTV decoder. There are many available online, such as [MMSSTV](https://hamsoft.ca/pages/mmsstv.php) for Windows, [Robot36](https://play.google.com/store/apps/details?id=xdsopl.robot36&hl=en) for Android, or [CQ SSTV](https://apps.apple.com/us/app/sstv-slow-scan-tv/id387910013) for iOS/iPadOS.

## SSTV Modes

Multiple SSTV modes are supported, including:

-   **Martin** (e.g., Martin M1, Martin M2)
-   **Scottie** (e.g., Scottie S1, Scottie S2, Scottie DX)
-   **PD** (e.g., PD50, PD90, PD120, PD160)
-   **WRAASE SC2-180**

## Contributing

For anything related to the SSTV code, please contribute to the original project at [Web-SSTV](https://github.com/CKegel/Web-SSTV/).

For the p5.js integration, feel free open an issue or submit a pull request.

## License

This project is available freely under the MIT license. See the [LICENSE.md](LICENSE.md) file for more information.
