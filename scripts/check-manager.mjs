import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { Script } from 'node:vm';
const html=readFileSync('index.html','utf8');
const openingTags=[...html.matchAll(/<script[^>]*>/gi)];
const inlineTags=openingTags.filter(match=>!match[0].includes('src='));
assert.equal(inlineTags.length,1,'expected one inline application script');
const start=inlineTags[0].index+inlineTags[0][0].length;
const end=html.indexOf('</script>',start);
assert.notEqual(end,-1,'inline script must close');
const app=html.slice(start,end);
new Script(app,{filename:'store-manager-inline.js'});
for(const area of ['products','campaigns','orders']) {
  assert.ok(app.includes('if(!persist(STORAGE.'+area+','),'writes to '+area+' must handle storage failure');
}
assert.match(app,/if\(!persist\(STORAGE\.orders,data\.orders\)\)\{order\.status=previousStatus;select\.value=previousStatus;return\}/);
assert.ok(!app.includes('persist(STORAGE.products,data.products);closeProductModal()'));
assert.ok(!app.includes('persist(STORAGE.campaigns,data.campaigns);renderMarketing()'));
console.log('Store Manager inline syntax and persistence checks passed');
