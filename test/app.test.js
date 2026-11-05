const { describe, it, after } = require('node:test');
const assert = require('node:assert');
const app = require('../src/app');

describe('GET /', () => {
  let server;
  let baseUrl;

  after(() => {
    return new Promise((resolve) => {
      server.close(resolve);
    });
  });

  it('trả về status 200 và JSON có các trường host, cpus, memoryGB', async () => {
    await new Promise((resolve) => {
      server = app.listen(0, () => {
        const { port } = server.address();
        baseUrl = `http://localhost:${port}`;
        resolve();
      });
    });

    const res = await fetch(`${baseUrl}/`);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.ok(body.host, 'Thiếu trường host');
    assert.ok(typeof body.cpus === 'number', 'Thiếu hoặc sai kiểu trường cpus');
    assert.ok(typeof body.memoryGB === 'number', 'Thiếu hoặc sai kiểu trường memoryGB');
  });
});
