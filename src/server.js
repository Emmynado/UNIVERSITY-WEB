const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { URL } = require('node:url');

const service = require('./services/universityService');
const { validateContactPayload } = require('./middleware/validators');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');

function json(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY'
  });
  res.end(JSON.stringify(payload));
}

function text(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end(payload);
}

function getMimeType(filePath) {
  if (filePath.endsWith('.html')) return 'text/html; charset=utf-8';
  if (filePath.endsWith('.css')) return 'text/css; charset=utf-8';
  if (filePath.endsWith('.js')) return 'application/javascript; charset=utf-8';
  if (filePath.endsWith('.json')) return 'application/json; charset=utf-8';
  return 'application/octet-stream';
}

function serveStatic(res, relativePath) {
  const safePath = path.normalize(relativePath).replace(/^\.\.(\/|\\|$)/, '');
  const finalPath = path.join(PUBLIC_DIR, safePath);
  if (!finalPath.startsWith(PUBLIC_DIR)) {
    json(res, 400, { status: 'error', message: 'Invalid path.' });
    return;
  }

  fs.readFile(finalPath, (error, data) => {
    if (error) {
      json(res, 404, { status: 'error', message: 'Resource not found.' });
      return;
    }

    res.writeHead(200, { 'Content-Type': getMimeType(finalPath) });
    res.end(data);
  });
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let payload = '';
    req.on('data', (chunk) => {
      payload += chunk;
      if (payload.length > 1_000_000) {
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => resolve(payload));
    req.on('error', (error) => reject(error));
  });
}

function handleApi(req, res, pathname) {
  if (req.method === 'GET' && pathname === '/api/v1/health') {
    return json(res, 200, { status: 'ok', service: 'university-web-api', uptimeSeconds: process.uptime() });
  }
  if (req.method === 'GET' && pathname === '/api/v1/overview') {
    return json(res, 200, { status: 'success', data: service.getOverview() });
  }
  if (req.method === 'GET' && pathname === '/api/v1/departments') {
    const departments = service.listDepartments();
    return json(res, 200, { status: 'success', count: departments.length, data: departments });
  }
  if (req.method === 'GET' && pathname.startsWith('/api/v1/departments/')) {
    const departmentId = pathname.split('/').pop();
    const department = service.getDepartmentById(departmentId);
    if (!department) return json(res, 404, { status: 'error', message: 'Department not found.' });
    return json(res, 200, { status: 'success', data: department });
  }
  if (req.method === 'GET' && pathname === '/api/v1/announcements') {
    return json(res, 200, { status: 'success', data: service.listAnnouncements() });
  }
  if (req.method === 'GET' && pathname === '/api/v1/faculty') {
    return json(res, 200, { status: 'success', data: service.listFaculty() });
  }
  if (req.method === 'GET' && pathname === '/api/v1/admin/contact-submissions') {
    const rows = service.listContactSubmissions();
    return json(res, 200, { status: 'success', count: rows.length, data: rows });
  }
  if (req.method === 'POST' && pathname === '/api/v1/contact') {
    readBody(req)
      .then((raw) => {
        const payload = JSON.parse(raw || '{}');
        const errors = validateContactPayload(payload);
        if (errors.length > 0) {
          return json(res, 400, { status: 'error', errors });
        }

        const created = service.addContactSubmission({
          fullName: payload.fullName.trim(),
          email: payload.email.trim().toLowerCase(),
          subject: payload.subject.trim(),
          message: payload.message.trim()
        });

        return json(res, 201, {
          status: 'success',
          message: 'Contact request submitted successfully.',
          data: created
        });
      })
      .catch((error) => {
        if (error.message === 'Payload too large') {
          return json(res, 413, { status: 'error', message: error.message });
        }
        return json(res, 400, { status: 'error', message: 'Malformed JSON payload.' });
      });
    return;
  }

  json(res, 404, { status: 'error', message: `Route ${pathname} not found.` });
}

function handleWeb(req, res, pathname) {
  const routeMap = {
    '/': 'index.html',
    '/admissions': 'admissions.html',
    '/departments': 'departments.html',
    '/research': 'research.html',
    '/student-life': 'student-life.html',
    '/contact': 'contact.html',
    '/security-training': 'security-training.html'
  };

  if (pathname.startsWith('/css/')) return serveStatic(res, pathname);
  if (pathname.startsWith('/js/')) return serveStatic(res, pathname);

  const pageFile = routeMap[pathname];
  if (pageFile) return serveStatic(res, pageFile);

  text(res, 404, 'Not found');
}

function createServer() {
  return http.createServer((req, res) => {
    const requestUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = requestUrl.pathname;

    if (pathname.startsWith('/api/v1/')) {
      return handleApi(req, res, pathname);
    }

    return handleWeb(req, res, pathname);
  });
}

if (require.main === module) {
  const PORT = Number(process.env.PORT || 3000);
  createServer().listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`University web server running on http://localhost:${PORT}`);
  });
}

module.exports = {
  createServer
};
