/**
 * System configuration file
 */
const os = require('os');


// define chrome executable path
const osPlatform = os.platform(); // possible values are: 'darwin', 'freebsd', 'linux', 'sunos' or 'win32'
let executablePath;
if (/^win/i.test(osPlatform)) {
  executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
} else if (/^linux/i.test(osPlatform)) {
  executablePath = '/usr/bin/google-chrome';
} else if (/^darwin/i.test(osPlatform)) {
  executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
}




/*** define possible devices ***/
const my_devices = {
  // custom devices
  'Desktop Linux': {
    name: 'Desktop 1920x1080',
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36',
    viewport: {
      width: 1300,
      height: 900,
      deviceScaleFactor: 1,
      isMobile: false,
      hasTouch: false,
      isLandscape: false

    }
  },
  'Desktop Windows': {
    name: 'Desktop 1920x1080',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.75 Safari/537.36',
    viewport: {
      width: 1300,
      height: 900,
      deviceScaleFactor: 0.5,
      isMobile: false,
      hasTouch: false,
      isLandscape: true
    }
  },
  'Desktop Macintosh': {
    name: 'Desktop Macintosh',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
    viewport: {
      width: 1300,
      height: 900,
      deviceScaleFactor: 0.5,
      isMobile: false,
      hasTouch: false,
      isLandscape: true
    }
  }
};




module.exports = (device_name, headless, puppeteer) => {

  // extend devices
  const pup_devices = puppeteer.devices;
  const devices = { ...pup_devices, ...my_devices };

  const device = devices[device_name];

  // browser & viewport dimensions
  const offsetX = 700;
  const offsetY = 20;
  const browserWidth = device.viewport.width + 20;
  const browserHeight = device.viewport.height + 150;

  const sysconfig = {
    osPlatform,
    device,
    puppeteer: {
      executablePath,
      headless, // 'new', 'old', false -- https://developer.chrome.com/articles/new-headless/
      devtools: false,  // Open Chrome devtools at the beginning of the test
      dumpio: false,
      slowMo: 130,  // Wait 130 ms each step of execution, for example chars typing

      // list of all args https://peter.sh/experiments/chromium-command-line-switches/
      args: [
        '--disable-dev-shm-usage',
        '--disable-notifications', // disable Show Notifications small popup
        `--ash-host-window-bounds=${browserWidth}x${browserHeight}`,
        `--window-size=${browserWidth},${browserHeight}`,
        `--window-position=${offsetX},${offsetY}`,

        // required for iframe
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
        '--disable-features=site-per-process'
      ]
    }
  };

  return sysconfig;

};
