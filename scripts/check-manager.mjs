import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { Script } from 'node:vm';
const html=readFileSync('index.html','utf8');
const scripts=[...html.matchAll(/<script[^>]*>([\\s\\S]*?)<\\/script>/gi)].map(match=>match[1]).filter(text=>text.trim());
assert.equal(scripts.length,1,'expected one inline application script');
const app=scripts[0];
new Script(app,{filename:'store-manager-inline.js'});
for(const area of ['products','campaigns','orders']) {
  assert.ok(app.includes('if(!persist(STORAGE.'+area+','),'writes to '+area+' must handle storage failure');
}
assert.match(app,/if\(!persist\(STORAGE\.orders,data\.orders\)\)\{order\.status=previousStatus;select\.value=previousStatus;return\}/);
assert.ok(!app.includes('persist(STORAGE.products,data.products);closeProductModal()'));
assert.ok(!app.includes('persist(STORAGE.campaigns,data.campaigns);renderMarketing()'));
console.log('Store Manager inline syntax and persistence checks passed');
