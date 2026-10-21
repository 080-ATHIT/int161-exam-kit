import {readFile,writeFile} from 'node:fs/promises';
export const chapters=['README.md','START-HERE.th.md','guides/01-contract.md','guides/02-crud.md','guides/03-pagination-dto.md','guides/04-errors-keys.md','guides/05-template.md','guides/06-offline.md','recipes/README.md','practice/worked-example.md','practice/independent-task.md','docs/VALIDATION.md'];
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const anchor=s=>'chapter-'+s.replace(/[^a-zA-Z0-9]/g,'-');
function inline(s){return esc(s).replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\[([^\]]+)\]\(([^)]+)\)/g,(_,label,url)=>{let target=url;if(!/^https?:/.test(url)){const normalized=url.replace(/^\.\.\//,'');target='#'+anchor(normalized==='docs/offline-guide.html'?'README.md':normalized);}return `<a href="${target}">${label}</a>`;});}
function render(source){
 let out='',code=false,list=false,table=false;
 const close=()=>{if(list){out+='</ul>';list=false;}if(table){out+='</tbody></table>';table=false;}};
 for(const line of source.split('\n')){
  if(line.startsWith('```')){close();out+=code?'</code></pre>':'<pre><code>';code=!code;continue;}
  if(code){out+=esc(line)+'\n';continue;}
  if(!line.trim()){close();continue;}
  const heading=/^(#{1,6}) (.*)/.exec(line);
  if(heading){close();out+=`<h${heading[1].length}>${inline(heading[2])}</h${heading[1].length}>`;continue;}
  if(line.startsWith('|')){if(/^\|[\s|:-]+\|$/.test(line))continue;const cells=line.split('|').slice(1,-1);if(!table){if(list){out+='</ul>';list=false;}out+='<table><tbody>';table=true;}out+='<tr>'+cells.map(c=>'<td>'+inline(c.trim())+'</td>').join('')+'</tr>';continue;}
  if(/^(- |\d+\. )/.test(line)){if(table){out+='</tbody></table>';table=false;}if(!list){out+='<ul>';list=true;}out+='<li>'+inline(line.replace(/^(- |\d+\. )/,''))+'</li>';continue;}
  close();out+='<p>'+inline(line)+'</p>';
 }
 close();if(code)throw new Error('Unclosed code fence');return out;
}
let sections='';
for(const path of chapters){const source=await readFile(new URL('../'+path,import.meta.url),'utf8');sections+=`<section id="${anchor(path)}">${render(source)}</section>`;}
const html=`<!doctype html><html lang="th"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>INT161 — คู่มือออฟไลน์</title><style>body{margin:0;background:#faf9f6;color:#242424;font:17px/1.85 system-ui,sans-serif}main{max-width:960px;margin:auto;padding:28px}nav{padding:20px;background:#eeeae2}a{color:#175f74}section{padding:20px 0;border-bottom:1px solid #ccc;scroll-margin:20px}h1,h2{line-height:1.4}pre{background:#eeeae2;padding:18px;overflow:auto;line-height:1.6}code{font-family:ui-monospace,monospace;font-size:.88em}table{border-collapse:collapse;width:100%;display:block;overflow:auto}td{padding:8px;border:1px solid #ccc;vertical-align:top}tr:first-child{font-weight:bold}@media print{body{background:white;font-size:12px}section{break-before:page}nav{display:none}pre{white-space:pre-wrap}}</style><main><nav><strong>INT161 — เปิดไฟล์นี้อ่านได้โดยไม่ต้องเปิด server</strong><ul>${chapters.map(p=>`<li><a href="#${anchor(p)}">${esc(p)}</a></li>`).join('')}</ul></nav>${sections}</main></html>`;
await writeFile(new URL('../docs/offline-guide.html',import.meta.url),html);console.log(`Built offline guide: ${chapters.length} chapters, no external assets`);
