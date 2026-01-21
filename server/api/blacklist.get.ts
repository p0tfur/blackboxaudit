import { defineEventHandler, getQuery } from "h3";
import * as dns from "dns";
import { promisify } from "util";

const resolve4 = promisify(dns.resolve4);

/**
 * Blacklist/Reputation Check API
 * Checks domain against DNS-based blocklists (DNSBLs)
 * and provides reputation assessment
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

    // DNS-based blocklists to check
    // Using free, publicly available DNSBLs
    // Note: Some lists are IP-based, some are domain-based
    const domainBlocklists = [
      // Domain-based lists (query with domain name)
      { name: "Spamhaus DBL", host: "dbl.spamhaus.org", category: "malware" },
      { name: "SURBL", host: "multi.surbl.org", category: "spam" },
      { name: "URIBL", host: "multi.uribl.com", category: "spam" },
    ];

    // IP-based lists require resolving domain to IP first
    // Skipping these for domain scans as they require IP lookup
    // and can cause false positives when querying with domain names
    // { name: "Spamhaus ZEN", host: "zen.spamhaus.org", category: "spam" },
    // { name: "SORBS", host: "dnsbl.sorbs.net", category: "spam" },
    // { name: "PhishTank", host: "phishtank.phishtank.com", category: "phishing" },
    // { name: "Malware Domain List", host: "malwaredomainlist.com.bl.blocked.nl", category: "malware" },

    const results: Array<{
      name: string;
      category: string;
      listed: boolean;
      response?: string;
    }> = [];

    // Check domain against domain-based blocklists only
    // DNSBL lookups work by querying: domain.blocklist.example.com
    await Promise.all(
      domainBlocklists.map(async (bl) => {
        const lookupDomain = `${cleanDomain}.${bl.host}`;
        try {
          // For domain-based blocklists
          const addresses = await resolve4(lookupDomain);
          
          // DNSBL response code interpretation:
          // - 127.0.0.1 = Query REFUSED/BLOCKED (rate limit, not a listing!) - IGNORE THIS
          // - 127.0.0.2+ = Actual listing on various lists
          // For URIBL specifically:
          //   127.0.0.1 = query refused (too many queries from DNS server)
          //   127.0.0.2 = black.uribl.com (spam)
          //   127.0.0.4 = grey.uribl.com (UBE/UCE)
          //   127.0.0.8 = red.uribl.com (new/suspicious domains)
          const isListed = addresses.some((addr: string) => {
            if (!addr.startsWith("127.0.0.")) return false;
            const lastOctet = parseInt(addr.split(".")[3]);
            // 127.0.0.1 means query refused, NOT listed - common with public DNS
            // Only 127.0.0.2 and above indicate actual listing
            return lastOctet >= 2;
          });
          
          console.log(`[Blacklist] ${bl.name} for ${cleanDomain}: response=${addresses.join(",")}, listed=${isListed}`);
          
          results.push({
            name: bl.name,
            category: bl.category,
            listed: isListed,
            response: addresses.join(", "),
          });
        } catch (err: any) {
          // NXDOMAIN (ENOTFOUND) or NODATA means NOT listed - this is the expected response for clean domains
          console.log(`[Blacklist] ${bl.name} for ${cleanDomain}: error=${err.code} (NOT listed)`);
          
          results.push({
            name: bl.name,
            category: bl.category,
            listed: false,
            response: err.code === "ETIMEOUT" || err.code === "ESERVFAIL" ? "timeout" : undefined,
          });
        }
      })
    );

    // Calculate reputation score
    const totalChecks = results.filter(r => r.response !== "timeout").length;
    const listedCount = results.filter(r => r.listed).length;
    const categories = {
      spam: results.filter(r => r.category === "spam" && r.listed).length,
      malware: results.filter(r => r.category === "malware" && r.listed).length,
      phishing: results.filter(r => r.category === "phishing" && r.listed).length,
    };

    // Score: 100 = clean, decreases with each listing
    let score = 100;
    if (categories.malware > 0) score -= 40; // Malware is very serious
    if (categories.phishing > 0) score -= 35; // Phishing is serious
    if (categories.spam > 0) score -= Math.min(25, categories.spam * 10); // Spam accumulates
    score = Math.max(0, score);

    // Determine severity
    let severity: "clean" | "warning" | "danger" = "clean";
    if (score < 50) severity = "danger";
    else if (score < 80) severity = "warning";

    return {
      domain: cleanDomain,
      score,
      severity,
      totalChecks,
      listedCount,
      categories,
      results: results.filter(r => r.listed), // Only return listings for brevity
      checkedAt: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error("Blacklist Check Error:", error);
    return {
      error: `Blacklist check failed: ${error.message || "Unknown error"}`,
    };
  }
});
