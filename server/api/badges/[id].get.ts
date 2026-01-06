import { defineEventHandler, getRouterParam, getQuery, createError, setHeader } from 'h3';
import { db } from '../../utils/db';
import { scans, certificates } from '../../database/schema';
import { eq } from 'drizzle-orm';

  /* 
    COLORS:
    Updated to remove "AI purple". Using authoritative Security Blue, Success Green, Warning Amber, Danger Red. 
  */
  const COLORS = {
    success: '#059669', // emerald-600
    warning: '#d97706', // amber-600
    danger: '#dc2626',  // red-600
    neutral: '#475569', // slate-600
    blue: '#2563eb',    // blue-600 (Security Blue)
    dark: '#0f172a'     // slate-900
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return COLORS.success;
    if (score >= 60) return COLORS.warning;
    return COLORS.danger;
  };

  /* 
    STYLE 1: SHIELD - Premium Trust Badge
    - Shield icon with checkmark
    - Gradient background
    - Professional typography
    - Eye-catching design for social proof
  */
  const generateShieldSvg = (score: number, color: string) => {
    return `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="48" viewBox="0 0 200 48" fill="none">
      <defs>
        <linearGradient id="bgGrad" x1="0" y1="0" x2="200" y2="48">
          <stop offset="0%" stop-color="#0f172a"/>
          <stop offset="100%" stop-color="#1e293b"/>
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <!-- Background -->
      <rect width="200" height="48" rx="6" fill="url(#bgGrad)"/>
      <rect x="1" y="1" width="198" height="46" rx="5" fill="none" stroke="white" stroke-opacity="0.1"/>
      
      <!-- Shield Icon with Checkmark -->
      <g transform="translate(10, 6)">
        <path d="M18 2C13 4.5 9 4.5 4 2C4 2 4 16 4 20C4 28 11 33 18 38C25 33 32 28 32 20C32 16 32 2 32 2C27 4.5 23 4.5 18 2Z" fill="${color}" stroke="white" stroke-width="1.5" stroke-opacity="0.3"/>
        <path d="M12 20L16 24L25 15" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)"/>
      </g>
      
      <!-- Text -->
      <text x="52" y="19" font-family="system-ui, -apple-system, sans-serif" font-size="8" fill="#94a3b8" font-weight="600" letter-spacing="1">SECURITY VERIFIED</text>
      <text x="52" y="35" font-family="system-ui, -apple-system, sans-serif" font-size="14" fill="white" font-weight="700">BlackBoxAudit</text>
      
      <!-- Score Number -->
      <text x="175" y="30" font-family="system-ui, -apple-system, sans-serif" font-size="18" fill="${color}" text-anchor="middle" font-weight="800">${score}</text>
    </svg>
    `.trim();
  };

  /* 
    STYLE 2: COMPACT - Clean Horizontal Bar
    - Minimalist design for footers
    - Clear score display
    - Subtle but professional
  */
  const generateCompactSvg = (score: number, color: string) => {
    return `
    <svg xmlns="http://www.w3.org/2000/svg" width="140" height="28" viewBox="0 0 140 28" fill="none">
      <defs>
        <linearGradient id="barGrad" x1="0" y1="0" x2="140" y2="0">
          <stop offset="0%" stop-color="#1e293b"/>
          <stop offset="100%" stop-color="#334155"/>
        </linearGradient>
      </defs>
      <rect width="140" height="28" rx="4" fill="url(#barGrad)"/>
      <!-- Checkmark circle -->
      <circle cx="16" cy="14" r="8" fill="${color}"/>
      <path d="M12 14L15 17L20 11" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- Text -->
      <text x="30" y="18" font-family="system-ui, sans-serif" font-size="10" fill="white" font-weight="600">Secured</text>
      <!-- Score pill -->
      <rect x="80" y="6" width="54" height="16" rx="8" fill="${color}"/>
      <text x="107" y="18" font-family="system-ui, sans-serif" font-size="10" fill="white" text-anchor="middle" font-weight="700">Score ${score}</text>
    </svg>
    `.trim();
  };

  /* 
    STYLE 3: SEAL - Circular Trust Stamp
    - Official seal/stamp look
    - Prominent verification mark
    - High trust signal
  */
  const generateSealSvg = (score: number, color: string) => {
    return `
    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80" fill="none">
      <defs>
        <linearGradient id="sealGrad" x1="0" y1="0" x2="80" y2="80">
          <stop offset="0%" stop-color="${color}"/>
          <stop offset="100%" stop-color="${color}cc"/>
        </linearGradient>
      </defs>
      <!-- Outer ring -->
      <circle cx="40" cy="40" r="38" fill="url(#sealGrad)" stroke="white" stroke-width="2" stroke-opacity="0.2"/>
      <circle cx="40" cy="40" r="32" fill="none" stroke="white" stroke-width="1" stroke-opacity="0.3" stroke-dasharray="4 2"/>
      <!-- Inner circle -->
      <circle cx="40" cy="40" r="26" fill="white"/>
      <!-- Large Checkmark in center -->
      <path d="M28 40L36 48L54 30" stroke="${color}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- VERIFIED text -->
      <text x="40" y="60" font-family="system-ui, sans-serif" font-size="7" fill="#475569" text-anchor="middle" font-weight="700" letter-spacing="0.5">VERIFIED</text>
    </svg>
    `.trim();
  };

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const query = getQuery(event);
  const style = query.style || 'shield'; // default to shield

  if (!id) {
    throw createError({ statusCode: 400, message: "Missing certificate ID" });
  }

  const result = db.select({
    score: scans.score,
  })
  .from(certificates)
  .innerJoin(scans, eq(certificates.scanId, scans.id))
  .where(eq(certificates.id, id))
  .get();

  if (!result) {
     /* Return a fallback "Unverified" badge instead of 404 image to avoid broken images on client sites */
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="120" height="28" viewBox="0 0 120 28" fill="none">
        <rect width="120" height="28" rx="4" fill="#94a3b8"/>
        <text x="60" y="19" font-family="sans-serif" font-size="12" fill="white" text-anchor="middle" font-weight="bold">UNVERIFIED</text>
      </svg>`.trim();
    setHeader(event, 'Content-Type', 'image/svg+xml');
    return svg;
  }

  const color = getScoreColor(result.score);
  let svg = '';

  switch(style) {
      case 'compact':
          svg = generateCompactSvg(result.score, color);
          break;
      case 'seal':
          svg = generateSealSvg(result.score, color);
          break;
      case 'shield':
      default:
          svg = generateShieldSvg(result.score, color);
          break;
  }

  setHeader(event, 'Content-Type', 'image/svg+xml');
  setHeader(event, 'Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
  
  return svg;
});
