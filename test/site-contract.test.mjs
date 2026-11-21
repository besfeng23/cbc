import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = file => readFileSync(new URL('../' + file, import.meta.url), 'utf8');
const html = source('index.html');
const script = source('site.js');
const config = JSON.parse(source('vercel.json'));

test('Changi deep links remain reachable through static routing', () => {
  const pages = ['/the-club', '/stay', '/dining', '/club-life', '/club', '/membership', '/events', '/gallery', '/contact'];
  for (const page of pages) {
    assert.ok(config.rewrites.some(rule => rule.source === page && rule.destination === '/'), page);
    assert.ok(html.includes('data-page="' + page + '"'), page);
    assert.ok(script.includes('"' + page + '"'), page);
  }
});

test('Pearl Club identity is consistent in public navigation and email enquiry', () => {
  assert.match(html, /Pearl Club 60\+/);
  assert.match(html, /General Pearl Club interest/);
  assert.match(script, /General Pearl Club interest/);
  assert.match(script, /Pearl Club Changi/);
  assert.doesNotMatch(html + script, /PLP Club/);
  assert.match(script, /No enquiry is submitted until you send it/);
});

test('Singapore preview does not represent membership or residential services as operational', () => {
  assert.match(html, /name="robots" content="noindex,nofollow"/);
  assert.match(html, /collaboration are proposed, not confirmed/);
  assert.match(html, /separate\. They are not interchangeable/);
  assert.match(html, /residential assessment and admission process/);
  assert.match(html, /No residential enrollment is open/);
  assert.doesNotMatch(html, /SGD\s*6,?000|S\$\s*6,?000/i);
});
