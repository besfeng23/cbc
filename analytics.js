(() => {
  'use strict';
  const PRODUCTION_HOST = 'plp-changi.vercel.app';
  const ROUTES = new Set(['/', '/the-club', '/stay', '/dining', '/club-life', '/club', '/membership', '/events', '/gallery', '/contact']);
  const PRIVATE_ROUTE = /^\/(?:admin|owner)(?:\/|$)/i;
  const CONSENT_KEY = 'plp_analytics_consent_v2';
  const EVENTS = new Set(['enquiry_interest', 'enquiry_draft_opened', 'click_email', 'click_phone']);
  const INTERESTS = new Set(['General Pearl Club interest', 'Connection', 'Gentle wellbeing', 'Culture and learning', 'Coastal discovery']);
  const SAFE_PROPERTIES = new Set(['$device_type', '$browser', '$os', '$browser_version', '$os_version', '$viewport_width', '$viewport_height', '$screen_width', '$screen_height', '$event_type', '$el_tag_name', '$el_classes', 'metric_name', 'metric_value', 'metric_rating', 'metric_delta', 'metric_id', 'metric_navigation_type', 'interest_type']);
  let config = null;
  let consent = 'unset';
  let posthog = null;
  let posthogPromise = null;
  let gtagReady = false;
  let lastPath = '';

  function publicPath() {
    try {
      if (window.location.hostname !== PRODUCTION_HOST) return null;
      const path = decodeURI(window.location.pathname).replace(/\/+$/, '') || '/';
      if (PRIVATE_ROUTE.test(path) || !ROUTES.has(path)) return null;
      return path;
    } catch { return null; }
  }
  function readConsent() {
    try {
      const value = localStorage.getItem(CONSENT_KEY);
      return value === 'allow' || value === 'deny' ? value : 'unset';
    } catch { return 'unset'; }
  }
  function safeReferrer(value) {
    try {
      if (!value) return '';
      const url = new URL(value);
      return url.origin === window.location.origin ? '' : url.origin;
    } catch { return ''; }
  }
  function safeProperties(input = {}) {
    const out = {};
    for (const [key, value] of Object.entries(input || {})) {
      if (!SAFE_PROPERTIES.has(key)) continue;
      if (key === 'interest_type') {
        if (INTERESTS.has(value)) out[key] = value;
      } else if (typeof value === 'string' && value.length <= 120) out[key] = value;
      else if (typeof value === 'number' && Number.isFinite(value)) out[key] = value;
    }
    const path = publicPath();
    if (!path) return null;
    out.site_key = 'changi';
    out.$pathname = path;
    out.$current_url = window.location.origin + path;
    out.$referrer = safeReferrer(document.referrer);
    return out;
  }
  function loadPostHog() {
    if (!config?.posthog) return Promise.resolve(null);
    if (posthogPromise) return posthogPromise;
    posthogPromise = new Promise((resolve, reject) => {
      const p = window.posthog = window.posthog || [];
      p._i = p._i || [];
      p.__SV = p.__SV || 1;
      const methods = ['capture', 'opt_in_capturing', 'opt_out_capturing', 'get_distinct_id', 'get_session_id', 'startSessionRecording', 'stopSessionRecording'];
      for (const method of methods) {
        if (typeof p[method] !== 'function') p[method] = function () { p.push([method, ...arguments]); };
      }
      p.init = function (token, options, name) { p._i.push([token, options, name || 'posthog']); };
      const host = config.posthog.host;
      const script = document.createElement('script');
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.src = host.replace('.i.posthog.com', '-assets.i.posthog.com') + '/static/array.js';
      script.onload = () => { posthog = window.posthog; resolve(posthog); };
      script.onerror = () => { posthogPromise = null; reject(new Error('PostHog SDK unavailable')); };
      p.init(config.posthog.token, {
        api_host: host,
        defaults: '2026-08-30',
        capture_pageview: false,
        capture_pageleave: true,
        capture_performance: true,
        autocapture: {
          url_allowlist: [/^https:\/\/plp-changi\.vercel\.app\//],
          dom_event_allowlist: ['click'],
          element_allowlist: ['a', 'button'],
          css_selector_ignorelist: ['form', 'input', 'textarea', 'select', '[data-sensitive]']
        },
        disable_session_recording: true,
        maskAllInputs: true,
        person_profiles: 'never',
        opt_out_capturing_by_default: true,
        before_send(event) {
          const path = publicPath();
          if (!path || !event || !event.event) return null;
          if (!['$pageview', '$pageleave', '$web_vitals', '$autocapture', ...EVENTS].includes(event.event)) return null;
          const properties = safeProperties(event.properties);
          if (!properties) return null;
          event.properties = properties;
          return event;
        },
        loaded(client) {
          posthog = client;
          if (consent === 'allow' && publicPath()) client.opt_in_capturing();
          recordPage();
        }
      });
      document.head.appendChild(script);
    });
    return posthogPromise;
  }
  function loadGoogleAnalytics() {
    const id = config?.googleId;
    if (!id || gtagReady) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    window.gtag('consent', 'update', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    window.gtag('js', new Date());
    window.gtag('config', id, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false });
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    document.head.appendChild(script);
    gtagReady = true;
  }
  function recordPage() {
    const path = publicPath();
    if (consent !== 'allow' || !path || path === lastPath) return;
    lastPath = path;
    const currentUrl = window.location.origin + path;
    const properties = { site_key: 'changi', $pathname: path, $current_url: currentUrl, $referrer: safeReferrer(document.referrer) };
    if (posthog) posthog.capture('$pageview', properties);
    if (typeof window.gtag === 'function' && config?.googleId) {
      window.gtag('event', 'page_view', { page_location: currentUrl, page_path: path, page_title: document.title });
    }
  }
  function track(name, properties = {}) {
    if (consent !== 'allow' || !EVENTS.has(name) || !publicPath()) return;
    const safe = safeProperties(properties);
    if (!safe) return;
    if (posthog) posthog.capture(name, safe);
    if (typeof window.gtag === 'function' && config?.googleId) {
      const params = {};
      if (safe.interest_type) params.interest_type = safe.interest_type;
      window.gtag('event', name, params);
    }
  }
  function hideConsent() { document.getElementById('plp-analytics-consent')?.remove(); }
  function showConsent() {
    let panel = document.getElementById('plp-analytics-consent');
    if (!panel) {
      panel = document.createElement('section');
      panel.id = 'plp-analytics-consent';
      panel.className = 'plp-analytics-consent';
      panel.setAttribute('role', 'dialog');
      panel.setAttribute('aria-label', 'Optional analytics preferences');
      panel.innerHTML = '<div class="plp-analytics-copy"><strong>Privacy preferences</strong><p>Optional analytics help us understand visits and improve the Changi website. Form fields are not captured and session recording is disabled.</p></div><div class="plp-analytics-actions"><button type="button" data-consent="deny">Decline</button><button type="button" data-consent="allow">Allow analytics</button></div>';
      panel.addEventListener('click', event => {
        const button = event.target.closest('[data-consent]');
        if (button) setConsent(button.dataset.consent);
      });
      document.body.appendChild(panel);
    }
    if (!document.getElementById('plp-analytics-settings')) {
      const settings = document.createElement('button');
      settings.id = 'plp-analytics-settings';
      settings.className = 'plp-analytics-settings';
      settings.type = 'button';
      settings.textContent = 'Privacy';
      settings.setAttribute('aria-label', 'Change analytics preferences');
      settings.addEventListener('click', showConsent);
      document.body.appendChild(settings);
    }
  }
  function setConsent(value) {
    if (value !== 'allow' && value !== 'deny') return;
    consent = value;
    try { localStorage.setItem(CONSENT_KEY, value); } catch {}
    if (value === 'allow') {
      loadGoogleAnalytics();
      loadPostHog().then(client => { if (client && publicPath()) { client.opt_in_capturing(); recordPage(); } }).catch(() => {});
    } else {
      if (posthog) { posthog.stopSessionRecording?.(); posthog.opt_out_capturing?.(); }
      if (config?.googleId) window['ga-disable-' + config.googleId] = true;
      if (typeof window.gtag === 'function') window.gtag('consent', 'update', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    }
    hideConsent();
  }
  window.plpTrack = track;
  window.addEventListener('plp:navigation', recordPage);
  window.addEventListener('popstate', recordPage);
  consent = readConsent();
  if (!publicPath()) return;
  fetch('/api/analytics-config', { credentials: 'same-origin', cache: 'no-store' })
    .then(response => response.ok ? response.json() : null)
    .then(value => {
      config = value;
      if (consent === 'allow') {
        loadGoogleAnalytics();
        loadPostHog().then(client => { if (client && publicPath()) { client.opt_in_capturing(); recordPage(); } }).catch(() => {});
      } else if (consent === 'unset') showConsent();
      else if (config?.googleId) window['ga-disable-' + config.googleId] = true;
    })
    .catch(() => { if (consent === 'unset') showConsent(); });
})();
