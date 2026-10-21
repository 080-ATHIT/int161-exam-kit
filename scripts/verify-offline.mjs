// macOS verification only: block outbound network except localhost for the test process tree.
import {mkdtemp,symlink,rm,readdir,readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync,spawnSync} from 'node:child_process';
if(process.platform!=='darwin')throw new Error('This verification uses macOS sandbox-exec. Prepare dependencies and test manually offline on other OSes.');
const root=fileURLToPath(new URL('../',import.meta.url));const temp=await mkdtemp(join(tmpdir(),'int161-offline-'));
const {version}=JSON.parse(await readFile(join(root,'package.json'),'utf8'));
const archive=process.argv[2]||join(root,`artifacts/int161-exam-kit-v${version}.zip`);
try{
 execFileSync('python3',['-c',`import zipfile,pathlib,sys
with zipfile.ZipFile(sys.argv[1]) as z:
 for i in z.infolist():
  p=pathlib.PurePosixPath(i.filename)
  if p.is_absolute() or '..' in p.parts or any(x in ('.env','node_modules','.git') for x in p.parts): raise ValueError('Unsafe archive entry')
 z.extractall(sys.argv[2])`,archive,temp]);
 const target=join(temp,'int161-exam-kit');await symlink(join(root,'node_modules'),join(target,'node_modules'),'dir');
 const profile='(version 1)(allow default)(deny network-outbound)(allow network-outbound (remote ip "localhost:*"))';
 const probe=`import net from 'node:net';await new Promise((resolve,reject)=>{const s=net.connect({host:'1.1.1.1',port:443});s.setTimeout(2000,()=>{s.destroy();reject(new Error('Unproven: timeout instead of policy denial'));});s.on('connect',()=>{s.destroy();reject(new Error('External network unexpectedly permitted'));});s.on('error',e=>{if(!['EPERM','EACCES'].includes(e.code))reject(e);else{console.log('External IP blocked by OS policy');resolve();}});});`;
 execFileSync('/usr/bin/sandbox-exec',['-p',profile,process.execPath,'--input-type=module','-e',probe],{cwd:target,stdio:'inherit'});
 const tests=(await readdir(join(target,'tests'))).filter(x=>x.endsWith('.test.js')).map(x=>'tests/'+x);
 const result=spawnSync('/usr/bin/sandbox-exec',['-p',profile,process.execPath,'--test','--test-concurrency=1',...tests],{cwd:target,env:process.env,stdio:'inherit'});
 if(result.status!==0)throw new Error('Unpacked archive failed offline tests');
 console.log('PASS: unpacked source ZIP; prepared local dependencies; OS denies external network; local MySQL allowed');
}finally{await rm(temp,{recursive:true,force:true});}
