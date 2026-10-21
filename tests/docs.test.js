import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {execFileSync} from 'node:child_process';
test('documentation links resolve and offline HTML has no external dependencies',async()=>{
 const chapters=['README.md','START-HERE.th.md',...['01-contract','02-crud','03-pagination-dto','04-errors-keys','05-template','06-offline'].map(x=>'guides/'+x+'.md'),'practice/worked-example.md','practice/independent-task.md','docs/VALIDATION.md'];
 for(const path of chapters){const source=await readFile(path,'utf8');for(const match of source.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)){if(!/^https?:/.test(match[1]))await access(resolve(dirname(path),match[1].split('#')[0]));}}
 const prior=await readFile('docs/offline-guide.html','utf8');execFileSync(process.execPath,['scripts/build-guide.mjs']);const html=await readFile('docs/offline-guide.html','utf8');assert.equal(html,prior,'generated HTML must match Markdown sources');
 assert.ok(!/<(?:script|link|img|iframe)\b/i.test(html));
 const ids=new Set([...html.matchAll(/id="([^"]+)"/g)].map(x=>x[1]));for(const a of html.matchAll(/href="#([^"]+)"/g))assert.ok(ids.has(a[1]),a[1]);
});
