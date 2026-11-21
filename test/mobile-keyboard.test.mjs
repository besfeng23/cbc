import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../site.js', import.meta.url), 'utf8');

function harness(pathname = '/') {
  let keydown;
  let toggleClick;
  const document = {
    activeElement: null, title: '',
    body: { classList: { remove() {}, add() {} } },
    addEventListener(name, handler) { if (name === 'keydown') keydown = handler; },
    querySelectorAll() { return []; },
    querySelector() { return null; },
  };
  const focusable = () => ({ focus() { document.activeElement = this; } });
  const first = focusable();
  const last = focusable();
  const toggle = { ...focusable(), setAttribute() {},
    addEventListener(name, handler) { if (name === 'click') toggleClick = handler; } };
  const mobile = { hidden: true, style: {}, querySelector() { return first; },
    querySelectorAll() { return [first, last]; } };
  const header = { classList: { toggle() {} }, getBoundingClientRect() { return { bottom: 78 }; } };
  const lightboxClose = { focus() {}, addEventListener() {} };
  const lightbox = { querySelector() { return lightboxClose; }, addEventListener() {}, close() {}, showModal() {} };
  const interest = { addEventListener() {} };
  const main = focusable();
  document.getElementById = id => ({
    'site-header': header, 'mobile-nav': mobile, 'menu-toggle': toggle, content: main,
    lightbox, 'interest-form': interest,
  })[id] || null;
  const location = { pathname };
  const window = { scrollY: 0, addEventListener() {}, scrollTo() {}, location };
  runInNewContext(source, { document, window, location, history: { pushState() {} }, decodeURI });
  return { mobile, toggle, first, last, document, open: () => toggleClick(),
    key: (name, shiftKey = false) => {
      let prevented = false;
      keydown({ key: name, shiftKey, preventDefault() { prevented = true; } });
      return prevented;
    },
  };
}

test('mobile navigation traps Tab and Shift+Tab, then restores focus on Escape', () => {
  const app = harness();
  app.open();
  assert.equal(app.mobile.hidden, false);
  assert.equal(app.document.activeElement, app.first);
  assert.equal(app.key('Tab', true), true);
  assert.equal(app.document.activeElement, app.toggle);
  assert.equal(app.key('Tab', true), true);
  assert.equal(app.document.activeElement, app.last);
  assert.equal(app.key('Tab'), true);
  assert.equal(app.document.activeElement, app.toggle);
  assert.equal(app.key('Tab'), true);
  assert.equal(app.document.activeElement, app.first);
  assert.equal(app.key('Escape'), true);
  assert.equal(app.mobile.hidden, true);
  assert.equal(app.document.activeElement, app.toggle);
});

test('malformed percent escapes in direct URLs do not crash Changi routing', () => {
  const app = harness('/%E0%A4%A');
  assert.equal(app.mobile.hidden, true);
});
