<template>
  <div class="min-h-screen bg-slate-50">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl font-bold text-slate-900 mb-8">Privacy Policy</h1>

        <div class="prose prose-slate max-w-none">
          <p class="text-lg text-slate-600 mb-8">
            Last updated:
            {{ new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) }}
          </p>

          <section class="mb-12">
            <h2 class="text-2xl font-semibold text-slate-900 mb-4">Introduction</h2>
            <p class="text-slate-600 mb-4">
              BlackBoxAudit.com ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your information when you visit our website and use
              our security auditing services.
            </p>
            <p class="text-slate-600">
              By using BlackBoxAudit.com, you consent to the data practices described in this policy.
            </p>
          </section>

          <section class="mb-12">
            <h2 class="text-2xl font-semibold text-slate-900 mb-4">Information We Collect</h2>
            <div class="space-y-6">
              <div>
                <h3 class="text-lg font-semibold text-slate-900 mb-3">Information You Provide</h3>
                <ul class="list-disc list-inside space-y-2 text-slate-600">
                  <li>Website URLs that you submit for security auditing</li>
                  <li>Email address (when contacting support)</li>
                  <li>Communication with our support team</li>
                </ul>
              </div>

              <div>
                <h3 class="text-lg font-semibold text-slate-900 mb-3">Automatically Collected Information</h3>
                <ul class="list-disc list-inside space-y-2 text-slate-600">
                  <li>IP address and geolocation data</li>
                  <li>Browser type, operating system, and device information</li>
                  <li>Pages visited and time spent on our website</li>
                  <li>Referral source and website usage patterns</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>

              <div>
                <h3 class="text-lg font-semibold text-slate-900 mb-3">Security Audit Data</h3>
                <p class="text-slate-600 mb-3">When you audit a website, we collect technical information including:</p>
                <ul class="list-disc list-inside space-y-2 text-slate-600">
                  <li>HTTP headers and security configurations</li>
                  <li>SSL/TLS certificate information</li>
                  <li>Server response data</li>
                  <li>Technical vulnerabilities and misconfigurations</li>
                </ul>
              </div>
            </div>
          </section>

          <section class="mb-12">
            <h2 class="text-2xl font-semibold text-slate-900 mb-4">How We Use Your Information</h2>
            <ul class="list-disc list-inside space-y-2 text-slate-600">
              <li>To provide and maintain our security auditing services</li>
              <li>To process and deliver security audit reports</li>
              <li>To improve our website and services</li>
              <li>To respond to your inquiries and provide customer support</li>
              <li>To monitor and analyze usage patterns</li>
              <li>To detect and prevent fraudulent activities</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section class="mb-12">
            <h2 class="text-2xl font-semibold text-slate-900 mb-4">Data Security</h2>
            <p class="text-slate-600 mb-4">
              We implement appropriate technical and organizational measures to protect your information:
            </p>
            <ul class="list-disc list-inside space-y-2 text-slate-600">
              <li>SSL/TLS encryption for all data transmissions</li>
              <li>Encrypted storage of sensitive data</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Access controls and authentication systems</li>
              <li>Employee training on data protection</li>
            </ul>
            <p class="text-slate-600 mt-4">
              However, no method of transmission over the internet is 100% secure. While we strive to protect your data,
              we cannot guarantee absolute security.
            </p>
          </section>

          <section class="mb-12">
            <h2 class="text-2xl font-semibold text-slate-900 mb-4">Data Retention</h2>
            <p class="text-slate-600 mb-4">
              We retain your information for different periods depending on the type of data:
            </p>
            <ul class="list-disc list-inside space-y-2 text-slate-600">
              <li><strong>Audit Reports:</strong> Temporarily processed during analysis, not permanently stored</li>
              <li><strong>Usage Logs:</strong> Retained for 30 days for security and analytics purposes</li>
              <li><strong>Support Communications:</strong> Retained for 2 years for quality assurance</li>
            </ul>
          </section>

          <section class="mb-12">
            <h2 class="text-2xl font-semibold text-slate-900 mb-4">Third-Party Services</h2>
            <p class="text-slate-600 mb-4">We may use third-party services to help us operate our website:</p>
            <ul class="list-disc list-inside space-y-2 text-slate-600">
              <li><strong>Analytics Services:</strong> To understand website usage patterns</li>
              <li><strong>Cloud Hosting:</strong> To store and process data securely</li>
              <li><strong>Email Services:</strong> To communicate with users</li>
            </ul>
            <p class="text-slate-600 mt-4">
              These third parties have access to your information only to perform these tasks on our behalf and are
              obligated to protect it.
            </p>
          </section>

          <section class="mb-12">
            <h2 class="text-2xl font-semibold text-slate-900 mb-4">Your Rights</h2>
            <p class="text-slate-600 mb-4">Depending on your location, you may have the following rights:</p>
            <ul class="list-disc list-inside space-y-2 text-slate-600">
              <li><strong>Access:</strong> Request access to your personal information</li>
              <li><strong>Correction:</strong> Request correction of inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Objection:</strong> Object to processing of your information</li>
            </ul>
            <p class="text-slate-600 mt-4">To exercise these rights, please contact us at contact@blackboxaudit.com.</p>
          </section>

          <section class="mb-12">
            <h2 class="text-2xl font-semibold text-slate-900 mb-4">Cookies and Tracking</h2>
            <p class="text-slate-600 mb-4">We use cookies and similar technologies to enhance your experience:</p>
            <ul class="list-disc list-inside space-y-2 text-slate-600">
              <li><strong>Essential Cookies:</strong> Required for website functionality</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how you use our site</li>
              <li><strong>Security Cookies:</strong> Help protect against fraud and attacks</li>
            </ul>
            <p class="text-slate-600 mt-4">
              You can control cookies through your browser settings, but disabling cookies may affect website
              functionality.
            </p>
          </section>

          <section class="mb-12">
            <h2 class="text-2xl font-semibold text-slate-900 mb-4">International Data Transfers</h2>
            <p class="text-slate-600">
              Your information may be transferred to and processed in countries other than your own. We ensure
              appropriate safeguards are in place for international data transfers, including standard contractual
              clauses and other legal mechanisms.
            </p>
          </section>

          <section class="mb-12">
            <h2 class="text-2xl font-semibold text-slate-900 mb-4">Children's Privacy</h2>
            <p class="text-slate-600">
              Our services are not intended for children under 13. We do not knowingly collect personal information from
              children under 13. If we become aware that we have collected information from a child under 13, we will
              take steps to delete such information.
            </p>
          </section>

          <section class="mb-12">
            <h2 class="text-2xl font-semibold text-slate-900 mb-4">Changes to This Policy</h2>
            <p class="text-slate-600">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
              policy on this page and updating the "Last updated" date. You are advised to review this policy
              periodically for any changes.
            </p>
          </section>

          <section class="mb-12">
            <h2 class="text-2xl font-semibold text-slate-900 mb-4">Contact Us</h2>
            <p class="text-slate-600 mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div class="bg-white rounded-lg border border-slate-200 p-6">
              <ul class="space-y-2 text-slate-600">
                <li><strong>Email:</strong> contact@blackboxaudit.com</li>
                <li><strong>Website:</strong> https://blackboxaudit.com</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Privacy Policy page logic
useHead({
  title: "Privacy Policy - BlackBoxAudit.com",
  meta: [{ name: "description", content: "Privacy Policy for BlackBoxAudit.com security auditing service" }],
});
</script>
