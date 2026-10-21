import {mkdtemp,readFile,cp,symlink,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {execFileSync,spawnSync} from 'node:child_process';
const index=process.argv.indexOf('--template');
if(index<0||!process.argv[index+1]){console.error('Usage: npm run verify:template -- --template /absolute/path/teacher-template.zip');process.exit(1);}
const root=fileURLToPath(new URL('../',import.meta.url));const temp=await mkdtemp(join(tmpdir(),'int161-template-'));
try{
 execFileSync('python3',['-c',`import zipfile,pathlib,sys
with zipfile.ZipFile(sys.argv[1]) as z:
 for i in z.infolist():
  p=pathlib.PurePosixPath(i.filename)
  if p.is_absolute() or '..' in p.parts or '\\\\' in i.filename: raise ValueError('Unsafe ZIP path')
  if '__MACOSX' in p.parts or p.name=='.DS_Store': continue
  if (i.external_attr >> 16)&0o170000==0o120000: raise ValueError('ZIP symlink rejected')
  z.extract(i,sys.argv[2])`,resolve(process.argv[index+1]),temp]);
 const target=join(temp,'node-express-esm-template');
 const pkg=JSON.parse(await readFile(join(target,'package.json'),'utf8'));
 if(pkg.type!=='module'||!pkg.dependencies?.express?.match(/^\^?5\./)||!pkg.dependencies?.mysql2?.match(/^\^?3\./)||!pkg.dependencies?.['http-status']?.match(/^\^?2\./))throw new Error('Unexpected teacher template dependencies; inspect before migrating');
 const source=join(root,'reference-app/src');
 const files=['app.js','configs-$id','routes-$id','services-$id','repositories-$id','mappers-$id','middlewares-$id'];
 for(const name of files)await cp(join(source,name),join(target,'src',name),{recursive:true});
 await symlink(join(root,'node_modules'),join(target,'node_modules'),'dir');
 const result=spawnSync(process.execPath,['--test','tests/integration.test.js'],{cwd:root,env:{...process.env,KIT_VERIFY_APP_URL:pathToFileURL(join(target,'src/app.js')).href},stdio:'inherit'});
 if(result.status!==0)throw new Error('Migrated teacher-template contracts failed');
 console.log('PASS: disposable teacher template; original package retained; same real-MySQL API contracts');
}finally{await rm(temp,{recursive:true,force:true});}
