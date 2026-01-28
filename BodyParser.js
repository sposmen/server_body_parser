/*
* This small server is to show in console any kind of request data
* being used for Check Webhooks/API requests, etc
* To start the server run `node server_body_parser.js`
* point your endpoint to http://localhost:8888
* */

import http from 'http';

const port = 8888;

/* Edit this method to set the response you need */
const expectedReturn = (response) => {
  response.statusCode = 200
  response.setHeader('Content-Type', 'application/json');
  response.end(`{"Reply":{"ReplyCode":0}}`);
}

const requestViewHook = [];

export const addRequestViewer = (fn)=>{
  requestViewHook.push(fn)
}

const showRequestBase = (
  {
    headers,
    httpVersion,
    method,
    socket: { remoteAddress, remoteFamily },
    url,
    body
  }
) => {
  const params = Object.fromEntries(new URLSearchParams(url))
  const request = {
    timestamp: Date.now(),
    headers,
    httpVersion,
    method,
    remoteAddress,
    remoteFamily,
    url,
    params,
    body
  }
  requestViewHook.forEach((fn) => fn(request))
  console.log("Request: ",request);
}

const processBody = (body) => (chunk) => body.push(chunk);

const endBody = (bodyRaw, response, request) => (
  () => {
    let body = Buffer.concat(bodyRaw).toString();
    try {
      body = JSON.parse(body);
    } catch (_e) {
    }
    showRequestBase({
      ...request,
      headers: request.headers,
      body
    })
    // showBody(body.toString());
    expectedReturn(response)
  }
);

const showBody = (bodyRaw)=>{
  const body = ((()=>{
    try {
      return JSON.parse(bodyRaw);
    } catch (e) {
      return bodyRaw;
    }
  }))();
  console.log("Body:" , body);
}

const onRequestError = (error) => console.error(error.message);

const server = http.createServer((request, response) => {
  let body = [];

  // If Main host is not requested it's not authorized
  if(!['api-parser.jaime-giraldo.com:8888', 'localhost:8888', 'server-body-parser:8888'].includes(request.headers.host)){
    response.statusCode = 404
    response.end('');
    return;
  }

  request.on("data", processBody(body));
  request.on("end", endBody(body, response, request));
  request.on("error", onRequestError);

});

// server.listen(port);
server.listen(port, );
