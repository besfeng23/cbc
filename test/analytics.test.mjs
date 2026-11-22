import test from 'node:test';
import assert from 'node:assert/strict';
import { buildAnalyticsConfig } from '../lib/analytics-config.js';
import { readFileSync } from 'node:fs';
const read = file => readFileSync(new URL('../' + file, import.meta.url), 'utf8');

test('Changi analytics config reads only the requested public environment names', () => {
 const config = buildAnalyticsConfig({
  NEXT_PUBLIC_POSTHOG_KEY: 'phc_0123456789abcdefghijklmnopqrstuv',
  NEXT_PUBLIC_POSTHOG_HOST: 'https://us.i.posthog.com',
  NEXT_PUBLIC_GA_MEASUREMENT_ID: 'G-95J35L1242',
  POSTHOG_PERSONAL_API_KEY: 'server-secret-must-not-be-returned',
  PLP_POSTHOG_PROJECT_TOKEN: 'old-token',
  PLP_POSTHOG_HOST: 'https://old-host.example'
 });
 assert.equal(config.siteKey, 'changi');
 assert.deepEqual(config.posthog, {token:'phc_0123456789abcdefghijklmnopqrstuv',host:'https://us.i.posthog.com',siteKey:'changi'});
 assert.equal(config.googleId, 'G-95J35L1242');
 assert.equal(JSON.stringify(config).includes('server-secret'), false);
});
test('legacy PLP_POSTHOG variables are ignored and invalid hosts fail closed', () => {
 const config = buildAnalyticsConfig({PLP_POSTHOG_PROJECT_TOKEN:'phc_0123456789abcdefghijklmnopqrstuv',PLP_POSTHOG_HOST:'https://us.i.posthog.com'});
 assert.equal(config.posthog, null);
 assert.equal(config.googleId, null);
 const bad = buildAnalyticsConfig({NEXT_PUBLIC_POSTHOG_KEY:'phc_0123456789abcdefghijklmnopqrstuv',NEXT_PUBLIC_POSTHOG_HOST:'https://attacker.example'});
 assert.equal(bad.posthog, null);
});
test('public analytics loader uses consent gating, masks inputs, disables recordings and blocks private routes', () => {
 const js = read('analytics.js');
 assert.match(js,/readConsent/);
 assert.match(js,/disable_session_recording:\s*true/);
 assert.match(js,/maskAllInputs:\s*true/);
 assert.match(js,/capture_performance:\s*true/);
 assert.match(js,/PRIVATE_ROUTE/);
 assert.match(js,/site_key: 'changi'/);
 assert.doesNotMatch(js,/startSessionRecording\(/);
 assert.doesNotMatch(js,/POSTHOG_PERSONAL_API_KEY/);
});
test('public HTML loads analytics separately from the private routes', () => {
 const html = read('index.html');
 assert.match(html,/analytics-consent\.css/);
 assert.match(html,/analytics\.js/);
 assert.match(html,/name="robots" content="noindex,nofollow"/);
 assert.match(html,/id="interest-form"/);
});
test('Changi site emits page navigation and enquiry-interest events without collecting form fields', () => {
 const js = read('site.js');
 assert.match(js,/plp:navigation/);
 assert.match(js,/plpTrack\("enquiry_interest"/);
 assert.match(js,/plpTrack\("enquiry_draft_opened"/);
 assert.doesNotMatch(js,/plpTrack\([^\n]*(?:name|email)/i);
});
test('Vercel static build keeps API functions separate and retains public route rewrites', () => {
 const config = JSON.parse(read('vercel.json'));
 assert.equal(config.buildCommand,'npm run build');
 assert.equal(config.outputDirectory,'dist');
 assert.ok(config.rewrites.some(x=>x.source==='/membership'&&x.destination==='/'));
});
