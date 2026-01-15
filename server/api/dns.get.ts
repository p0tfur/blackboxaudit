import { defineEventHandler, getQuery } from "h3";
import axios from "axios";

/**
 * DNS Health Check API
 * Checks A, NS, MX records and DNSSEC status
 * Uses Cloudflare DNS-over-HTTPS API for reliable lookups
 */
export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const domain = query.domain as string;

    if (!domain) {
      return { error: "Domain parameter is required" };
    }

    // Sanitize domain - remove protocol and path
    const cleanDomain = domain
      .replace(/^https?:\/\//, "")
      .replace(/\/.*$/, "")
      .replace(/^www\./, "")
      .toLowerCase();

    const dnsResults: {
      aRecords: string[];
      nsRecords: string[];
      mxRecords: Array<{ priority: number; exchange: string }>;
      dnssecEnabled: boolean;
      issues: string[];
      score: number;
    } = {
      aRecords: [],
      nsRecords: [],
      mxRecords: [],
      dnssecEnabled: false,
      issues: [],
      score: 100,
    };

    const dohUrl = "https://cloudflare-dns.com/dns-query";
    const headers = { accept: "application/dns-json" };

    // Check A Records
    try {
      const aRes = await axios.get(dohUrl, {
        params: { name: cleanDomain, type: "A" },
        headers,
        timeout: 5000,
      });
      
      if (aRes.data.Answer) {
        dnsResults.aRecords = aRes.data.Answer
          .filter((r: any) => r.type === 1)
          .map((r: any) => r.data);
      }
      
      if (dnsResults.aRecords.length === 0) {
        dnsResults.issues.push("No A records found - domain may not resolve");
        dnsResults.score -= 30;
      }
    } catch (e) {
      dnsResults.issues.push("Failed to query A records");
      dnsResults.score -= 20;
    }

    // Check NS Records
    try {
      const nsRes = await axios.get(dohUrl, {
        params: { name: cleanDomain, type: "NS" },
        headers,
        timeout: 5000,
      });
      
      if (nsRes.data.Answer) {
        dnsResults.nsRecords = nsRes.data.Answer
          .filter((r: any) => r.type === 2)
          .map((r: any) => r.data.replace(/\.$/, ""));
      }
      
      if (dnsResults.nsRecords.length === 0) {
        dnsResults.issues.push("No NS records found - DNS may not be properly configured");
        dnsResults.score -= 20;
      } else if (dnsResults.nsRecords.length === 1) {
        dnsResults.issues.push("Only 1 nameserver found - consider adding redundant NS for reliability");
        dnsResults.score -= 5;
      }
    } catch (e) {
      dnsResults.issues.push("Failed to query NS records");
      dnsResults.score -= 10;
    }

    // Check MX Records
    try {
      const mxRes = await axios.get(dohUrl, {
        params: { name: cleanDomain, type: "MX" },
        headers,
        timeout: 5000,
      });
      
      if (mxRes.data.Answer) {
        dnsResults.mxRecords = mxRes.data.Answer
          .filter((r: any) => r.type === 15)
          .map((r: any) => {
            const parts = r.data.split(" ");
            return {
              priority: parseInt(parts[0], 10),
              exchange: parts[1]?.replace(/\.$/, "") || "",
            };
          })
          .sort((a: any, b: any) => a.priority - b.priority);
      }
      
      // No MX is not necessarily an error - some domains don't use email
      // Just note it as informational
    } catch (e) {
      // MX lookup failure is not critical
    }

    // Check DNSSEC
    try {
      // Query for DNSKEY records - presence indicates DNSSEC is enabled
      const dnskeyRes = await axios.get(dohUrl, {
        params: { name: cleanDomain, type: "DNSKEY", do: true },
        headers,
        timeout: 5000,
      });
      
      // Check if AD flag is set (Authenticated Data) or if DNSKEY records exist
      if (dnskeyRes.data.AD === true || 
          (dnskeyRes.data.Answer && dnskeyRes.data.Answer.some((r: any) => r.type === 48))) {
        dnsResults.dnssecEnabled = true;
      } else {
        // Also check for DS records at parent zone as alternative indicator
        const dsRes = await axios.get(dohUrl, {
          params: { name: cleanDomain, type: "DS" },
          headers,
          timeout: 5000,
        });
        
        if (dsRes.data.Answer && dsRes.data.Answer.some((r: any) => r.type === 43)) {
          dnsResults.dnssecEnabled = true;
        }
      }
      
      if (!dnsResults.dnssecEnabled) {
        dnsResults.issues.push("DNSSEC not enabled - consider enabling for DNS security");
        dnsResults.score -= 10;
      }
    } catch (e) {
      // DNSSEC check failure - assume not enabled
      dnsResults.issues.push("DNSSEC status could not be determined");
      dnsResults.score -= 5;
    }

    // Ensure score doesn't go below 0
    dnsResults.score = Math.max(0, dnsResults.score);

    return {
      domain: cleanDomain,
      ...dnsResults,
      checkedAt: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error("DNS Health Check Error:", error);
    return {
      error: `DNS health check failed: ${error.message || "Unknown error"}`,
    };
  }
});
