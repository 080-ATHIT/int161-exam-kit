import {execFileSync} from 'node:child_process';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
execFileSync('git',['diff','--exit-code','HEAD','--'],{cwd:root,stdio:'pipe'});
const files=execFileSync('git',['ls-files','-z'],{cwd:root,encoding:'utf8'}).split('\0').filter(Boolean);
for(const name of files){const parts=name.split('/');if(parts.some(p=>['.git','node_modules','artifacts','.env'].includes(p))||parts.some(p=>p.startsWith('.env.')&&p!=='.env.example'))throw new Error('Sensitive/excluded tracked path: '+name);}
const {version}=JSON.parse(await readFile(new URL('../package.json',import.meta.url),'utf8'));
await mkdir(new URL('../artifacts/',import.meta.url),{recursive:true});
const output=`artifacts/int161-exam-kit-v${version}.zip`;
execFileSync('python3',['-c',`import json,zipfile,sys
with zipfile.ZipFile(sys.argv[1],'w',zipfile.ZIP_DEFLATED) as z:
 for p in json.loads(sys.stdin.read()): z.write(p,'int161-exam-kit/'+p)`,output],{cwd:root,input:JSON.stringify(files)});
const sha=createHash('sha256').update(await readFile(new URL('../'+output,import.meta.url))).digest('hex');
await writeFile(new URL('../'+output+'.sha256',import.meta.url),`${sha}  ${output.split('/').pop()}\n`);
console.log(`${output} (${files.length} source files); SHA256 ${sha}`);
