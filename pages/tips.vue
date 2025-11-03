<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="mb-8 text-3xl font-bold">Security Tips & Recommendations</h1>
    
    <!-- Category Filter -->
    <div class="mb-6">
      <span class="text-sm font-medium text-gray-600 mb-2 block">Filter by Category</span>
      <div class="flex flex-wrap gap-2">
        <button 
          v-for="category in categories" 
          :key="category"
          :class="[
            'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
            activeCategory === category 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          ]"
          @click="activeCategory = category"
        >
          {{ category }}
        </button>
      </div>
    </div>
    
    <!-- Tips List -->
    <div class="space-y-6">
      <div v-for="(tip, index) in filteredTips" :key="index" class="p-4 bg-white rounded-lg shadow-md">
        <h3 class="mb-2 text-xl font-semibold">{{ tip.title }}</h3>
        <span 
          class="mb-3 inline-block px-2 py-1 text-xs font-medium rounded-full" 
          :class="{
            'bg-blue-100 text-blue-800': getCategoryVariant(tip.category) === 'info',
            'bg-green-100 text-green-800': getCategoryVariant(tip.category) === 'success',
            'bg-yellow-100 text-yellow-800': getCategoryVariant(tip.category) === 'warning',
            'bg-red-100 text-red-800': getCategoryVariant(tip.category) === 'error',
            'bg-gray-100 text-gray-800': getCategoryVariant(tip.category) === 'secondary',
            'bg-blue-100 text-blue-800': getCategoryVariant(tip.category) === 'primary',
            'bg-gray-100 text-gray-800': getCategoryVariant(tip.category) === 'default'
          }"
        >
          {{ tip.category }}
        </span>
        <p class="mb-4 text-gray-700">{{ tip.description }}</p>
        
        <div v-if="tip.code" class="bg-gray-100 p-4 rounded-md my-4 font-mono text-sm overflow-x-auto">
          <pre>{{ tip.code }}</pre>
        </div>
        
        <div v-if="tip.links && tip.links.length > 0" class="mt-4">
          <span class="text-sm font-medium text-gray-600 mb-2 block">Learn More:</span>
          <ul class="list-disc pl-5 space-y-1">
            <li v-for="(link, linkIndex) in tip.links" :key="linkIndex">
              <a :href="link.url" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">
                {{ link.title }}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Link {
  title: string
  url: string
}

interface Tip {
  title: string
  category: string
  description: string
  code?: string
  links?: Link[]
}

const categories = ['All', 'Headers', 'Transport', 'Content', 'Forms', 'Geo-blocking', 'Best Practices']
const activeCategory = ref('All')

const tips = ref<Tip[]>([
  {
    title: 'Implement Proper Security Headers',
    category: 'Headers',
    description: 'Security headers are HTTP response headers that, when set, can enhance the security of your web application by enabling browser security policies.',
    code: 'Strict-Transport-Security: max-age=31536000; includeSubDomains\nContent-Security-Policy: default-src \'self\'\nX-Content-Type-Options: nosniff\nX-Frame-Options: DENY\nReferrer-Policy: no-referrer-when-downgrade',
    links: [
      { title: 'OWASP Secure Headers Project', url: 'https://owasp.org/www-project-secure-headers/' },
      { title: 'Mozilla Web Security Guidelines', url: 'https://infosec.mozilla.org/guidelines/web_security' }
    ]
  },
  {
    title: 'Always Use HTTPS',
    category: 'Transport',
    description: 'HTTPS encrypts the data sent between your users and your website, preventing attackers from intercepting sensitive information.',
    links: [
      { title: 'Why HTTPS Matters', url: 'https://developers.google.com/web/fundamentals/security/encrypt-in-transit/why-https' },
      { title: 'Let\'s Encrypt - Free SSL Certificates', url: 'https://letsencrypt.org/' }
    ]
  },
  {
    title: 'Implement Content Security Policy (CSP)',
    category: 'Content',
    description: 'Content Security Policy is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross-Site Scripting (XSS) and data injection attacks.',
    code: 'Content-Security-Policy: default-src \'self\'; script-src \'self\' https://trusted-cdn.com; style-src \'self\' https://trusted-cdn.com; img-src \'self\' data:;',
    links: [
      { title: 'MDN: Content Security Policy', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP' },
      { title: 'CSP Evaluator Tool', url: 'https://csp-evaluator.withgoogle.com/' }
    ]
  },
  {
    title: 'Secure Your Forms',
    category: 'Forms',
    description: 'Forms are a common entry point for attacks. Ensure all forms use HTTPS, implement CSRF protection, and validate input both client-side and server-side.',
    code: '<form method="POST" action="https://example.com/submit" autocomplete="off">\n  <!-- Add CSRF token -->\n  <input type="hidden" name="_csrf" value="{{ csrfToken }}" />\n  <!-- Other form fields -->\n</form>',
    links: [
      { title: 'OWASP Form Security Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html' }
    ]
  },
  {
    title: 'Countries to Consider for Geo-blocking',
    category: 'Geo-blocking',
    description: 'Geo-blocking can help prevent attacks from high-risk regions. Consider blocking traffic from countries commonly associated with cyber threats if they are not part of your target audience.',
    code: '# Countries commonly associated with cyber threats:\n- North Korea (KP)\n- China (CN)\n- Russia (RU)\n- Iran (IR)\n- Syria (SY)\n- Vietnam (VN)\n- Nigeria (NG)\n- Belarus (BY)\n- Turkey (TR)',
    links: [
      { title: 'Cloudflare Geo-blocking', url: 'https://developers.cloudflare.com/waf/tools/geo-blocking/' }
    ]
  },
  {
    title: 'How to Implement Geo-blocking',
    category: 'Geo-blocking',
    description: 'There are several ways to implement geo-blocking depending on your infrastructure.',
    code: '# Cloudflare: Use Firewall Rules\n# NGINX: Use the geoip module\n# .htaccess: Manually block IP ranges by country\n# Security Plugins: Many platforms like WordPress offer geo-blocking plugins',
    links: [
      { title: 'Cloudflare Country Blocking', url: 'https://support.cloudflare.com/hc/en-us/articles/217074967-How-do-I-setup-Cloudflare-IP-Geolocation-' },
      { title: 'NGINX GeoIP Module', url: 'https://docs.nginx.com/nginx/admin-guide/dynamic-modules/geoip/' }
    ]
  },
  {
    title: 'Implement Subresource Integrity',
    category: 'Best Practices',
    description: 'Subresource Integrity (SRI) is a security feature that enables browsers to verify that resources they fetch are delivered without unexpected manipulation.',
    code: '<script src="https://example.com/example-framework.js"\n        integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"\n        crossorigin="anonymous"><\/script>',
    links: [
      { title: 'MDN: Subresource Integrity', url: 'https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity' },
      { title: 'SRI Hash Generator', url: 'https://www.srihash.org/' }
    ]
  },
  {
    title: 'Use HTTP Strict Transport Security (HSTS)',
    category: 'Transport',
    description: 'HSTS tells browsers to only use HTTPS, preventing protocol downgrade attacks and cookie hijacking.',
    code: 'Strict-Transport-Security: max-age=31536000; includeSubDomains; preload',
    links: [
      { title: 'MDN: HTTP Strict Transport Security', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security' },
      { title: 'HSTS Preload List Submission', url: 'https://hstspreload.org/' }
    ]
  }
])

const filteredTips = computed(() => {
  if (activeCategory.value === 'All') {
    return tips.value
  }
  return tips.value.filter(tip => tip.category === activeCategory.value)
})

const getCategoryVariant = (category: string): string => {
  const variants: Record<string, string> = {
    'Headers': 'info',
    'Transport': 'success',
    'Content': 'warning',
    'Forms': 'error',
    'Geo-blocking': 'secondary',
    'Best Practices': 'primary'
  }
  return variants[category] || 'default'
}
</script>