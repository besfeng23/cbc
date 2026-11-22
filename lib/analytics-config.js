const POSTHOG_HOST_ALLOWLIST = new Set(['https://us.i.posthog.com']);
const SITE_KEY = 'changi';

export function buildAnalyticsConfig(env = process.env) {
  const token = typeof env.NEXT_PUBLIC_POSTHOG_KEY === 'string' && /^phc_[A-Za-z0-9_-]{20,}$/.test(env.NEXT_PUBLIC_POSTHOG_KEY)
    ? env.NEXT_PUBLIC_POSTHOG_KEY : null;
  const hostValue = typeof env.NEXT_PUBLIC_POSTHOG_HOST === 'string' ? env.NEXT_PUBLIC_POSTHOG_HOST.replace(/\/+$/, '') : '';
  const host = POSTHOG_HOST_ALLOWLIST.has(hostValue) ? hostValue : null;
  const posthog = token && host ? { token, host, siteKey: SITE_KEY } : null;
  const googleId = typeof env.NEXT_PUBLIC_GA_MEASUREMENT_ID === 'string' && /^G-[A-Z0-9]{6,}$/.test(env.NEXT_PUBLIC_GA_MEASUREMENT_ID)
    ? env.NEXT_PUBLIC_GA_MEASUREMENT_ID : null;
  return Object.freeze({ siteKey: SITE_KEY, posthog, googleId });
}
