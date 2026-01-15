/**
 * Security Headers Middleware
 * Adds comprehensive security headers to all responses
 * Addresses issues from security scanner (CSP, XSS, clickjacking, etc.)
 */
export default defineEventHandler((event) => {
  // Content Security Policy
  // Allows Google Fonts, inline styles for Tailwind/Vue, and self-hosted resources
  setHeader(event, 'Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https:; " +
    "frame-ancestors 'none';"
  );
  
  // XSS Protection (legacy but still useful for older browsers)
  setHeader(event, 'X-XSS-Protection', '1; mode=block');
  
  // Prevent MIME type sniffing
  setHeader(event, 'X-Content-Type-Options', 'nosniff');
  
  // Prevent clickjacking
  setHeader(event, 'X-Frame-Options', 'DENY');
  
  // Cross-Origin policies for better isolation
  setHeader(event, 'Cross-Origin-Opener-Policy', 'same-origin');
  setHeader(event, 'Cross-Origin-Embedder-Policy', 'credentialless');
  setHeader(event, 'Cross-Origin-Resource-Policy', 'same-origin');
  
  // Referrer policy - strict but allows same-origin referrer
  setHeader(event, 'Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Enforce HTTPS (1 year, include subdomains, preload-ready)
  setHeader(event, 'Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  
  // Permissions policy - disable unused features
  setHeader(event, 'Permissions-Policy', 
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );
  
  // Cache control for dynamic pages (not for static assets)
  if (!event.path.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
    setHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate, private');
  }
});
