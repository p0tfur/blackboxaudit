# BlackBoxAudit Test Sites

This directory contains test websites designed to verify the functionality of the BlackBoxAudit security scanner. Each test site is configured with specific security settings to validate the scanner's ability to detect various security issues.

## Test Sites

### Test Site 1 (Insecure Configuration)
URL: http://localhost:3001/test1

Purposely configured with security issues to test scanner detection:
- Mixed content (HTTP resources on page)
- Missing security headers:
  - Content-Security-Policy
  - X-Frame-Options
  - X-Content-Type-Options
  - Strict-Transport-Security
  - X-XSS-Protection

Expected Scan Results:
- Should detect missing HTTPS
- Should detect all missing security headers
- Should detect mixed content issues

### Test Site 2 (Secure Configuration)
URL: http://localhost:3001/test2

Implements security best practices:
- All resources loaded over HTTPS
- All security headers properly configured:
  - Content-Security-Policy: default-src 'self' https:; script-src 'self' https:; img-src 'self' https:;
  - X-Frame-Options: DENY
  - X-Content-Type-Options: nosniff
  - Strict-Transport-Security: max-age=31536000; includeSubDomains
  - X-XSS-Protection: 1; mode=block

Expected Scan Results:
- Should report no security issues except for HTTPS (since running locally)
- Should validate all security headers are present and properly configured

## Running the Tests

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start the test server:
   ```bash
   pnpm start
   ```

3. Use the BlackBoxAudit scanner to test both URLs and compare results against the expected outcomes.