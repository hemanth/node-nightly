'use strict';
const download = require('download');
const nodeNightlyVersion = require('node-nightly-version');
const Configstore = require('configstore');
const pkg = require('./package.json');
const rm = require('rimraf');

const extractDate = versionString => ~~versionString.split('nightly')[1].slice(0,8);
const compVersion = (currentVersion, latestVersion) => extractDate(currentVersion) < extractDate(latestVersion);

module.exports = {
  install: () => {
		let osArchString;
    return nodeNightlyVersion().then(latest => {
    	const conf = new Configstore(pkg.name);
      conf.set('version', latest);
      const os = process.platform;
      const arch = process.arch;
      const type = 'nightly';
      osArchString = `${latest}-${os}-${arch}`;
      const url = `https://nodejs.org/download/${type}/${latest}/node-${osArchString}.tar.gz`;
      return download(url, __dirname, {extract:true});
    });
  },
  update: function() {
  	console.log('Checking for update...');
  	return this.check().then(update => {
  		process.stdout.write('\x1B[2J\x1B[0f'); //clear previous console
  		if(update) {
  			//update found
  			console.log('Deleting old version');
    		rm.sync('./node-nightly');
    		console.log(`Deleted!\nInstalling newer version..`);
    		return this.install();
  		}
  		//reject this promise if update is not found
  		return Promise.reject('You are using latest version already.');
  	});
  },
  check: function() {
  	return nodeNightlyVersion().then(latestVersion => {
  		const currentVersion = new Configstore(pkg.name).get('version');
  		if(compVersion(currentVersion, latestVersion)) {
        return true;
      }
      return false;
  	});
  }
};
