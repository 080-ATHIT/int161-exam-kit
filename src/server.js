import {loadSettings} from './configs-$id/settings.js';
import {createDb} from './configs-$id/db-config.js';
import {createApp} from './app.js';
import {assertAppDatabase} from './configs-$id/database-mode.js';
const config=loadSettings(),db=createDb(config);
try {
 await assertAppDatabase(db,config);
 const server=createApp({db,...config}).listen(config.appPort,'127.0.0.1',()=>console.log(`Template API: http://127.0.0.1:${config.appPort}/api/${config.studentId}`));
 server.on('error',async err=>{console.error('Start failed:',err.code||'SERVER_ERROR');await db.end();process.exitCode=1;});
 for(const signal of ['SIGINT','SIGTERM'])process.once(signal,()=>server.close(async()=>{await db.end();process.exit();}));
} catch(err){console.error('Start failed:',err.code||err.message);await db.end();process.exitCode=1;}
