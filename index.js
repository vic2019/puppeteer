const puppeteer = require('puppeteer');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 1337;
const URL = process.env.URL || "https://walmart.com/";
const log = fs.createWriteStream(__dirname + '/debug.log', { flags : 'w' });

// Create a file server to check the result of screenshot
const server = http.createServer((req, res) => {
  fs.readFile(path.join(__dirname, req.url), (err, data) => {
    if (err) {
      res.writeHead(404, {'Content-Type': 'application/json'});
      return res.end(JSON.stringify(err));
    }

    res.writeHead(200);
    return res.end(data);
  }); 
});

// Launch a headful Chromium, take a screenshot and save it as example.png. 
// Then, start the file server.
(async () => {

  try{
    const browser = await puppeteer.launch({
      dumpio: true,
      headless: false,
      defaultViewport: {
        width: 1280,
        height: 5120
      },
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ]
    });

    console.log('browser starting');
    const page = await browser.newPage();
    console.log('browser started');

    await page.goto(URL, {waitUntil:'domcontentloaded'});
    console.log('page connected');

    await page.waitFor(6000);
    await page.screenshot({path: path.resolve(__dirname, 'example.png')});
    console.log('page saved');

    await browser.close();

  } catch(err) {
    log.write(err.toString() + '\n');
  }

  server.listen(PORT);
  console.log("Server listening on http://localhost:%d", PORT);
})();
