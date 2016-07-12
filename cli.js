#!/usr/bin/env node
'use strict';

const spawn = require('cross-spawn').spawn;
const nodeNightly = require('./');
const existsSync = require('graceful-fs').existsSync;

let args = process.argv.slice(2);

// Check for upgrade.
let index = args.indexOf('--upgrade');
if(!!~index) {

	nodeNightly.update().then(res => {
		if(res !== 'Installed') {
			console.log(res);
		}
		process.exit(0);
	})
	.catch(console.error);

} else if(!existsSync(`${__dirname}/node-nightly`)) {
	//First install
	console.log('Downloading the nightly version, hang on...');
	nodeNightly.install().catch(console.error);

} else {

	nodeNightly.check().then(isUpdateAvailable => {

		if(isUpdateAvailable) {
			console.log('\x1b[36m', 'New nightly available. To upgrade: `node-nightly --upgrade`' ,'\x1b[0m');
		}

		let path;
		if(/^win/.test(process.platform)) {
			//if it's a windows platform
			path = `${__dirname}/node-nightly/node.exe`;
		} else {
			//other than windows
			path = `${__dirname}/node-nightly/bin/node`;
		}
		spawn(path, args,  {stdio: 'inherit', env: process.env});

	})
	.catch(console.error);
}
