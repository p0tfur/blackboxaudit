import axios from "axios";
import type { ScanResult } from "~/stores/scan";

export interface SecurityCheckResponse {
  url: string;
  results: ScanResult[];
  scanDuration: number;
}

const addResult = (results: ScanResult[], payload: ScanResult) => {
  results.push(payload);
};

export async function scanWebsite(url: string): Promise<SecurityCheckResponse> {
  const startTime = Date.now();
  const results: ScanResult[] = [];

  try {
    // Prepare the URL
    const rawUrl = url.startsWith("http") ? url : `https://${url}`;
    const normalizedUrl = (() => {
      try {
        const parsed = new URL(rawUrl);
        if (!parsed.pathname.includes(".") && !parsed.pathname.endsWith("/")) {
          parsed.pathname = `${parsed.pathname}/`;
        }
        return parsed.toString();
      } catch (error) {
        return rawUrl;
      }
    })();

    // Use our server-side proxy to avoid CORS issues
    const response = await axios.get(`/api/proxy`, {
      params: {
        url: normalizedUrl,
      },
    });

    // Check if the proxy returned an error
    if (response.data.error) {
      // If proxy failed, report connection error and stop
      addResult(results, {
        name: "Connection Error",
        severity: "high",
        recommendation: `Could not connect: ${response.data.error}`,
        category: "transport",
      });

      const scanDuration = (Date.now() - startTime) / 1000;
      return {
        url: normalizedUrl,
        results,
        scanDuration,
      };
    }

    // Extract the actual response data from our proxy response
    const proxyResponse = {
      data: response.data.data,
      headers: response.data.headers,
      status: response.data.status,
    };

    // Check if response status indicates an error
    if (proxyResponse.status < 200 || proxyResponse.status >= 400) {
      addResult(results, {
        name: "HTTP Error",
        severity: "high",
        recommendation: `Server returned error status code: ${proxyResponse.status}`,
        category: "transport",
      });

      // Stop processing if there's an HTTP error, no need to check headers
      const scanDuration = (Date.now() - startTime) / 1000;
      return {
        url,
        results,
        scanDuration,
      };
    }

    // --- Checks for successful responses (status 2xx) ---

    // Convert headers to lowercase for case-insensitive comparison
    const headers: Record<string, string | string[]> = {};
    if (proxyResponse.headers && typeof proxyResponse.headers === "object") {
      Object.keys(proxyResponse.headers).forEach((key) => {
        headers[key.toLowerCase()] = proxyResponse.headers[key];
      });
    }

    const getHeaderValue = (name: string): string | null => {
      const value = headers[name];
      if (!value) {
        return null;
      }
      return Array.isArray(value) ? value.join(", ") : value;
    };

    // Check for HTTPS
    const finalUrl = new URL(normalizedUrl);
    if (finalUrl.protocol !== "https:") {
      addResult(results, {
        name: "Insecure Protocol",
        severity: "high",
        recommendation: "Ensure all content is served over HTTPS",
        category: "transport",
      });
    }

    // Check Content-Security-Policy
    const csp = getHeaderValue("content-security-policy");
    if (!csp) {
      addResult(results, {
        name: "Missing Content-Security-Policy",
        severity: "high",
        recommendation: "Add Content-Security-Policy header to prevent XSS attacks",
        category: "headers",
      });
    } else if (!csp.includes("default-src 'self'") && !csp.includes("https:")) {
      addResult(results, {
        name: "Weak Content-Security-Policy",
        severity: "high",
        recommendation: "Configure Content-Security-Policy to restrict sources to self and HTTPS",
        category: "headers",
      });
    }

    // Check X-XSS-Protection
    const xssProtection = getHeaderValue("x-xss-protection");
    if (!xssProtection) {
      addResult(results, {
        name: "Missing X-XSS-Protection",
        severity: "high",
        recommendation: "Add X-XSS-Protection header to enable browser XSS filtering",
        category: "headers",
      });
    } else if (!xssProtection.includes("1; mode=block")) {
      addResult(results, {
        name: "Weak X-XSS-Protection",
        severity: "high",
        recommendation: 'Set X-XSS-Protection to "1; mode=block" for better protection',
        category: "headers",
      });
    }

    // Check X-Content-Type-Options
    const contentTypeOptions = getHeaderValue("x-content-type-options");
    if (!contentTypeOptions) {
      addResult(results, {
        name: "Missing X-Content-Type-Options",
        severity: "high",
        recommendation: "Add X-Content-Type-Options: nosniff header to prevent MIME type sniffing",
        category: "headers",
      });
    } else if (contentTypeOptions.toLowerCase() !== "nosniff") {
      addResult(results, {
        name: "Invalid X-Content-Type-Options",
        severity: "high",
        recommendation: 'Set X-Content-Type-Options to "nosniff"',
        category: "headers",
      });
    }

    // Check X-Frame-Options
    const frameOptions = getHeaderValue("x-frame-options");
    if (!frameOptions) {
      addResult(results, {
        name: "Missing X-Frame-Options",
        severity: "high",
        recommendation: "Add X-Frame-Options header to prevent clickjacking attacks",
        category: "headers",
      });
    } else if (!["DENY", "SAMEORIGIN"].includes(frameOptions.toUpperCase())) {
      addResult(results, {
        name: "Weak X-Frame-Options",
        severity: "high",
        recommendation: "Set X-Frame-Options to DENY or SAMEORIGIN",
        category: "headers",
      });
    }

    // Check Referrer-Policy
    const referrerPolicy = getHeaderValue("referrer-policy");
    if (!referrerPolicy) {
      addResult(results, {
        name: "Missing Referrer-Policy",
        severity: "medium",
        recommendation: "Add Referrer-Policy header to control referrer information leakage",
        category: "headers",
      });
    } else if (
      ![
        "no-referrer",
        "no-referrer-when-downgrade",
        "origin",
        "origin-when-cross-origin",
        "same-origin",
        "strict-origin",
        "strict-origin-when-cross-origin",
      ].includes(referrerPolicy.toLowerCase())
    ) {
      addResult(results, {
        name: "Potentially Weak Referrer-Policy",
        severity: "low",
        recommendation:
          'Consider using a stricter Referrer-Policy like "strict-origin-when-cross-origin" or "no-referrer"',
        category: "headers",
      });
    }

    // Check Permissions-Policy (formerly Feature-Policy)
    const permissionsPolicy = getHeaderValue("permissions-policy") || getHeaderValue("feature-policy");
    if (!permissionsPolicy) {
      addResult(results, {
        name: "Missing Permissions-Policy",
        severity: "medium",
        recommendation: "Add Permissions-Policy header to control browser features access",
        category: "headers",
      });
    }

    // Check Strict-Transport-Security
    const hsts = getHeaderValue("strict-transport-security");
    // Check HSTS regardless of protocol (for testing purposes)
    if (!hsts) {
      addResult(results, {
        name: "Missing HSTS",
        severity: "medium",
        recommendation: "Add Strict-Transport-Security header to enforce HTTPS",
        category: "transport",
      });
    } else if (!hsts.includes("max-age=") || !hsts.includes("includeSubDomains")) {
      addResult(results, {
        name: "Weak HSTS Configuration",
        severity: "medium",
        recommendation: "Configure HSTS with appropriate max-age and includeSubDomains",
        category: "transport",
      });
    }

    // Cache-Control / Pragma
    const cacheControl = getHeaderValue("cache-control");
    const pragma = getHeaderValue("pragma");
    if (!cacheControl || !/no-cache|no-store|private/i.test(cacheControl)) {
      addResult(results, {
        name: "Missing Cache-Control restrictions",
        severity: "medium",
        recommendation: "Add Cache-Control: no-store, no-cache headers for sensitive responses",
        category: "headers",
      });
    } else if (/public/i.test(cacheControl) || /max-age=\d{4,}/i.test(cacheControl)) {
      addResult(results, {
        name: "Long-lived Cache-Control",
        severity: "low",
        recommendation: "Avoid long-lived caching for security-sensitive pages",
        category: "headers",
      });
    }

    if (pragma && !/no-cache/i.test(pragma)) {
      addResult(results, {
        name: "Weak Pragma header",
        severity: "low",
        recommendation: "Set Pragma: no-cache for older browsers",
        category: "headers",
      });
    }

    // Cookie validation (Secure, HttpOnly, SameSite)
    const cookieHeaders = headers["set-cookie"];
    const cookies = Array.isArray(cookieHeaders) ? cookieHeaders : cookieHeaders ? [cookieHeaders] : [];

    cookies.forEach((rawCookie) => {
      const normalized = rawCookie.toLowerCase();
      const cookieName = rawCookie.split("=")[0];
      const recommendations: string[] = [];
      let severity: ScanResult["severity"] = "medium";

      if (!normalized.includes("secure")) {
        recommendations.push("Add Secure flag to cookies to prevent transmission over HTTP");
        severity = "high";
      }
      if (!normalized.includes("httponly")) {
        recommendations.push("Add HttpOnly flag to protect against XSS stealing cookies");
      }
      if (!normalized.includes("samesite")) {
        recommendations.push("Specify SameSite (Strict/Lax) to mitigate CSRF");
      }

      if (recommendations.length > 0) {
        addResult(results, {
          name: `Cookie ${cookieName} missing security flags`,
          severity,
          recommendation: recommendations.join(". "),
          category: "cookies",
        });
      }
    });

    // Check for mixed content in HTML
    if (proxyResponse.headers["content-type"]?.includes("text/html") && proxyResponse.data) {
      const htmlContent =
        typeof proxyResponse.data === "string" ? proxyResponse.data : JSON.stringify(proxyResponse.data);
      // Check for http:// links or src attributes pointing to http:// regardless of the main page protocol
      const hasMixedContent = /<[^>]+(src|href)\s*=\s*["']http:\/\//i.test(htmlContent);
      if (hasMixedContent) {
        addResult(results, {
          name: "Mixed Content",
          severity: "high",
          recommendation: "Ensure all resources are loaded over HTTPS to prevent mixed content issues",
          category: "content",
        });
      }

      if (typeof DOMParser !== "undefined") {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, "text/html");

        const inlineScripts = Array.from(doc.querySelectorAll("script:not([src])")).filter((script) =>
          script.textContent?.trim()
        );
        if (inlineScripts.length > 0) {
          addResult(results, {
            name: "Inline Scripts Detected",
            severity: "medium",
            recommendation: "Move inline scripts to external files and enable CSP with nonce/hash to reduce XSS risk",
            category: "content",
          });
        }

        const forms = Array.from(doc.querySelectorAll("form"));
        const insecureForms = forms.filter((form) => (form.getAttribute("method") || "get").toLowerCase() !== "post");
        if (insecureForms.length > 0) {
          addResult(results, {
            name: "Insecure Form Methods",
            severity: "medium",
            recommendation: 'Use method="POST" for forms handling sensitive data to prevent logging query parameters',
            category: "forms",
          });
        }

        const passwordInputs = Array.from(doc.querySelectorAll('input[type="password"]'));
        const missingAutocomplete = passwordInputs.filter(
          (input) =>
            input.getAttribute("autocomplete") !== "off" && input.getAttribute("autocomplete") !== "new-password"
        );
        if (missingAutocomplete.length > 0) {
          addResult(results, {
            name: "Password fields missing autocomplete=off",
            severity: "low",
            recommendation: "Disable autocomplete for password fields to prevent storing credentials in the browser",
            category: "forms",
          });
        }
      }
    }
  } catch (error: any) {
    // Handle any unexpected errors during the scan process (e.g., URL parsing, other exceptions)
    console.error("Security Scan Error:", error);

    // Ensure results array is cleared or handled appropriately if needed before adding scan error
    // results.length = 0; // Optional: Clear previous results if a scan error invalidates them
    addResult(results, {
      name: "Scan Error",
      severity: "high",
      recommendation: `An unexpected error occurred during the scan: ${error.message || "Unknown error"}`,
      category: "other",
    });
  }

  const scanDuration = (Date.now() - startTime) / 1000;

  return {
    url,
    results,
    scanDuration,
  };
}
