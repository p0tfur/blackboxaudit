<template>
  <div class="min-h-screen bg-slate-50">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl font-bold text-slate-900 mb-8">Documentation</h1>

        <div class="prose prose-slate max-w-none">
          <p class="text-lg text-slate-600 mb-8">
            Comprehensive guide to using BlackBoxAudit.com for automated security auditing of web applications.
          </p>

          <section class="mb-12">
            <h2 class="text-2xl font-semibold text-slate-900 mb-4">Getting Started</h2>
            <div class="bg-white rounded-lg border border-slate-200 p-6">
              <h3 class="text-lg font-semibold text-slate-900 mb-3">Quick Start</h3>
              <ol class="list-decimal list-inside space-y-2 text-slate-600">
                <li>Enter your website URL in the audit form</li>
                <li>Click "Start Audit" to begin the security scan</li>
                <li>Wait for the analysis to complete (usually 30-60 seconds)</li>
                <li>Review your comprehensive security report</li>
                <li>Follow the recommendations to fix identified issues</li>
              </ol>
              <p class="text-slate-600 mt-4">Our service is completely free to use with no registration required.</p>
            </div>
          </section>

          <section class="mb-12">
            <h2 class="text-2xl font-semibold text-slate-900 mb-4">Security Checks</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-white rounded-lg border border-slate-200 p-6">
                <h3 class="text-lg font-semibold text-slate-900 mb-3">HTTP Headers</h3>
                <ul class="space-y-2 text-slate-600">
                  <li>• Content-Security-Policy (CSP) presence/strength</li>
                  <li>• X-Frame-Options presence/strength</li>
                  <li>• X-Content-Type-Options (nosniff)</li>
                  <li>• Strict-Transport-Security (HSTS) presence/strength</li>
                  <li>• Referrer-Policy recommendations</li>
                  <li>• Permissions-Policy presence</li>
                  <li>• CORS wildcard + credentials misconfiguration</li>
                  <li>• COOP / COEP presence</li>
                </ul>
              </div>
              <div class="bg-white rounded-lg border border-slate-200 p-6">
                <h3 class="text-lg font-semibold text-slate-900 mb-3">SSL/TLS Security</h3>
                <ul class="space-y-2 text-slate-600">
                  <li>• Certificate expiry date (alerts if &lt; 30 days)</li>
                  <li>• Expired certificate detection</li>
                  <li>• TLS version analysis (1.2 vs 1.3)</li>
                  <li>• Cipher suite strength evaluation</li>
                  <li>• Certificate chain validation</li>
                  <li>• Weak encryption detection</li>
                </ul>
              </div>
              <div class="bg-white rounded-lg border border-slate-200 p-6">
                <h3 class="text-lg font-semibold text-slate-900 mb-3">Crawling &amp; Form Analysis</h3>
                <ul class="space-y-2 text-slate-600">
                  <li>• Shallow crawl (same-origin) to find up to a few subpages</li>
                  <li>• POST forms missing CSRF tokens</li>
                  <li>• Forms submitting to HTTP action URLs</li>
                  <li>• Password fields missing recommended autocomplete values</li>
                  <li>• Inline script detection (CSP hardening signal)</li>
                </ul>
              </div>
              <div class="bg-white rounded-lg border border-slate-200 p-6">
                <h3 class="text-lg font-semibold text-slate-900 mb-3">Active Probing &amp; External Signals</h3>
                <ul class="space-y-2 text-slate-600">
                  <li>• 150+ sensitive file checks (admin panels, API docs, backups, configs)</li>
                  <li>• Admin panel detection (/admin, /wp-admin, /phpmyadmin)</li>
                  <li>• API documentation exposure (/swagger, /api/docs, /graphql)</li>
                  <li>• Debug endpoint discovery (/debug, /trace, /actuator)</li>
                  <li>• Version control exposure (.git, .svn)</li>
                  <li>• Soft 404 detection</li>
                  <li>• robots.txt and security.txt discovery</li>
                  <li>• Subresource Integrity (SRI) validation</li>
                  <li>• Third-party script domain inventory</li>
                </ul>
              </div>
              <div class="bg-white rounded-lg border border-slate-200 p-6">
                <h3 class="text-lg font-semibold text-slate-900 mb-3">DNS Health Check</h3>
                <ul class="space-y-2 text-slate-600">
                  <li>• A Record validation (IP resolution)</li>
                  <li>• NS Record redundancy check</li>
                  <li>• MX Record configuration (email setup)</li>
                  <li>• DNSSEC status verification</li>
                  <li>• SPF/DMARC email authentication</li>
                </ul>
              </div>
              <div class="bg-white rounded-lg border border-slate-200 p-6">
                <h3 class="text-lg font-semibold text-slate-900 mb-3">Reputation &amp; Blacklists</h3>
                <ul class="space-y-2 text-slate-600">
                  <li>• Spam blacklist detection (Spamhaus, SURBL, SORBS)</li>
                  <li>• Malware database checks</li>
                  <li>• Phishing list verification</li>
                  <li>• Multi-source reputation scoring</li>
                  <li>• Real-time DNS-based blocklist queries</li>
                </ul>
              </div>
            </div>
          </section>

          <section class="mb-12">
            <h2 class="text-2xl font-semibold text-slate-900 mb-4">Understanding Your Report</h2>
            <div class="space-y-6">
              <div class="bg-white rounded-lg border border-slate-200 p-6">
                <h3 class="text-lg font-semibold text-slate-900 mb-3">Security Score</h3>
                <p class="text-slate-600 mb-3">
                  Your overall security score ranges from 0-100 and represents the security posture of your website.
                </p>
                <div class="space-y-2">
                  <div class="flex items-center gap-2">
                    <div class="w-4 h-4 bg-green-500 rounded"></div>
                    <span class="text-slate-600"><strong>90-100:</strong> Excellent security posture</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span class="text-slate-600"><strong>70-89:</strong> Good security with room for improvement</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="w-4 h-4 bg-orange-500 rounded"></div>
                    <span class="text-slate-600"><strong>50-69:</strong> Moderate security concerns</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="w-4 h-4 bg-red-500 rounded"></div>
                    <span class="text-slate-600"><strong>0-49:</strong> Critical security issues found</span>
                  </div>
                </div>
              </div>

              <div class="bg-white rounded-lg border border-slate-200 p-6">
                <h3 class="text-lg font-semibold text-slate-900 mb-3">Issue Severity Levels</h3>
                <ul class="space-y-2 text-slate-600">
                  <li><strong>Critical:</strong> Immediate action required, high-risk vulnerabilities</li>
                  <li><strong>High:</strong> Important security issues that should be addressed soon</li>
                  <li><strong>Medium:</strong> Moderate security concerns</li>
                  <li><strong>Low:</strong> Minor security improvements</li>
                  <li><strong>Info:</strong> Informational findings and best practices</li>
                </ul>
              </div>
            </div>
          </section>

          <section class="mb-12">
            <h2 class="text-2xl font-semibold text-slate-900 mb-4">Frequently Asked Questions</h2>
            <div class="space-y-4">
              <div class="bg-white rounded-lg border border-slate-200 p-6">
                <h3 class="text-lg font-semibold text-slate-900 mb-2">How often should I audit my website?</h3>
                <p class="text-slate-600">
                  We recommend running security audits at least monthly, or whenever you deploy significant changes to
                  your application.
                </p>
              </div>
              <div class="bg-white rounded-lg border border-slate-200 p-6">
                <h3 class="text-lg font-semibold text-slate-900 mb-2">Is my data secure?</h3>
                <p class="text-slate-600">
                  Yes, all audit data is encrypted in transit and at rest. We do not store sensitive information from
                  your website.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Documentation page logic
useHead({
  title: "Documentation - BlackBoxAudit.com",
  meta: [{ name: "description", content: "Complete documentation for BlackBoxAudit.com security auditing tool" }],
});
</script>
