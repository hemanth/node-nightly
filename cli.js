#!/usr/bin/env node
'use strict';
const spawn = require('cross-spawn').spawn;
const nodeNightly = require('./');
const existsSync = require('graceful-fs').existsSync;
const os = process.platform  === 'win32' ? 'win' : process.platform;
let args = process.argv.slice(2);

// Check for upgrade.
let index = args.indexOf('--upgrade');
if(!!~index) {
	nodeNightly.update().then(res => {
		if(res !== 'Installed') {
			console.log(res);
		}
		process.exit(0);
	}).catch(console.error);
} else if(!existsSync(`${__dirname}/node-nightly`)) {
	//First install
	console.log('Downloading the nightly version, hang on...');
	nodeNightly.install().catch(console.error);
} else {
	nodeNightly.check().then(updatedVersion => {
		if(updatedVersion) {
			console.log('\x1b[36m', 'New nightly available. To upgrade: `node-nightly --upgrade`' ,'\x1b[0m');
		}
		if(os === 'win'){
			spawn(`${__dirname}/node-nightly/node`, args, {stdio: 'inherit', env: process.env});
		} else{
			spawn(`${__dirname}/node-nightly/bin/node`, args, {stdio: 'inherit', env: process.env});			
		}
	}).catch(console.error);
}
