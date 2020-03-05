'use strict';

const puppeteer = require('puppeteer');
let name_index = 0

async function main() {
  const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox']
    });
  const page = await browser.newPage();
  const fs = require("fs");

  //await page.setRequestInterception(true);
  page.on('request', request => {
    if (request.method() == 'POST') {
      let name = `${name_index}.txt`
      //console.log(request.method() + ' '+ request.url());
      let data = request.method() + ' '+ request.url();

      let current_headers = request.headers();
      for (let key in current_headers) {
        //console.log(key, current_headers[key]);
        data += '\n' + key + ' ' + current_headers[key];
      }
      //console.log(request.postData());
      data += '\n\n' + request.postData();

      console.log(data);
      fs.writeFileSync(name, data);
      name_index += 1;
    }
  });
  ;
  await page.goto('https://vk.com/');

  //console.log(cookies);

  function dumpFrameTree(frame, indent) {
    console.log(indent + frame.url());
    for (let child of frame.childFrames())
      dumpFrameTree(child, indent + '  ');

  }
}

// Start the script
main();