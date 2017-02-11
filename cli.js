#!/usr/bin/env node
'use strict';
const spawn = require('cross-spawn').spawn;
const nodeNightly = require('./');
const existsSync = require('graceful-fs').existsSync;
const isOnline = require('is-online');

const os = process.platform  === 'win32' ? 'win' : process.platform;
let args = process.argv.slice(2);

// Check for upgrade.
let upgradeIndex = args.indexOf('--upgrade'),
    versionIndex = args.indexOf('--version'),
    version = versionIndex < 0 ? null : args[versionIndex + 1];

if (version) {
	nodeNightly.install(version).catch(console.error);
}
else if(!!~upgradeIndex) {
	reportIfOffline();
	nodeNightly.update().then(res => {
		if(res !== 'Installed') {
			console.log(res);
		}
		process.exit(0);
	}).catch(console.error);
} else if(!existsSync(`${__dirname}/node-nightly`)) {

	console.log('Downloading the nightly version, hang on...');
	reportIfOffline();
	//First install
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

function reportIfOffline() {
	isOnline((err, online) => {
		if(!online) {
			//offline
			console.info('\x1b[31m', 'Please check your internet connectivity.','\x1b[0m');
			process.exit(0);
		}
	});
}
