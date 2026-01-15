import { defineEventHandler, getQuery } from "h3";
import * as https from "https";
import * as tls from "tls";

/**
 * TLS/SSL Details Check API
 * Analyzes TLS version, cipher suites, certificate chain, and OCSP stapling
 */
export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const url = query.url as string;

    if (!url) {
      return { error: "URL parameter is required" };
    }

    // Parse URL to get hostname and port
    const parsedUrl = new URL(url.startsWith("http") ? url : `https://${url}`);
    const hostname = parsedUrl.hostname;
    const port = parsedUrl.port ? parseInt(parsedUrl.port, 10) : 443;

    if (parsedUrl.protocol !== "https:") {
      return { error: "Only HTTPS URLs are supported for TLS check" };
    }

    return new Promise((resolve) => {
      const options: https.RequestOptions = {
        hostname,
        port,
        path: "/",
        method: "GET",
        rejectUnauthorized: false, // We want to analyze even invalid certs
        agent: false,
      };

      const req = https.request(options, (res) => {
        const socket = res.socket as tls.TLSSocket;
        const cipher = socket.getCipher?.();
        const protocol = socket.getProtocol?.();
        const peerCert = socket.getPeerCertificate(true);
        
        // Get full certificate chain
        const certChain: any[] = [];
        let currentCert = peerCert;
        while (currentCert && Object.keys(currentCert).length > 0) {
          certChain.push({
            subject: currentCert.subject?.CN || currentCert.subject?.O || "Unknown",
            issuer: currentCert.issuer?.CN || currentCert.issuer?.O || "Unknown",
            validFrom: currentCert.valid_from,
            validTo: currentCert.valid_to,
          });
          
          // Check if we've reached the root or if issuerCertificate is circular reference
          if (!currentCert.issuerCertificate || 
              currentCert.fingerprint === currentCert.issuerCertificate?.fingerprint) {
            break;
          }
          currentCert = currentCert.issuerCertificate;
        }

        // Analyze results
        const tlsVersion = protocol || "Unknown";
        const cipherSuite = cipher?.name || "Unknown";
        
        // Determine TLS version quality
        let tlsVersionScore = 100;
        let tlsVersionIssues: string[] = [];
        
        if (tlsVersion.includes("1.3")) {
          // TLSv1.3 is excellent
          tlsVersionIssues.push("Using TLS 1.3 - excellent security");
        } else if (tlsVersion.includes("1.2")) {
          // TLSv1.2 is acceptable
          tlsVersionScore = 85;
          tlsVersionIssues.push("Using TLS 1.2 - consider upgrading to TLS 1.3");
        } else {
          // TLSv1.1 or older is weak
          tlsVersionScore = 40;
          tlsVersionIssues.push(`Using ${tlsVersion} - OUTDATED! Upgrade to TLS 1.2 or 1.3 immediately`);
        }

        // Analyze cipher suite (basic check for weak ciphers)
        let cipherScore = 100;
        let cipherIssues: string[] = [];
        const cipherLower = (cipherSuite || "").toLowerCase();
        
        if (cipherLower.includes("rc4") || cipherLower.includes("des") || cipherLower.includes("md5")) {
          cipherScore = 30;
          cipherIssues.push("Weak cipher detected - uses broken cryptography");
        } else if (cipherLower.includes("aes_256_gcm") || cipherLower.includes("chacha20")) {
          cipherIssues.push("Strong cipher suite in use");
        } else if (cipherLower.includes("aes_128")) {
          cipherScore = 85;
          cipherIssues.push("Acceptable cipher suite - consider AES-256-GCM for better security");
        } else {
          cipherScore = 70;
          cipherIssues.push("Cipher suite is acceptable");
        }

        // Certificate chain validation
        const chainLength = certChain.length;
        let chainIssues: string[] = [];
        
        if (chainLength === 0) {
          chainIssues.push("No certificate chain found");
        } else if (chainLength === 1) {
          chainIssues.push("Self-signed or incomplete certificate chain - browsers may not trust this");
        } else if (chainLength >= 2) {
          chainIssues.push(`Certificate chain has ${chainLength} certificates (Server → Intermediate(s) → Root)`);
        }

        // OCSP stapling detection (limited in Node.js - we can't directly check without deeper TLS inspection)
        // This is a placeholder - true OCSP stapling detection requires raw TLS handshake inspection
        const ocspStapled = false; // Node.js doesn't expose this easily
        const ocspIssue = ocspStapled 
          ? "OCSP stapling enabled - improves performance" 
          : "OCSP stapling status unknown - enable if possible for better performance";

        req.destroy();
        
        resolve({
          hostname,
          tlsVersion,
          cipherSuite,
          certChain,
          tlsVersionScore,
          cipherScore,
          issues: {
            tlsVersion: tlsVersionIssues,
            cipher: cipherIssues,
            chain: chainIssues,
            ocsp: [ocspIssue],
          },
          checkedAt: new Date().toISOString(),
        });
      });

      req.on("error", (error) => {
        resolve({
          error: `TLS check failed: ${error.message}`,
        });
      });

      req.end();
    });
  } catch (error: any) {
    console.error("TLS Details Check Error:", error);
    return {
      error: `TLS details check failed: ${error.message || "Unknown error"}`,
    };
  }
});
