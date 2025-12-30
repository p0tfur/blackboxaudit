<template>
  <div class="container mx-auto px-4 py-12 max-w-5xl">
    <div class="text-center md:text-left mb-12">
      <h1 class="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">Security Best Practices</h1>
      <p class="text-lg text-slate-600 max-w-3xl">
        Actionable advice and code snippets to harden your web application against common vulnerabilities.
      </p>
    </div>

    <!-- Search Input -->
    <div class="mb-6">
      <div class="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clip-rule="evenodd"
          />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search tips by title, description, or category..."
          class="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
        />
      </div>
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
            <div class="flex flex-wrap gap-2 self-start">
              <span
                class="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border whitespace-nowrap"
                :class="getDifficultyColor(tip.difficulty)"
              >
                {{ tip.difficulty }}
              </span>
              <span
                class="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wide whitespace-nowrap"
                :class="{
                  'bg-blue-50 text-blue-700 border border-blue-100': getCategoryVariant(tip.category) === 'info',
                  'bg-emerald-50 text-emerald-700 border border-emerald-100':
                    getCategoryVariant(tip.category) === 'success',
                  'bg-amber-50 text-amber-700 border border-amber-100': getCategoryVariant(tip.category) === 'warning',
                  'bg-rose-50 text-rose-700 border border-rose-100': getCategoryVariant(tip.category) === 'error',
                  'bg-slate-100 text-slate-700 border border-slate-200':
                    getCategoryVariant(tip.category) === 'secondary',
                  'bg-brand-50 text-brand-700 border border-brand-100': getCategoryVariant(tip.category) === 'primary',
                  'bg-gray-50 text-gray-700 border border-gray-200': getCategoryVariant(tip.category) === 'default',
                }"
              >
                {{ tip.category }}
              </span>
            </div>
          </div>

          <p class="text-slate-600 leading-relaxed mb-6">{{ tip.description }}</p>

          <div
            v-if="tip.code"
            class="bg-slate-900 rounded-xl overflow-hidden mb-6 border border-slate-800 shadow-inner"
          >
            <div class="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-slate-800">
              <span class="text-xs font-mono text-slate-400">Example Configuration</span>
              <button
                @click="copyToClipboard(tip.code!)"
                class="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-700/50 hover:bg-slate-700 rounded-md transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                  <path
                    d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"
                  />
                </svg>
                Copy
              </button>
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
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

const categories = [
  "All",
  "Headers",
  "Transport",
  "Content",
  "Forms",
  "Geo-blocking",
  "Best Practices",
  "Authentication",
  "API Security",
  "Cookies",
  "Database",
];
const activeCategory = ref("All");
const searchQuery = ref("");

const tips = ref<Tip[]>([
  {
    title: "Implement Proper Security Headers",
    category: "Headers",
    difficulty: "Intermediate",
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
    difficulty: "Beginner",
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
    difficulty: "Advanced",
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
    difficulty: "Intermediate",
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
    difficulty: "Intermediate",
    description:
      "Geo-blocking can help prevent attacks from high-risk regions. Consider blocking traffic from countries commonly associated with cyber threats if they are not part of your target audience.",
    code: "# Countries commonly associated with cyber threats:\n- North Korea (KP)\n- China (CN)\n- Russia (RU)\n- Iran (IR)\n- Syria (SY)\n- Vietnam (VN)\n- Nigeria (NG)\n- Belarus (BY)\n- Turkey (TR)",
    links: [{ title: "Cloudflare Geo-blocking", url: "https://developers.cloudflare.com/waf/tools/geo-blocking/" }],
  },
  {
    title: "How to Implement Geo-blocking",
    category: "Geo-blocking",
    difficulty: "Advanced",
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
    difficulty: "Intermediate",
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
    difficulty: "Beginner",
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
  {
    title: "Implement Two-Factor Authentication (2FA)",
    category: "Authentication",
    difficulty: "Intermediate",
    description:
      "Two-factor authentication adds an extra layer of security by requiring users to provide two forms of identification before accessing their accounts.",
    code: "// Example using speakeasy for TOTP\nconst speakeasy = require('speakeasy');\n\n// Generate secret\nconst secret = speakeasy.generateSecret({ length: 20 });\n\n// Verify token\nconst verified = speakeasy.totp.verify({\n  secret: secret.base32,\n  encoding: 'base32',\n  token: userToken\n});",
    links: [
      {
        title: "OWASP MFA Cheat Sheet",
        url: "https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html",
      },
      { title: "Google Authenticator", url: "https://github.com/google/google-authenticator" },
    ],
  },
  {
    title: "Secure Password Storage",
    category: "Authentication",
    difficulty: "Intermediate",
    description:
      "Never store passwords in plain text. Use strong hashing algorithms like bcrypt, scrypt, or Argon2 with proper salting.",
    code: "// Using bcrypt in Node.js\nconst bcrypt = require('bcrypt');\nconst saltRounds = 12;\n\n// Hash password\nconst hash = await bcrypt.hash(password, saltRounds);\n\n// Verify password\nconst match = await bcrypt.compare(password, hash);",
    links: [
      {
        title: "OWASP Password Storage Cheat Sheet",
        url: "https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html",
      },
      { title: "bcrypt npm package", url: "https://www.npmjs.com/package/bcrypt" },
    ],
  },
  {
    title: "Session Management Best Practices",
    category: "Authentication",
    difficulty: "Advanced",
    description:
      "Proper session management prevents session hijacking and fixation attacks. Regenerate session IDs after login, set appropriate timeouts, and invalidate sessions on logout.",
    code: "// Express.js session configuration\napp.use(session({\n  secret: process.env.SESSION_SECRET,\n  resave: false,\n  saveUninitialized: false,\n  cookie: {\n    secure: true,\n    httpOnly: true,\n    sameSite: 'strict',\n    maxAge: 3600000 // 1 hour\n  }\n}));",
    links: [
      {
        title: "OWASP Session Management Cheat Sheet",
        url: "https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html",
      },
    ],
  },
  {
    title: "API Rate Limiting",
    category: "API Security",
    difficulty: "Intermediate",
    description:
      "Rate limiting protects your API from abuse, brute force attacks, and denial of service. Implement limits based on IP, user, or API key.",
    code: "// Express rate limiter\nconst rateLimit = require('express-rate-limit');\n\nconst limiter = rateLimit({\n  windowMs: 15 * 60 * 1000, // 15 minutes\n  max: 100, // limit each IP to 100 requests per window\n  message: 'Too many requests, please try again later.'\n});\n\napp.use('/api/', limiter);",
    links: [
      { title: "OWASP API Security Top 10", url: "https://owasp.org/www-project-api-security/" },
      { title: "express-rate-limit", url: "https://www.npmjs.com/package/express-rate-limit" },
    ],
  },
  {
    title: "Secure API Authentication with JWT",
    category: "API Security",
    difficulty: "Advanced",
    description:
      "JSON Web Tokens (JWT) provide stateless authentication for APIs. Use short expiration times, secure signing algorithms, and never store sensitive data in the payload.",
    code: "// JWT best practices\nconst jwt = require('jsonwebtoken');\n\n// Sign token with RS256 (asymmetric)\nconst token = jwt.sign(\n  { userId: user.id, role: user.role },\n  privateKey,\n  { algorithm: 'RS256', expiresIn: '15m' }\n);\n\n// Always verify tokens\nconst decoded = jwt.verify(token, publicKey);",
    links: [
      { title: "JWT Best Practices", url: "https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/" },
      {
        title: "OWASP JWT Cheat Sheet",
        url: "https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html",
      },
    ],
  },
  {
    title: "CORS Configuration",
    category: "API Security",
    difficulty: "Intermediate",
    description:
      "Cross-Origin Resource Sharing (CORS) controls which domains can access your API. Never use wildcard (*) in production for sensitive endpoints.",
    code: "// Express CORS configuration\nconst cors = require('cors');\n\nconst corsOptions = {\n  origin: ['https://yourdomain.com', 'https://app.yourdomain.com'],\n  methods: ['GET', 'POST', 'PUT', 'DELETE'],\n  allowedHeaders: ['Content-Type', 'Authorization'],\n  credentials: true,\n  maxAge: 86400\n};\n\napp.use(cors(corsOptions));",
    links: [
      { title: "MDN: CORS", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS" },
      { title: "OWASP CORS", url: "https://owasp.org/www-community/attacks/CORS_OriginHeaderScrutiny" },
    ],
  },
  {
    title: "Secure Cookie Configuration",
    category: "Cookies",
    difficulty: "Beginner",
    description:
      "Cookies should be configured with security flags to prevent theft and misuse. Always use Secure, HttpOnly, and SameSite attributes.",
    code: "Set-Cookie: sessionId=abc123; Secure; HttpOnly; SameSite=Strict; Path=/; Max-Age=3600\n\n// In Express.js\nres.cookie('sessionId', 'abc123', {\n  secure: true,\n  httpOnly: true,\n  sameSite: 'strict',\n  maxAge: 3600000\n});",
    links: [
      { title: "MDN: Set-Cookie", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie" },
      { title: "OWASP Secure Cookie Attribute", url: "https://owasp.org/www-community/controls/SecureCookieAttribute" },
    ],
  },
  {
    title: "Cookie Prefixes for Extra Security",
    category: "Cookies",
    difficulty: "Advanced",
    description: "Cookie prefixes (__Secure- and __Host-) provide additional security guarantees enforced by browsers.",
    code: "// __Secure- prefix: requires Secure flag\nSet-Cookie: __Secure-sessionId=abc123; Secure; Path=/\n\n// __Host- prefix: requires Secure, no Domain, Path must be /\nSet-Cookie: __Host-sessionId=abc123; Secure; Path=/",
    links: [
      {
        title: "MDN: Cookie Prefixes",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#cookie_prefixes",
      },
    ],
  },
  {
    title: "Prevent SQL Injection",
    category: "Database",
    difficulty: "Beginner",
    description:
      "SQL injection is one of the most common and dangerous vulnerabilities. Always use parameterized queries or prepared statements, never concatenate user input into SQL.",
    code: "// BAD - vulnerable to SQL injection\nconst query = `SELECT * FROM users WHERE id = ${userId}`;\n\n// GOOD - parameterized query\nconst query = 'SELECT * FROM users WHERE id = ?';\ndb.query(query, [userId]);\n\n// GOOD - using ORM (Prisma example)\nconst user = await prisma.user.findUnique({\n  where: { id: userId }\n});",
    links: [
      {
        title: "OWASP SQL Injection Prevention",
        url: "https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html",
      },
      { title: "Bobby Tables", url: "https://bobby-tables.com/" },
    ],
  },
  {
    title: "Database Connection Security",
    category: "Database",
    difficulty: "Intermediate",
    description:
      "Secure your database connections with SSL/TLS, use least-privilege accounts, and never expose databases directly to the internet.",
    code: "// PostgreSQL with SSL\nconst pool = new Pool({\n  host: process.env.DB_HOST,\n  user: process.env.DB_USER,\n  password: process.env.DB_PASSWORD,\n  database: process.env.DB_NAME,\n  ssl: {\n    rejectUnauthorized: true,\n    ca: fs.readFileSync('/path/to/ca-cert.pem')\n  }\n});",
    links: [
      { title: "PostgreSQL SSL Support", url: "https://www.postgresql.org/docs/current/ssl-tcp.html" },
      {
        title: "MySQL SSL Connections",
        url: "https://dev.mysql.com/doc/refman/8.0/en/using-encrypted-connections.html",
      },
    ],
  },
  {
    title: "Input Validation and Sanitization",
    category: "Best Practices",
    difficulty: "Beginner",
    description:
      "Always validate and sanitize user input on both client and server side. Use allowlists over denylists when possible.",
    code: "// Using Zod for validation\nimport { z } from 'zod';\n\nconst userSchema = z.object({\n  email: z.string().email(),\n  age: z.number().min(18).max(120),\n  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/)\n});\n\n// Validate input\nconst result = userSchema.safeParse(userInput);",
    links: [
      {
        title: "OWASP Input Validation Cheat Sheet",
        url: "https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html",
      },
      { title: "Zod Documentation", url: "https://zod.dev/" },
    ],
  },
]);

const filteredTips = computed(() => {
  let result = tips.value;

  // Filter by category
  if (activeCategory.value !== "All") {
    result = result.filter((tip) => tip.category === activeCategory.value);
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (tip) =>
        tip.title.toLowerCase().includes(query) ||
        tip.description.toLowerCase().includes(query) ||
        tip.category.toLowerCase().includes(query)
    );
  }

  return result;
});

const copyToClipboard = async (code: string) => {
  try {
    await navigator.clipboard.writeText(code);
  } catch (err) {
    console.error("Failed to copy code:", err);
  }
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Beginner":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Intermediate":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Advanced":
      return "bg-rose-50 text-rose-700 border-rose-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
};

const getCategoryVariant = (category: string): string => {
  const variants: Record<string, string> = {
    Headers: "info",
    Transport: "success",
    Content: "warning",
    Forms: "error",
    "Geo-blocking": "secondary",
    "Best Practices": "primary",
    Authentication: "info",
    "API Security": "warning",
    Cookies: "success",
    Database: "error",
  };
  return variants[category] || "default";
};
</script>
