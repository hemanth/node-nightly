#!/usr/bin/env node
'use strict';
const kexec = require('kexec');
const nodeNightly = require('./');
const existsSync = require('fs').existsSync;
const mv = require('fs').rename;

let args = process.argv.slice(2);

// Check for upgrade.
let index = args.indexOf('--upgrade');
if(!!~index) {
	nodeNightly.update().then(_ => {
		mv(`${__dirname}/node-${osArchString}`, `${__dirname}/node-nightly`);
		available();
		process.exit(0);
	}).catch(console.log);
} else if(!existsSync(`${__dirname}/node-nightly`)) {
	//First install
	console.log('Downloading the nightly version, hang on...');
	nodeNightly.install().then(available).catch(console.error);
} else {
	nodeNightly.check().then(updatedVersion => {
		if(updatedVersion) {
			console.log('\x1b[36m', 'New nightly available. To upgrade: `node-nightly --upgrade`' ,'\x1b[0m');
		}
		kexec(`${__dirname}/node-nightly/bin/node`, args);
	}).catch(console.error);
}

function available() {
	console.log(`node-nightly is available on your CLI!`);
}
