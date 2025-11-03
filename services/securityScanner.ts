import axios from 'axios'
import type { ScanResult } from '~/stores/scan'

export interface SecurityCheckResponse {
  url: string
  results: ScanResult[]
  scanDuration: number
}

export async function scanWebsite(url: string): Promise<SecurityCheckResponse> {
  const startTime = Date.now()
  const results: ScanResult[] = []
  
  try {
    // Prepare the URL
    const targetUrl = url.startsWith('http') ? url : `https://${url}`
    
    // Use our server-side proxy to avoid CORS issues
    const response = await axios.get(`/api/proxy`, {
      params: {
        url: targetUrl
      }
    })
    
    // Check if the proxy returned an error
    if (response.data.error) {
      // If proxy failed, report connection error and stop
      results.push({
        name: 'Connection Error',
        severity: 'high',
        recommendation: `Could not connect: ${response.data.error}`
      })
      const scanDuration = (Date.now() - startTime) / 1000
      return {
        url,
        results,
        scanDuration
      }
    }
    
    // Extract the actual response data from our proxy response
    const proxyResponse = {
      data: response.data.data,
      headers: response.data.headers,
      status: response.data.status
    }
    
    // Debug log to check what headers we're receiving
    console.log('DEBUG - Received headers from proxy:', JSON.stringify(proxyResponse.headers, null, 2))

    // Check if response status indicates an error
    if (proxyResponse.status < 200 || proxyResponse.status >= 400) {
      results.push({
        name: 'HTTP Error',
        severity: 'high',
        recommendation: `Server returned error status code: ${proxyResponse.status}`
      })
      // Stop processing if there's an HTTP error, no need to check headers
      const scanDuration = (Date.now() - startTime) / 1000
      return {
        url,
        results,
        scanDuration
      }
    }

    // --- Checks for successful responses (status 2xx) ---

    // Convert headers to lowercase for case-insensitive comparison
    const headers = {};
    if (proxyResponse.headers && typeof proxyResponse.headers === 'object') {
      Object.keys(proxyResponse.headers).forEach(key => {
        headers[key.toLowerCase()] = proxyResponse.headers[key];
      });
    }
    // Debug log to check normalized headers
    console.log('DEBUG - Normalized headers:', JSON.stringify(headers, null, 2))

    // Check for HTTPS
    const finalUrl = new URL(targetUrl);
    if (finalUrl.protocol !== 'https:') {
      results.push({
        name: 'Insecure Protocol',
        severity: 'high',
        recommendation: 'Ensure all content is served over HTTPS'
      })
    }

    // Check Content-Security-Policy
    const csp = headers['content-security-policy']
    console.log('DEBUG - CSP header:', csp)
    if (!csp) {
      results.push({
        name: 'Missing Content-Security-Policy',
        severity: 'high',
        recommendation: 'Add Content-Security-Policy header to prevent XSS attacks'
      })
    } else if (!csp.includes("default-src 'self'") && !csp.includes('https:')) {
      results.push({
        name: 'Weak Content-Security-Policy',
        severity: 'high',
        recommendation: 'Configure Content-Security-Policy to restrict sources to self and HTTPS'
      })
    }

    // Check X-XSS-Protection
    const xssProtection = headers['x-xss-protection']
    console.log('DEBUG - X-XSS-Protection header:', xssProtection)
    if (!xssProtection) {
      results.push({
        name: 'Missing X-XSS-Protection',
        severity: 'high',
        recommendation: 'Add X-XSS-Protection header to enable browser XSS filtering'
      })
    } else if (!xssProtection.includes('1; mode=block')) {
      results.push({
        name: 'Weak X-XSS-Protection',
        severity: 'high',
        recommendation: 'Set X-XSS-Protection to "1; mode=block" for better protection'
      })
    }

    // Check X-Content-Type-Options
    const contentTypeOptions = headers['x-content-type-options']
    console.log('DEBUG - X-Content-Type-Options header:', contentTypeOptions)
    if (!contentTypeOptions) {
      results.push({
        name: 'Missing X-Content-Type-Options',
        severity: 'high',
        recommendation: 'Add X-Content-Type-Options: nosniff header to prevent MIME type sniffing'
      })
    } else if (contentTypeOptions.toLowerCase() !== 'nosniff') {
      results.push({
        name: 'Invalid X-Content-Type-Options',
        severity: 'high',
        recommendation: 'Set X-Content-Type-Options to "nosniff"'
      })
    }

    // Check X-Frame-Options
    const frameOptions = headers['x-frame-options']
    console.log('DEBUG - X-Frame-Options header:', frameOptions)
    if (!frameOptions) {
      results.push({
        name: 'Missing X-Frame-Options',
        severity: 'high',
        recommendation: 'Add X-Frame-Options header to prevent clickjacking attacks'
      })
    } else if (!['DENY', 'SAMEORIGIN'].includes(frameOptions.toUpperCase())) {
      results.push({
        name: 'Weak X-Frame-Options',
        severity: 'high',
        recommendation: 'Set X-Frame-Options to DENY or SAMEORIGIN'
      })
    }

    // Check Referrer-Policy
    const referrerPolicy = headers['referrer-policy']
    console.log('DEBUG - Referrer-Policy header:', referrerPolicy)
    if (!referrerPolicy) {
      results.push({
        name: 'Missing Referrer-Policy',
        severity: 'medium',
        recommendation: 'Add Referrer-Policy header to control referrer information leakage'
      })
    } else if (!['no-referrer', 'no-referrer-when-downgrade', 'origin', 'origin-when-cross-origin', 'same-origin', 'strict-origin', 'strict-origin-when-cross-origin'].includes(referrerPolicy.toLowerCase())) {
       results.push({
        name: 'Potentially Weak Referrer-Policy',
        severity: 'low',
        recommendation: 'Consider using a stricter Referrer-Policy like "strict-origin-when-cross-origin" or "no-referrer"'
      })
    }

    // Check Permissions-Policy (formerly Feature-Policy)
    const permissionsPolicy = headers['permissions-policy'] || headers['feature-policy']
    console.log('DEBUG - Permissions-Policy header:', permissionsPolicy)
    if (!permissionsPolicy) {
      results.push({
        name: 'Missing Permissions-Policy',
        severity: 'medium',
        recommendation: 'Add Permissions-Policy header to control browser features access'
      })
    }
    
    // Check Strict-Transport-Security
    const hsts = headers['strict-transport-security']
    console.log('DEBUG - HSTS header:', hsts)
    // Check HSTS regardless of protocol (for testing purposes)
    if (!hsts) {
      results.push({
        name: 'Missing HSTS',
        severity: 'medium',
        recommendation: 'Add Strict-Transport-Security header to enforce HTTPS'
      })
    } else if (!hsts.includes('max-age=') || !hsts.includes('includeSubDomains')) {
      results.push({
        name: 'Weak HSTS Configuration',
        severity: 'medium',
        recommendation: 'Configure HSTS with appropriate max-age and includeSubDomains'
      })
    }
    
    // Check for mixed content in HTML
    if (proxyResponse.headers['content-type']?.includes('text/html') && proxyResponse.data) {
      const htmlContent = typeof proxyResponse.data === 'string' ? proxyResponse.data : JSON.stringify(proxyResponse.data)
      // Check for http:// links or src attributes pointing to http:// regardless of the main page protocol
      if (htmlContent.includes('http://') || htmlContent.match(/src\s*=\s*["']http:\/\//)) {
        results.push({
          name: 'Mixed Content',
          severity: 'high',
          recommendation: 'Ensure all resources are loaded over HTTPS to prevent mixed content issues'
        })
      }
    }

  } catch (error: any) {
    // Handle any unexpected errors during the scan process (e.g., URL parsing, other exceptions)
    console.error('Security Scan Error:', error);
    // Ensure results array is cleared or handled appropriately if needed before adding scan error
    // results.length = 0; // Optional: Clear previous results if a scan error invalidates them
    results.push({
      name: 'Scan Error',
      severity: 'high',
      recommendation: `An unexpected error occurred during the scan: ${error.message || 'Unknown error'}`
    })
  }
  
  const scanDuration = (Date.now() - startTime) / 1000
  
  return {
    url,
    results,
    scanDuration
  }
}