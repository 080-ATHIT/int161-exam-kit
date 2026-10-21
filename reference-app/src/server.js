import {loadSettings} from './configs-$id/settings.js';
import {createDb} from './configs-$id/db-config.js';
import {createApp} from './app.js';
import {assertPracticeDatabase} from '../../scripts/db-lib.mjs';
const config=loadSettings(),db=createDb(config);
try {
 await assertPracticeDatabase(db);
 const server=createApp({db,...config}).listen(config.appPort,'127.0.0.1',()=>console.log(`Reference API: http://127.0.0.1:${config.appPort}/api/${config.studentId}`));
 server.on('error',async err=>{console.error('Start failed:',err.code||'SERVER_ERROR');await db.end();process.exitCode=1;});
 for(const signal of ['SIGINT','SIGTERM'])process.once(signal,()=>server.close(async()=>{await db.end();process.exit();}));
} catch(err){console.error('Start failed:',err.code||err.message);await db.end();process.exitCode=1;}
