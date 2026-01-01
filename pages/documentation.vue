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
                  <li>• Content Security Policy (CSP)</li>
                  <li>• X-Frame-Options</li>
                  <li>• X-Content-Type-Options</li>
                  <li>• Strict-Transport-Security</li>
                  <li>• Referrer Policy</li>
                  <li>• Permissions Policy</li>
                </ul>
              </div>
              <div class="bg-white rounded-lg border border-slate-200 p-6">
                <h3 class="text-lg font-semibold text-slate-900 mb-3">SSL/TLS Analysis</h3>
                <ul class="space-y-2 text-slate-600">
                  <li>• Certificate validity</li>
                  <li>• Protocol versions</li>
                  <li>• Cipher suites</li>
                  <li>• Certificate chain</li>
                  <li>• OCSP stapling</li>
                  <li>• HSTS support</li>
                </ul>
              </div>
              <div class="bg-white rounded-lg border border-slate-200 p-6">
                <h3 class="text-lg font-semibold text-slate-900 mb-3">Vulnerability Scanning</h3>
                <ul class="space-y-2 text-slate-600">
                  <li>• OWASP Top 10 checks</li>
                  <li>• Common misconfigurations</li>
                  <li>• Information disclosure</li>
                  <li>• Cross-site scripting (XSS)</li>
                  <li>• SQL injection indicators</li>
                  <li>• Directory traversal</li>
                </ul>
              </div>
              <div class="bg-white rounded-lg border border-slate-200 p-6">
                <h3 class="text-lg font-semibold text-slate-900 mb-3">Performance & Best Practices</h3>
                <ul class="space-y-2 text-slate-600">
                  <li>• Response time analysis</li>
                  <li>• Compression detection</li>
                  <li>• Cache headers</li>
                  <li>• Resource optimization</li>
                  <li>• CDN detection</li>
                  <li>• Mobile optimization</li>
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
