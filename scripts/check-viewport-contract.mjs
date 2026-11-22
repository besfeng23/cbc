import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const css=readFileSync(new URL('../styles.css',import.meta.url),'utf8');
assert.match(html,/<meta name="viewport" content="width=device-width, initial-scale=1(?:\.0)?, viewport-fit=cover"/i);
for (const width of ['1120px','700px','380px']) assert.ok(css.includes('@media(max-width:'+width+')'),'missing responsive breakpoint '+width);
assert.match(css,/100svh/,'mobile viewport height should use dynamic viewport units');
assert.match(css,/--safe-bottom/,'safe-area inset should be used for mobile controls');
console.log('Changi responsive viewport contract passed at 1120, 700 and 380 CSS breakpoints.');
