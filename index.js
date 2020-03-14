const puppeteer = require('puppeteer');

(async () => {

  let browser = await puppeteer.launch({
      dumpio: true,
      headless: true,
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
  await page.waitFor(5000);
  await page.screenshot({path: require('path').resolve(__dirname, 'example.png')});
  console.log('page saved');
  await browser.close();

})();

const http = require('http');
const fs = require('fs');
const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  fs.readFile(__dirname + req.url, (err, data) => {
    if (err) {
      res.writeHead(404);
      return res.end(JSON.stringify(err));
    }

    res.writeHead(200);
    res.end(data);
  });
}).listen(process.env.PORT || 8080);

console.log("Server running at http://localhost:%d", PORT);