const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');

const { createServer } = require('../src/server');

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.listen(0, () => {
      const { port } = server.address();
      const req = http.request(
        {
          hostname: '127.0.0.1',
          port,
          path,
          method: options.method || 'GET',
          headers: options.headers || {}
        },
        (res) => {
          let body = '';
          res.on('data', (chunk) => {
            body += chunk;
          });
          res.on('end', () => {
            server.close();
            resolve({ status: res.statusCode, body });
          });
        }
      );

      req.on('error', (err) => {
        server.close();
        reject(err);
      });

      if (options.body) req.write(options.body);
      req.end();
    });
  });
}

test('GET /api/v1/health responds with ok status', async () => {
  const res = await request('/api/v1/health');
  assert.equal(res.status, 200);
  const payload = JSON.parse(res.body);
  assert.equal(payload.status, 'ok');
});

test('POST /api/v1/contact rejects malformed payload', async () => {
  const res = await request('/api/v1/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullName: 'ab', email: 'bad', subject: 'x', message: 'tiny' })
  });

  assert.equal(res.status, 400);
  const payload = JSON.parse(res.body);
  assert.equal(payload.status, 'error');
  assert.ok(payload.errors.length >= 1);
});

test('POST /api/v1/contact accepts valid payload', async () => {
  const res = await request('/api/v1/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Alice Johnson',
      email: 'alice@example.com',
      subject: 'Admission inquiry',
      message: 'I would like to know the timeline for admissions this year.'
    })
  });

  assert.equal(res.status, 201);
  const payload = JSON.parse(res.body);
  assert.equal(payload.status, 'success');
  assert.equal(payload.data.email, 'alice@example.com');
});
