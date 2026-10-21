import {loadSettings} from '../src/configs-$id/settings.js';
import {initializePractice} from './db-lib.mjs';
try { console.log('Practice database ready:',await initializePractice(loadSettings())); }
catch(err) {console.error('Init failed:',err.code || err.message); process.exitCode=1;}
