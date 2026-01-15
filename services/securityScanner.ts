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

interface PageData {
  url: string;
  data: any;
  headers: Record<string, string | string[]>;
  status: number;
}

const analyzePage = (page: PageData, results: ScanResult[], normalizedUrl: string) => {
  const headers: Record<string, string | string[]> = {};
  Object.keys(page.headers).forEach((key) => {
    headers[key.toLowerCase()] = page.headers[key];
  });

  const getHeaderValue = (name: string): string | null => {
    const value = headers[name];
    if (!value) return null;
    return Array.isArray(value) ? value.join(", ") : value;
  };

  // --- Header Checks ---
  const csp = getHeaderValue("content-security-policy");
  if (!csp) {
    addResult(results, {
      name: `Missing CSP on ${page.url}`,
      severity: "high",
      recommendation: "Add Content-Security-Policy header to prevent XSS attacks",
      category: "headers",
    });
  } else if (!csp.includes("default-src 'self'") && !csp.includes("https:")) {
    addResult(results, {
      name: `Weak CSP on ${page.url}`,
      severity: "high",
      recommendation: "Configure Content-Security-Policy to restrict sources to self and HTTPS",
      category: "headers",
    });
  }

  const xssProtection = getHeaderValue("x-xss-protection");
  if (!xssProtection && !csp) {
    addResult(results, {
      name: `Missing X-XSS-Protection on ${page.url}`,
      severity: "high",
      recommendation: "Add X-XSS-Protection header to enable browser XSS filtering",
      category: "headers",
    });
  } else if (xssProtection && !xssProtection.includes("1; mode=block")) {
    addResult(results, {
      name: `Weak X-XSS-Protection on ${page.url}`,
      severity: "high",
      recommendation: 'Set X-XSS-Protection to "1; mode=block" for better protection',
      category: "headers",
    });
  }

  const contentTypeOptions = getHeaderValue("x-content-type-options");
  if (!contentTypeOptions) {
    addResult(results, {
      name: `Missing X-Content-Type-Options on ${page.url}`,
      severity: "high",
      recommendation: "Add X-Content-Type-Options: nosniff header to prevent MIME type sniffing",
      category: "headers",
    });
  } else if (contentTypeOptions.toLowerCase() !== "nosniff") {
    addResult(results, {
      name: `Invalid X-Content-Type-Options on ${page.url}`,
      severity: "high",
      recommendation: 'Set X-Content-Type-Options to "nosniff"',
      category: "headers",
    });
  }

  const frameOptions = getHeaderValue("x-frame-options");
  if (!frameOptions) {
    addResult(results, {
      name: `Missing X-Frame-Options on ${page.url}`,
      severity: "high",
      recommendation: "Add X-Frame-Options header to prevent clickjacking attacks",
      category: "headers",
    });
  } else if (!["DENY", "SAMEORIGIN"].includes(frameOptions.toUpperCase())) {
    addResult(results, {
      name: `Weak X-Frame-Options on ${page.url}`,
      severity: "high",
      recommendation: "Set X-Frame-Options to DENY or SAMEORIGIN",
      category: "headers",
    });
  }

  const allowOrigin = getHeaderValue("access-control-allow-origin");
  const allowCredentials = getHeaderValue("access-control-allow-credentials");
  if (allowOrigin === "*" && allowCredentials === "true") {
    addResult(results, {
      name: `Insecure CORS Configuration on ${page.url}`,
      severity: "high",
      recommendation: "CORS allows wildcard origin with credentials. This is insecure. Specify allowed origins.",
      category: "headers",
    });
  }

  const coop = getHeaderValue("cross-origin-opener-policy");
  if (!coop) {
    addResult(results, {
      name: `Missing COOP Header on ${page.url}`,
      severity: "low",
      recommendation: "Consider adding Cross-Origin-Opener-Policy to isolate your browsing context.",
      category: "headers",
    });
  }

  const coep = getHeaderValue("cross-origin-embedder-policy");
  if (!coep) {
    addResult(results, {
      name: `Missing COEP Header on ${page.url}`,
      severity: "low",
      recommendation: "Consider adding Cross-Origin-Embedder-Policy for better isolation.",
      category: "headers",
    });
  }

  const corp = getHeaderValue("cross-origin-resource-policy");
  if (!corp) {
    addResult(results, {
      name: `Missing CORP Header on ${page.url}`,
      severity: "low",
      recommendation:
        "Consider adding Cross-Origin-Resource-Policy to control how resources can be embedded cross-origin.",
      category: "headers",
    });
  }

  const referrerPolicy = getHeaderValue("referrer-policy");
  if (!referrerPolicy) {
    addResult(results, {
      name: `Missing Referrer-Policy on ${page.url}`,
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
      name: `Potentially Weak Referrer-Policy on ${page.url}`,
      severity: "low",
      recommendation:
        'Consider using a stricter Referrer-Policy like "strict-origin-when-cross-origin" or "no-referrer"',
      category: "headers",
    });
  }

  const hsts = getHeaderValue("strict-transport-security");
  if (!hsts) {
    addResult(results, {
      name: `Missing HSTS on ${page.url}`,
      severity: "medium",
      recommendation: "Add Strict-Transport-Security header to enforce HTTPS",
      category: "transport",
    });
  } else if (!hsts.includes("max-age=") || !hsts.includes("includeSubDomains")) {
    addResult(results, {
      name: `Weak HSTS Configuration on ${page.url}`,
      severity: "medium",
      recommendation: "Configure HSTS with appropriate max-age and includeSubDomains",
      category: "transport",
    });
  }

  const permissionsPolicy = getHeaderValue("permissions-policy") || getHeaderValue("feature-policy");
  if (!permissionsPolicy) {
    addResult(results, {
      name: `Missing Permissions-Policy on ${page.url}`,
      severity: "medium",
      recommendation: "Add Permissions-Policy header to control browser features access",
      category: "headers",
    });
  }

  const cacheControl = getHeaderValue("cache-control");
  const pragma = getHeaderValue("pragma");
  if (!cacheControl || !/no-cache|no-store|private/i.test(cacheControl)) {
    addResult(results, {
      name: `Missing Cache-Control restrictions on ${page.url}`,
      severity: "medium",
      recommendation: "Add Cache-Control: no-store, no-cache headers for sensitive responses",
      category: "headers",
    });
  } else if (/public/i.test(cacheControl) || /max-age=\d{4,}/i.test(cacheControl)) {
    addResult(results, {
      name: `Long-lived Cache-Control on ${page.url}`,
      severity: "low",
      recommendation: "Avoid long-lived caching for security-sensitive pages",
      category: "headers",
    });
  }

  if (pragma && !/no-cache/i.test(pragma)) {
    addResult(results, {
      name: `Weak Pragma header on ${page.url}`,
      severity: "low",
      recommendation: "Set Pragma: no-cache for older browsers",
      category: "headers",
    });
  }

  const cookieHeaders = page.headers["set-cookie"];
  const cookies = Array.isArray(cookieHeaders) ? cookieHeaders : cookieHeaders ? [cookieHeaders] : [];
  cookies.forEach((rawCookie) => {
    const normalized = rawCookie.toLowerCase();
    const cookieName = rawCookie.split("=")[0];
    const cookieRecs: string[] = [];
    if (!normalized.includes("secure")) cookieRecs.push("Add Secure flag");
    if (!normalized.includes("httponly")) cookieRecs.push("Add HttpOnly flag");
    if (!normalized.includes("samesite")) cookieRecs.push("Specify SameSite (Strict/Lax)");

    if (cookieRecs.length > 0) {
      addResult(results, {
        name: `Cookie ${cookieName} missing security flags on ${page.url}`,
        severity: "medium",
        recommendation: cookieRecs.join(". "),
        category: "cookies",
      });
    }
  });

  const server = getHeaderValue("server");
  if (server) {
    addResult(results, {
      name: `Server Header Exposed on ${page.url}`,
      severity: "low",
      recommendation: `Server header reveals technology: ${server}. Consider hiding it.`,
      category: "information",
    });
  }

  const poweredBy = getHeaderValue("x-powered-by");
  if (poweredBy) {
    addResult(results, {
      name: `X-Powered-By Header Exposed on ${page.url}`,
      severity: "low",
      recommendation: `X-Powered-By header reveals technology: ${poweredBy}. Remove it.`,
      category: "information",
    });
  }

  const aspNetVersion = getHeaderValue("x-aspnet-version");
  if (aspNetVersion) {
    addResult(results, {
      name: `X-AspNet-Version Header Exposed on ${page.url}`,
      severity: "low",
      recommendation: `X-AspNet-Version reveals technology/version: ${aspNetVersion}. Consider removing it.`,
      category: "information",
    });
  }

  const headerGenerator = getHeaderValue("x-generator");
  if (headerGenerator) {
    addResult(results, {
      name: `X-Generator Header Exposed on ${page.url}`,
      severity: "low",
      recommendation: `X-Generator header reveals technology: ${headerGenerator}. Consider removing it.`,
      category: "information",
    });
  }

  if (headers["content-type"]?.includes("text/html") && page.data) {
    const htmlContent = typeof page.data === "string" ? page.data : JSON.stringify(page.data);
    const hasMixedContent = /<[^>]+(src|href)\s*=\s*["']http:\/\//i.test(htmlContent);
    if (hasMixedContent) {
      addResult(results, {
        name: `Mixed Content on ${page.url}`,
        severity: "high",
        recommendation: "Ensure all resources are loaded over HTTPS",
        category: "content",
      });
    }

    if (typeof DOMParser !== "undefined") {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, "text/html");

      const forms = Array.from(doc.querySelectorAll("form"));
      forms.forEach((form, idx) => {
        const method = (form.getAttribute("method") || "get").toLowerCase();
        const action = form.getAttribute("action") || "";

        if (method !== "post") {
          const hasSensitiveInputs = !!form.querySelector(
            'input[type="password"], input[type="email"], input[name*="pass" i]'
          );
          addResult(results, {
            name: `Potentially Insecure Form Method on ${page.url} (Form #${idx + 1})`,
            severity: hasSensitiveInputs ? "medium" : "low",
            recommendation:
              'Consider using method="POST" for forms handling sensitive data to avoid leaking values via URL/query logs.',
            category: "forms",
          });
        }

        if (method === "post") {
          const hasToken = !!form.querySelector(
            'input[name*="csrf" i], input[name*="token" i], input[name*="authenticity" i]'
          );
          if (!hasToken) {
            addResult(results, {
              name: `Potential Missing CSRF Protection on ${page.url} (Form #${idx + 1})`,
              severity: "high",
              recommendation: "Ensure all POST forms have CSRF tokens",
              category: "forms",
            });
          }
        }

        if (action.startsWith("http://")) {
          addResult(results, {
            name: `Insecure Form Action on ${page.url} (Form #${idx + 1})`,
            severity: "high",
            recommendation: "Ensure form actions use HTTPS",
            category: "forms",
          });
        }
      });

      const inlineScripts = Array.from(doc.querySelectorAll("script:not([src])")).filter((script) =>
        script.textContent?.trim()
      );
      if (inlineScripts.length > 0) {
        addResult(results, {
          name: `Inline Scripts Detected on ${page.url}`,
          severity: "medium",
          recommendation: "Move inline scripts to external files and enable CSP with nonce/hash",
          category: "content",
        });
      }

      const passwordInputs = Array.from(doc.querySelectorAll('input[type="password"]'));
      const missingAutocomplete = passwordInputs.filter(
        (input) => input.getAttribute("autocomplete") !== "off" && input.getAttribute("autocomplete") !== "new-password"
      );
      if (missingAutocomplete.length > 0) {
        addResult(results, {
          name: `Password fields missing autocomplete=off on ${page.url}`,
          severity: "low",
          recommendation: "Disable autocomplete for password fields to prevent storing credentials",
          category: "forms",
        });
      }

      const externalScripts = Array.from(doc.querySelectorAll("script[src]")).filter((script) => {
        const src = script.getAttribute("src") || "";
        return src.startsWith("http") || src.startsWith("//");
      });
      const missingSRI = externalScripts.filter((script) => !script.hasAttribute("integrity"));
      if (missingSRI.length > 0) {
        addResult(results, {
          name: `Missing SRI on ${page.url}`,
          severity: "medium",
          recommendation: "Add integrity attributes to external scripts to prevent supply chain attacks",
          category: "third-party",
        });
      }

      const externalLinks = Array.from(doc.querySelectorAll("link[href]"))
        .map((link) => {
          const href = link.getAttribute("href") || "";
          const rel = (link.getAttribute("rel") || "").toLowerCase();
          return { link, href, rel };
        })
        .filter(({ href }) => href.startsWith("http") || href.startsWith("//"));

      const sriRelevantLinks = externalLinks.filter(({ rel }) => rel.includes("stylesheet"));
      const missingSRILinks = sriRelevantLinks.filter(({ link }) => !link.hasAttribute("integrity"));
      if (missingSRILinks.length > 0) {
        addResult(results, {
          name: `Missing SRI on external stylesheets on ${page.url}`,
          severity: "low",
          recommendation: "Add integrity attributes to external stylesheet links to reduce supply chain risk",
          category: "third-party",
        });
      }

      const generator = doc.querySelector('meta[name="generator"]');
      if (generator) {
        addResult(results, {
          name: `Generator Meta Tag Exposed on ${page.url}`,
          severity: "low",
          recommendation: `Technology revealed: ${generator.getAttribute("content")}. Remove it.`,
          category: "information",
        });
      }

      if (/\/(wp-content|wp-includes)\//i.test(htmlContent)) {
        addResult(results, {
          name: `Potential WordPress Footprint Detected on ${page.url}`,
          severity: "low",
          recommendation:
            "The HTML contains WordPress-specific paths (wp-content/wp-includes). Ensure WordPress core/themes/plugins are kept up to date.",
          category: "information",
        });
      }

      const iterator = doc.createNodeIterator(doc.documentElement, NodeFilter.SHOW_COMMENT);
      let currentNode;
      let sensitiveCommentsFound = 0;
      while ((currentNode = iterator.nextNode())) {
        const content = currentNode.textContent?.toLowerCase() || "";
        if (["todo", "fixme", "admin", "password", "test", "internal"].some((kw) => content.includes(kw))) {
          sensitiveCommentsFound++;
        }
      }
      if (sensitiveCommentsFound > 0) {
        addResult(results, {
          name: `Sensitive HTML Comments on ${page.url}`,
          severity: "medium",
          recommendation: `Found ${sensitiveCommentsFound} comments with sensitive keywords. Remove them.`,
          category: "information",
        });
      }

      const scripts = Array.from(doc.querySelectorAll("script[src]"));
      const domains = new Set<string>();
      scripts.forEach((s) => {
        try {
          const src = s.getAttribute("src");
          if (src) {
            const domain = new URL(src, page.url).hostname;
            if (domain && domain !== new URL(page.url).hostname) {
              domains.add(domain);
            }
          }
        } catch (e) {}
      });

      if (domains.size > 5) {
        addResult(results, {
          name: `High Number of Third-party Scripts on ${page.url}`,
          severity: "low",
          recommendation: `Found scripts from ${domains.size} different external domains. High reliance on third parties increases supply chain risk.`,
          category: "third-party",
        });
      }
    }
  }
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
    const pageData: PageData = {
      url: normalizedUrl,
      data: proxyResponse.data,
      headers: proxyResponse.headers,
      status: proxyResponse.status,
    };

    analyzePage(pageData, results, normalizedUrl);

    // --- Phase 4b: SSL/TLS Certificate Check ---
    if (response.data.cert) {
      const cert = response.data.cert;
      const expiryDate = new Date(cert.valid_to);
      const now = new Date();
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      if (cert.authorized === false) {
        addResult(results, {
          name: "SSL Certificate Not Trusted",
          severity: "high",
          recommendation: `The SSL certificate is not trusted by the client (error: ${
            cert.authorizationError || "unknown"
          }). This may indicate a self-signed, expired, or misconfigured certificate chain.`,
          category: "transport",
        });
      }

      if (daysUntilExpiry < 0) {
        addResult(results, {
          name: "SSL Certificate Expired",
          severity: "high",
          recommendation: `The SSL certificate for this site expired on ${expiryDate.toLocaleDateString()}. Renew it immediately.`,
          category: "transport",
        });
      } else if (daysUntilExpiry < 30) {
        addResult(results, {
          name: "SSL Certificate Expiring Soon",
          severity: "medium",
          recommendation: `The SSL certificate will expire in ${daysUntilExpiry} days (${expiryDate.toLocaleDateString()}). Plan for renewal soon.`,
          category: "transport",
        });
      } else {
        addResult(results, {
          name: "SSL Certificate Valid",
          severity: "low",
          recommendation: `Certificate is valid until ${expiryDate.toLocaleDateString()} (Issuer: ${cert.issuer}).`,
          category: "transport",
        });
      }
    }

    // --- Phase 2: Shallow Crawler ---
    const baseUrl = new URL(normalizedUrl).origin;
    const visitedUrls = new Set<string>([normalizedUrl]);
    const urlsToVisit: string[] = [];

    // Extract links for crawling
    if (pageData.headers["content-type"]?.includes("text/html") && pageData.data) {
      if (typeof DOMParser !== "undefined") {
        const parser = new DOMParser();
        const doc = parser.parseFromString(pageData.data, "text/html");
        const links = Array.from(doc.querySelectorAll("a[href]"));

        for (const link of links) {
          try {
            const href = link.getAttribute("href");
            if (!href) continue;
            const fullUrl = new URL(href, normalizedUrl).toString();
            const parsedFull = new URL(fullUrl);

            // Only same origin, limit depth by not adding too many, and avoid duplicates
            if (parsedFull.origin === baseUrl && !visitedUrls.has(fullUrl) && urlsToVisit.length < 5) {
              urlsToVisit.push(fullUrl);
            }
          } catch (e) {
            /* ignore invalid URLs */
          }
        }
      }
    }

    // Crawl subpages (limited to 5 for now)
    for (const subUrl of urlsToVisit) {
      if (visitedUrls.size >= 10) break;
      try {
        const subRes = await axios.get(`/api/proxy`, { params: { url: subUrl } });
        if (subRes.data.status === 200) {
          visitedUrls.add(subUrl);
          analyzePage(
            {
              url: subUrl,
              data: subRes.data.data,
              headers: subRes.data.headers,
              status: subRes.data.status,
            },
            results,
            normalizedUrl
          );
        }
      } catch (e) {
        /* ignore subpage errors */
      }
    }

    // --- Global Checks (robots.txt, security.txt, 404) ---
    // Check robots.txt
    try {
      const robotsRes = await axios.get(`/api/proxy`, {
        params: { url: `${baseUrl}/robots.txt` },
      });
      if (robotsRes.data.status === 200 && robotsRes.data.data) {
        addResult(results, {
          name: "Robots.txt Found",
          severity: "low",
          recommendation: "Review robots.txt for sensitive paths that shouldn't be indexed",
          category: "information",
        });
      }
    } catch (e) {
      /* ignore */
    }

    // Check security.txt
    try {
      const securityRes = await axios.get(`/api/proxy`, {
        params: { url: `${baseUrl}/.well-known/security.txt` },
      });
      if (securityRes.data.status === 200 && securityRes.data.data) {
        addResult(results, {
          name: "Security.txt Found",
          severity: "low",
          recommendation: "Excellent! The site follows RFC 9116 for security contact information",
          category: "information",
        });
      }
    } catch (e) {
      /* ignore */
    }

    // Check 404
    try {
      const nonExistentUrl = `${baseUrl}/non-existent-${Math.random().toString(36).substring(7)}`;
      const errorPageRes = await axios.get(`/api/proxy`, { params: { url: nonExistentUrl } });
      if (errorPageRes.data.status === 200) {
        addResult(results, {
          name: "Soft 404 Detected",
          severity: "low",
          recommendation: "The server returns status 200 for non-existent pages. Configure proper 404 error codes.",
          category: "other",
        });
      }

      const errorBody = String(errorPageRes.data.data || "").toLowerCase();
      const hasVerboseError =
        /exception|stack trace|stacktrace|traceback|fatal error|warning:|notice:|undefined variable|you have an error in your sql syntax/i.test(
          errorBody
        ) ||
        /whitelabel error page|server error in '\/' application|runtime error|yellow screen of death/i.test(errorBody);

      if (hasVerboseError) {
        addResult(results, {
          name: "Verbose Error Page Detected",
          severity: "high",
          recommendation:
            "The application appears to expose verbose error details on invalid routes. Disable debug mode and configure generic error pages.",
          category: "information",
        });
      }
    } catch (e) {
      /* ignore */
    }

    // --- Phase 3a: Active Probing (Sensitive Files) ---
    const sensitivePaths = [
      "/.env",
      "/.git/config",
      "/.svn/entries",
      "/.gitignore",
      "/web.config",
      "/phpinfo.php",
      "/config.json",
      "/backup.sql",
      "/dump.sql",
    ];

    await Promise.all(
      sensitivePaths.map(async (path) => {
        try {
          const probeUrl = `${baseUrl}${path}`;
          const probeRes = await axios.get(`/api/proxy`, { params: { url: probeUrl } });
          if (probeRes.data.status === 200 && probeRes.data.data) {
            const data = String(probeRes.data.data).toLowerCase();
            if (
              !data.includes("<html") ||
              data.includes("env_file") ||
              data.includes("[core]") ||
              data.includes("phpinfo")
            ) {
              addResult(results, {
                name: `Sensitive File Exposed: ${path}`,
                severity: "high",
                recommendation: `The file ${path} is publicly accessible. Restrict access immediately.`,
                category: "information",
              });
            }
          }
        } catch (e) {
          /* ignore */
        }
      })
    );
    // --- Phase 4a: DNS & Email Security (SPF/DMARC) ---
    const domain = new URL(normalizedUrl).hostname;
    try {
      // Check SPF
      const spfRes = await axios.get(`https://cloudflare-dns.com/dns-query`, {
        params: { name: domain, type: "TXT" },
        headers: { accept: "application/dns-json" },
      });
      const spfRecords = spfRes.data.Answer?.filter((a: any) => a.data.includes("v=spf1")) || [];
      if (spfRecords.length === 0) {
        addResult(results, {
          name: "Missing SPF Record",
          severity: "medium",
          recommendation: "Add an SPF record to your DNS to prevent email spoofing and improve deliverability.",
          category: "information",
        });
      }

      // Check DMARC
      const dmarcRes = await axios.get(`https://cloudflare-dns.com/dns-query`, {
        params: { name: `_dmarc.${domain}`, type: "TXT" },
        headers: { accept: "application/dns-json" },
      });
      const dmarcRecords = dmarcRes.data.Answer?.filter((a: any) => a.data.includes("v=DMARC1")) || [];
      if (dmarcRecords.length === 0) {
        addResult(results, {
          name: "Missing DMARC Record",
          severity: "medium",
          recommendation: "Add a DMARC record to your DNS to specify how to handle unauthenticated emails.",
          category: "information",
        });
      }
    } catch (e) {
      /* ignore DNS errors */
    }

    // --- Phase 5: Blacklist/Reputation Check ---
    try {
      const blacklistRes = await axios.get(`/api/blacklist`, {
        params: { domain: domain },
      });
      
      if (blacklistRes.data && !blacklistRes.data.error) {
        const bl = blacklistRes.data;
        
        // Report overall reputation
        if (bl.listedCount > 0) {
          // Domain is on at least one blacklist
          const categories = bl.categories;
          
          if (categories.malware > 0) {
            addResult(results, {
              name: "Malware Blacklist Detection",
              severity: "high",
              recommendation: `Domain is listed on ${categories.malware} malware blocklist(s). This indicates potential malware distribution. Investigate and request removal.`,
              category: "reputation",
            });
          }
          
          if (categories.phishing > 0) {
            addResult(results, {
              name: "Phishing Blacklist Detection",
              severity: "high",
              recommendation: `Domain is listed on ${categories.phishing} phishing blocklist(s). This may indicate phishing activity. Investigate and request removal.`,
              category: "reputation",
            });
          }
          
          if (categories.spam > 0) {
            addResult(results, {
              name: "Spam Blacklist Detection",
              severity: "medium",
              recommendation: `Domain is listed on ${categories.spam} spam blocklist(s). This may affect email deliverability. Review sending practices and request removal.`,
              category: "reputation",
            });
          }
        } else {
          // Clean reputation
          addResult(results, {
            name: "Clean Reputation",
            severity: "low",
            recommendation: `Domain has clean reputation. Not found on any of ${bl.totalChecks} blocklists checked (spam, malware, phishing).`,
            category: "reputation",
          });
        }
      }
    } catch (e) {
      /* ignore blacklist check errors */
    }
  } catch (error: any) {
    console.error("Security Scan Error:", error);
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
