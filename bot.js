'use strict';

const puppeteer = require('puppeteer');

async function main() {
  const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox']
    });
  const page = await browser.newPage();
  
  //await page.setRequestInterception(true);
  page.on('request', request => {
    //console.log(request);
    if (request.method() == 'POST') {
      console.log(request.method() + ' '+ request.url());
      let current_headers = request.headers();
      for (let key in current_headers) {
        console.log(key, current_headers[key]);
      }
      console.log(request.postData());
      //console.log(page.cookies());
      dumpFrameTree(page.mainFrame(), '');

    }
  });
  ;
  await page.goto('https://vk.com/');

  //const cookies = await page.cookies()
  //console.log(cookies);

  function dumpFrameTree(frame, indent) {
    console.log(indent + frame.url());
    for (let child of frame.childFrames())
      dumpFrameTree(child, indent + '  ');

  }
}

// Start the script
main();