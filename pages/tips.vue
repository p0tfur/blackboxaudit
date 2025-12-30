<template>
  <div class="container mx-auto px-4 py-12 max-w-5xl">
    <div class="text-center md:text-left mb-12">
      <h1 class="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">Security Best Practices</h1>
      <p class="text-lg text-slate-600 max-w-3xl">
        Actionable advice and code snippets to harden your web application against common vulnerabilities.
      </p>
    </div>

    <!-- Category Filter -->
    <div class="mb-10 overflow-x-auto pb-4 -mx-4 px-4 md:px-0 md:mx-0">
      <div class="flex flex-nowrap md:flex-wrap gap-2">
        <button
          v-for="category in categories"
          :key="category"
          :class="[
            'px-4 py-2 text-sm font-medium rounded-full transition-all whitespace-nowrap border',
            activeCategory === category
              ? 'bg-brand-600 border-brand-600 text-white shadow-md shadow-brand-500/25'
              : 'bg-white border-slate-200 text-slate-600 hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50',
          ]"
          @click="activeCategory = category"
        >
          {{ category }}
        </button>
      </div>
    </div>

    <!-- Tips List -->
    <div class="grid gap-6">
      <div
        v-for="(tip, index) in filteredTips"
        :key="index"
        class="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow border border-slate-100 overflow-hidden"
      >
        <div class="p-6 md:p-8">
          <div class="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
            <h3 class="text-xl font-bold text-slate-900">{{ tip.title }}</h3>
            <span
              class="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wide whitespace-nowrap self-start"
              :class="{
                'bg-blue-50 text-blue-700 border border-blue-100': getCategoryVariant(tip.category) === 'info',
                'bg-emerald-50 text-emerald-700 border border-emerald-100':
                  getCategoryVariant(tip.category) === 'success',
                'bg-amber-50 text-amber-700 border border-amber-100': getCategoryVariant(tip.category) === 'warning',
                'bg-rose-50 text-rose-700 border border-rose-100': getCategoryVariant(tip.category) === 'error',
                'bg-slate-100 text-slate-700 border border-slate-200': getCategoryVariant(tip.category) === 'secondary',
                'bg-brand-50 text-brand-700 border border-brand-100': getCategoryVariant(tip.category) === 'primary',
                'bg-gray-50 text-gray-700 border border-gray-200': getCategoryVariant(tip.category) === 'default',
              }"
            >
              {{ tip.category }}
            </span>
          </div>

          <p class="text-slate-600 leading-relaxed mb-6">{{ tip.description }}</p>

          <div
            v-if="tip.code"
            class="bg-slate-900 rounded-xl overflow-hidden mb-6 border border-slate-800 shadow-inner"
          >
            <div class="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-slate-800">
              <span class="text-xs font-mono text-slate-400">Example Configuration</span>
            </div>
            <div class="p-4 overflow-x-auto">
              <pre class="text-sm font-mono text-brand-100 leading-relaxed">{{ tip.code }}</pre>
            </div>
          </div>

          <div v-if="tip.links && tip.links.length > 0" class="pt-6 border-t border-slate-100">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block"
              >Recommended Resources</span
            >
            <ul class="space-y-2">
              <li v-for="(link, linkIndex) in tip.links" :key="linkIndex" class="flex items-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-brand-500 mt-0.5 flex-shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"
                  />
                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                </svg>
                <a
                  :href="link.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-brand-600 hover:text-brand-800 hover:underline font-medium transition-colors"
                >
                  {{ link.title }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

interface Link {
  title: string;
  url: string;
}

interface Tip {
  title: string;
  category: string;
  description: string;
  code?: string;
  links?: Link[];
}

const categories = ["All", "Headers", "Transport", "Content", "Forms", "Geo-blocking", "Best Practices"];
const activeCategory = ref("All");

const tips = ref<Tip[]>([
  {
    title: "Implement Proper Security Headers",
    category: "Headers",
    description:
      "Security headers are HTTP response headers that, when set, can enhance the security of your web application by enabling browser security policies.",
    code: "Strict-Transport-Security: max-age=31536000; includeSubDomains\nContent-Security-Policy: default-src 'self'\nX-Content-Type-Options: nosniff\nX-Frame-Options: DENY\nReferrer-Policy: no-referrer-when-downgrade",
    links: [
      { title: "OWASP Secure Headers Project", url: "https://owasp.org/www-project-secure-headers/" },
      { title: "Mozilla Web Security Guidelines", url: "https://infosec.mozilla.org/guidelines/web_security" },
    ],
  },
  {
    title: "Always Use HTTPS",
    category: "Transport",
    description:
      "HTTPS encrypts the data sent between your users and your website, preventing attackers from intercepting sensitive information.",
    links: [
      {
        title: "Why HTTPS Matters",
        url: "https://developers.google.com/web/fundamentals/security/encrypt-in-transit/why-https",
      },
      { title: "Let's Encrypt - Free SSL Certificates", url: "https://letsencrypt.org/" },
    ],
  },
  {
    title: "Implement Content Security Policy (CSP)",
    category: "Content",
    description:
      "Content Security Policy is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross-Site Scripting (XSS) and data injection attacks.",
    code: "Content-Security-Policy: default-src 'self'; script-src 'self' https://trusted-cdn.com; style-src 'self' https://trusted-cdn.com; img-src 'self' data:;",
    links: [
      { title: "MDN: Content Security Policy", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP" },
      { title: "CSP Evaluator Tool", url: "https://csp-evaluator.withgoogle.com/" },
    ],
  },
  {
    title: "Secure Your Forms",
    category: "Forms",
    description:
      "Forms are a common entry point for attacks. Ensure all forms use HTTPS, implement CSRF protection, and validate input both client-side and server-side.",
    code: '<form method="POST" action="https://example.com/submit" autocomplete="off">\n  <!-- Add CSRF token -->\n  <input type="hidden" name="_csrf" value="{{ csrfToken }}" />\n  <!-- Other form fields -->\n</form>',
    links: [
      {
        title: "OWASP Form Security Cheat Sheet",
        url: "https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html",
      },
    ],
  },
  {
    title: "Countries to Consider for Geo-blocking",
    category: "Geo-blocking",
    description:
      "Geo-blocking can help prevent attacks from high-risk regions. Consider blocking traffic from countries commonly associated with cyber threats if they are not part of your target audience.",
    code: "# Countries commonly associated with cyber threats:\n- North Korea (KP)\n- China (CN)\n- Russia (RU)\n- Iran (IR)\n- Syria (SY)\n- Vietnam (VN)\n- Nigeria (NG)\n- Belarus (BY)\n- Turkey (TR)",
    links: [{ title: "Cloudflare Geo-blocking", url: "https://developers.cloudflare.com/waf/tools/geo-blocking/" }],
  },
  {
    title: "How to Implement Geo-blocking",
    category: "Geo-blocking",
    description: "There are several ways to implement geo-blocking depending on your infrastructure.",
    code: "# Cloudflare: Use Firewall Rules\n# NGINX: Use the geoip module\n# .htaccess: Manually block IP ranges by country\n# Security Plugins: Many platforms like WordPress offer geo-blocking plugins",
    links: [
      {
        title: "Cloudflare Country Blocking",
        url: "https://support.cloudflare.com/hc/en-us/articles/217074967-How-do-I-setup-Cloudflare-IP-Geolocation-",
      },
      { title: "NGINX GeoIP Module", url: "https://docs.nginx.com/nginx/admin-guide/dynamic-modules/geoip/" },
    ],
  },
  {
    title: "Implement Subresource Integrity",
    category: "Best Practices",
    description:
      "Subresource Integrity (SRI) is a security feature that enables browsers to verify that resources they fetch are delivered without unexpected manipulation.",
    code: '<script src="https://example.com/example-framework.js"\n        integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"\n        crossorigin="anonymous"><\/script>',
    links: [
      {
        title: "MDN: Subresource Integrity",
        url: "https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity",
      },
      { title: "SRI Hash Generator", url: "https://www.srihash.org/" },
    ],
  },
  {
    title: "Use HTTP Strict Transport Security (HSTS)",
    category: "Transport",
    description: "HSTS tells browsers to only use HTTPS, preventing protocol downgrade attacks and cookie hijacking.",
    code: "Strict-Transport-Security: max-age=31536000; includeSubDomains; preload",
    links: [
      {
        title: "MDN: HTTP Strict Transport Security",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security",
      },
      { title: "HSTS Preload List Submission", url: "https://hstspreload.org/" },
    ],
  },
]);

const filteredTips = computed(() => {
  if (activeCategory.value === "All") {
    return tips.value;
  }
  return tips.value.filter((tip) => tip.category === activeCategory.value);
});

const getCategoryVariant = (category: string): string => {
  const variants: Record<string, string> = {
    Headers: "info",
    Transport: "success",
    Content: "warning",
    Forms: "error",
    "Geo-blocking": "secondary",
    "Best Practices": "primary",
  };
  return variants[category] || "default";
};
</script>
