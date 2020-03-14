const puppeteer = require('puppeteer');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 1337;
let log = "Empty log";

const server = http.createServer((req, res) => {
  console.log(req.url);

  if (req.url === '/log') {
    res.writeHead(200, {'Content-Type': 'application/json'});
    return res.end(JSON.stringify(log));
  }

  fs.readFile(path.resolve(__dirname, 'example.png'), (err, data) => {
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

    await page.goto('https://target.com/', {waitUntil:'domcontentloaded'});
    console.log('page connected');

    await page.waitFor(6000);
    await page.screenshot({path: path.resolve(__dirname, 'example.png')});
    console.log('page saved');

    await browser.close();

  } catch(err) {
    log = err;
  }

  server.listen(PORT);
  console.log("Server listening on http://localhost:%d", PORT);

})();
