const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

const PORT = process.env.PORT || 8081;
const log = fs.createWriteStream('./debug.log', { flags: 'a' });
let imageIndex = 1;

app.get('/', (req, res) => {
  return res.redirect('screenshot?url=https://www.wholefoodsmarket.com/');
});

app.post('/azureTest', (req, res) => {
  return res.status(200);
});

app.get('/screenshot', async (req, res) => {
  const url = req.query['url'];
  if (!url) return res.status(400).json({ message: 'Missing URL'});

  const imageFilename = await takeScreenShot(url).catch(err => logAndRespond(err));
  if (!imageFilename) return res.status(500).json({ message: 'Cannot take screenshots at this time'});

  return res.redirect(imageFilename);

  async function takeScreenShot(url) {
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
    }).catch(err => logAndRespond(err));
  
    console.log('browser starting');
    const page = await browser.newPage().catch(err => logAndRespond(err));
    console.log('browser started');
    
    await page.goto(url, {waitUntil:'domcontentloaded'}).catch(err => logAndRespond(err));
    console.log('page connected');
    
    await page.waitFor(5500).catch(err => logAndRespond(err));
    
    const imageFilename = 'screenshot-' + `0${String(imageIndex++)}`.substr(-2) + '.png';
    await page.screenshot({ path: path.resolve(__dirname, imageFilename) }).catch(err => logAndRespond(err));
    console.log('page saved');
    
    await browser.close().catch(err => logAndRespond(err));

    return imageFilename;
  }

  function logAndRespond(err) {
    if (err) {
      log.write(new Date().toUTCString() + '\n');
      log.write(err.stack + '\n\n');
      return res.status(500).json(err.stack);
    }
    
    return res.status(404).end();
  }
});

app.get('/:filename', (req, res) => {
  const filename = req.params.filename;
  fs.readFile(path.join(__dirname, filename), (err, data) => {
    if (err) return res.status(404).json(err);
    return res.status(200).end(data);
  }); 
});

// DUPLICATE.
// ALSO NOTE that custom error handlers must have all four input parameters
// app.use((err, req, res, next) => {
//   if (err) {
//     log.write(new Date().toUTCString() + '\n');
//     log.write(err.stack + '\n\n');
//     return res.status(500).json(err.stack);
//   }
  
//   return res.status(404).end();
// });

app.listen(PORT, (err) => {
  if (err) console.log(err);
  
  console.log(`Server listening at http://localhost:${PORT}`);
})