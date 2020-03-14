const puppeteer = require('puppeteer');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 1337;
const URL = process.env.URL || "https://bungeetech.com";
const log = fs.createWriteStream(__dirname + '/debug.log', { flags : 'w' });

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


(async () => {

  try{
    const browser = await puppeteer.launch({
      dumpio: true,
      headless: false,
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

    await page.waitFor(5000);
    await page.screenshot({path: path.resolve(__dirname, 'example.png')});
    console.log('page saved');

    await browser.close();

    throw new Error('oh my!')
  } catch(err) {
    log.write(err.toString() + '\n');
  }

  server.listen(PORT);
  console.log("Server listening on http://localhost:%d", PORT);
})();
