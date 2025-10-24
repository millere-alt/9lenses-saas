import { app } from '@azure/functions';
import createExpressApp from './server.js';

// Lazy-initialized Express app
let expressApp = null;

async function getExpressApp() {
  if (!expressApp) {
    console.log('Initializing Express app...');
    expressApp = await createExpressApp();
    console.log('Express app initialized');
  }
  return expressApp;
}

// Register HTTP trigger with catch-all routing
app.http('api', {
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
  authLevel: 'anonymous',
  route: '{*proxy}',
  handler: async (request, context) => {
    const express = await getExpressApp();

    // Extract path from proxy parameter
    const path = request.params.proxy || '';
    const queryString = request.query ? '?' + new URLSearchParams(Object.fromEntries(request.query)).toString() : '';
    const url = `/${path}${queryString}`;

    console.log(`Request: ${request.method} ${url}`);

    return new Promise((resolve) => {
      const mockReq = {
        method: request.method,
        url: url,
        headers: Object.fromEntries(request.headers.entries()),
        body: request.body,
        query: request.query || {},
        params: request.params || {}
      };

      let statusCode = 200;
      const responseHeaders = {};
      let responseBody = '';

      const mockRes = {
        statusCode: 200,
        setHeader(name, value) {
          responseHeaders[name] = value;
          return this;
        },
        getHeader(name) {
          return responseHeaders[name];
        },
        removeHeader(name) {
          delete responseHeaders[name];
          return this;
        },
        writeHead(code, headers) {
          statusCode = code;
          if (headers) {
            Object.assign(responseHeaders, headers);
          }
          return this;
        },
        write(chunk) {
          responseBody += chunk;
          return this;
        },
        end(data) {
          if (data) responseBody += data;

          console.log(`Response: ${statusCode} ${responseBody.length} bytes`);

          resolve({
            status: statusCode,
            headers: responseHeaders,
            body: responseBody
          });
        },
        status(code) {
          statusCode = code;
          this.statusCode = code;
          return this;
        },
        json(data) {
          responseHeaders['Content-Type'] = 'application/json';
          responseBody = JSON.stringify(data);
          this.end();
          return this;
        },
        send(data) {
          if (typeof data === 'object') {
            responseHeaders['Content-Type'] = 'application/json';
            responseBody = JSON.stringify(data);
          } else {
            responseBody = String(data);
          }
          this.end();
          return this;
        }
      };

      // Call Express app
      express(mockReq, mockRes);
    });
  }
});
