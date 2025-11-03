const express = require('express');
const path = require('path');
const app = express();

// Test Site 1 - Intentionally missing security headers
app.use('/test1', express.static(path.join(__dirname, 'test1')));

// Test Site 2 - Implementing all security headers
app.use('/test2', (req, res, next) => {
  // Set security headers
  res.setHeader('Content-Security-Policy', "default-src 'self' https:; script-src 'self' https:; img-src 'self' https:;");
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
}, express.static(path.join(__dirname, 'test2')));

// Test Site 3 - Mixed Content HTTP/HTTPS
app.use('/test3', express.static(path.join(__dirname, 'test3')));

// Test Site 4 - Connection Errors & HTTP Status Codes
app.use('/test4', express.static(path.join(__dirname, 'test4')));

// Special routes for Test Site 4 to simulate different HTTP status codes
app.get('/test4/404', (req, res) => {
  res.status(404).send('404 Not Found');
});

app.get('/test4/500', (req, res) => {
  res.status(500).send('500 Internal Server Error');
});

app.get('/test4/403', (req, res) => {
  res.status(403).send('403 Forbidden');
});

app.get('/test4/401', (req, res) => {
  res.status(401).send('401 Unauthorized');
});

app.get('/test4/301', (req, res) => {
  res.redirect(301, '/test4');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Test sites server running on http://localhost:${PORT}`);
  console.log(`Test Site 1 (Insecure): http://localhost:${PORT}/test1`);
  console.log(`Test Site 2 (Secure): http://localhost:${PORT}/test2`);
  console.log(`Test Site 3 (Mixed Content): http://localhost:${PORT}/test3`);
  console.log(`Test Site 4 (Connection Errors): http://localhost:${PORT}/test4`);
});