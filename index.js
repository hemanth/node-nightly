'use strict';
const download = require('download');
const nodeNightlyVersion = require('node-nightly-version');
const Configstore = require('configstore');
const pkg = require('./package.json');
const rm = require('rimraf');
const realFs = require('fs');
const gracefulFs = require('graceful-fs');
gracefulFs.gracefulify(realFs);
const mv = realFs.rename;

const extractDate = versionString => ~~versionString.split('nightly')[1].slice(0,8);
const compVersion = (currentVersion, latestVersion) => extractDate(currentVersion) < extractDate(latestVersion);

module.exports = {
	install: (version) => {
		let osArchString, nodeNightlyVer;
		nodeNightlyVer = version !== undefined ? Promise.resolve(version) : nodeNightlyVersion();

		return nodeNightlyVer.then(latest => {
			const conf = new Configstore(pkg.name);
			conf.set('version', latest);
			const os = process.platform;
			const arch = process.arch;
			const type = 'nightly';
			osArchString = `${latest}-${os}-${arch}`;
			const url = `https://nodejs.org/download/${type}/${latest}/node-${osArchString}.tar.gz`;
			return download(url, __dirname, {extract:true});
		}).then(_ => {
			mv(`${__dirname}/node-${osArchString}`, `${__dirname}/node-nightly`);
			console.log(`node-nightly is available on your CLI!`);
			return 'Installed';
		})
	},
	update: function() {
		console.log('Checking for update...');
		return this.check().then(updatedVersion => {
			if(updatedVersion) {
				//update found
				console.log('Deleting old version');
				rm.sync('./node-nightly');
				console.log(`Deleted!\nInstalling newer version..`);
				return this.install(updatedVersion);
			}
			return 'You are using latest version already.';
		});
	},
	check: function() {
		return nodeNightlyVersion().then(latestVersion => {
			const currentVersion = new Configstore(pkg.name).get('version');
			if(compVersion(currentVersion, latestVersion)) {
				return latestVersion;
			}
			return false;
		});
	}
};

