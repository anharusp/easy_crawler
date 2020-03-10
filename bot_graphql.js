'use strict';

const puppeteer = require('puppeteer');
const fs = require("fs");
const filesDirectory = '/home/anna/Documents/7 semester/Thesis/easy_crawler/graphql_new/';
let name_index = 0;

function delay(delta) {
    return new Promise(resolve => setTimeout(resolve, delta));
}

async function main() {
  const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox']
    });
  const page = await browser.newPage();

  if (!fs.existsSync(filesDirectory)) {
    fs.mkdirSync(filesDirectory);
  }

  //await page.setRequestInterception(true);


  const handleRequest =  request => {
    if (request.method == 'POST') {
      let name = `${name_index}.txt`
      //console.log(request.method() + ' '+ request.url());
      let data = request.method + ' '+ request.url;

      let current_headers = request.headers;
      for (let key in current_headers) {
        //console.log(key, current_headers[key]);
        data += '\n' + key + ' ' + current_headers[key];
      }
      //console.log(request.postData());
      data += '\n\n' + request.postData;

      console.log(data);
      fs.writeFileSync(filesDirectory + name, data);
      name_index += 1;
    }
  };

  const pendingRequests = {};

  const client = await page.target().createCDPSession();
  await client.send('Network.enable');
  await client.on('Network.requestWillBeSent', async evt => {
    const requestId = evt.requestId;
    const request = evt.request;

    const allHeaders = await Promise.race([
        delay(700), // 700 millisecond timeout
        new Promise(resolve => { pendingRequests[requestId] = resolve; })
    ]);

    delete pendingRequests[requestId];

    if (allHeaders) {
        request.headers = allHeaders;
    }
    handleRequest(request);

  });
  await client.on('Network.requestWillBeSentExtraInfo', evt => {
    const requestId = evt.requestId;
    const headers = evt.headers;

    if (pendingRequests[requestId]) {
        pendingRequests[requestId](headers);
    }
  });


  await page.goto('https://www.coursera.org/');

  //console.log(cookies);

  function dumpFrameTree(frame, indent) {
    console.log(indent + frame.url());
    for (let child of frame.childFrames())
      dumpFrameTree(child, indent + '  ');

  }
}

// Start the script
main();