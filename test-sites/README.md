# BlackBoxAudit Test Sites

This directory contains test websites designed to verify the functionality of the BlackBoxAudit security scanner. Each test site is configured with specific security settings to validate the scanner's ability to detect various security issues.

## Test Sites

### Test Site 1 (Insecure Configuration)

URL: http://localhost:3001/test1

Purposely configured with security issues to test scanner detection:

- Mixed content (HTTP resources on page)
- Missing security headers:
  - Content-Security-Policy
  - X-Frame-Options
  - X-Content-Type-Options
  - Strict-Transport-Security
  - X-XSS-Protection

Expected Scan Results:

- Should detect missing HTTPS
- Should detect all missing security headers
- Should detect mixed content issues

### Test Site 2 (Hardened but HTTP Only)

URL: http://localhost:3001/test2

Strengthens główne nagłówki bezpieczeństwa bez przejścia na HTTPS:

- CSP, X-Frame-Options, X-Content-Type-Options i X-XSS-Protection są ustawione poprawnie
- Brakuje jednak nagłówków związanych z prywatnością i cache:
  - Referrer-Policy
  - Permissions-Policy
  - Cache-Control (no-store / no-cache w przypadku wrażliwych danych)
- Ruch nadal odbywa się po HTTP (brak HSTS)

Expected Scan Results:

- High: Insecure Protocol (HTTP)
- Medium: Referrer-Policy, Permissions-Policy, Cache-Control restrictions
- Brak innych ostrzeżeń – pozwala szybko potwierdzić, że skaner odróżnia brakujące nagłówki od kompletnej konfiguracji

### Test Site 3 (Mixed Content Staging)

URL: http://localhost:3001/test3

Celowo miesza zasoby HTTP/HTTPS i nie ustawia większości nagłówków:

- Brak CSP, X-XSS-Protection, X-Content-Type-Options, X-Frame-Options
- Brak Referrer-Policy, Permissions-Policy, HSTS oraz restrykcji Cache-Control
- Na stronie znajdują się zasoby ładowane po HTTP (mixed content)

Expected Scan Results:

- High: Insecure Protocol + Mixed Content + brak głównych nagłówków (CSP, XSS, X-Content-Type, X-Frame)
- Medium: Referrer-Policy, Permissions-Policy, HSTS, Cache-Control
- Łącznie 10 problemów (6 high / 4 medium) – wynik bezpieczeństwa powinien wynosić 0/100

### Test Site 4 (Error Handling & Status Codes)

URL: http://localhost:3001/test4

Zachowuje się jak prosta aplikacja bez nagłówków bezpieczeństwa, ale udostępnia dodatkowe endpointy do testowania reakcji na kody HTTP:

- Główna strona: brak CSP, X-Frame-Options, X-Content-Type-Options, X-XSS-Protection
- Brak Referrer-Policy, Permissions-Policy, HSTS i Cache-Control
- Dostępne ścieżki `/test4/404`, `/500`, `/403`, `/401`, `/301` symulują różne odpowiedzi serwera

Expected Scan Results:

- High: Insecure Protocol + brak podstawowych nagłówków (CSP, XSS, X-Content-Type, X-Frame)
- Medium: Referrer-Policy, Permissions-Policy, HSTS, Cache-Control
- Dodatkowo można ręcznie weryfikować obsługę kodów statusu poprzez wywołania wskazanych endpointów

## Running the Tests

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Start the test server:

   ```bash
   pnpm start
   ```

3. Use the BlackBoxAudit scanner to test all URLs and compare results against the expected outcomes opisane powyżej.
