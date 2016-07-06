'use strict';
const download = require('download');
const nodeNightlyVersion = require('node-nightly-version');
const Configstore = require('configstore');
const pkg = require('./package.json');
const mv = require('fs').rename;
const rm = require('rimraf');

module.exports = {
  install: () => {
  		let osArchString;
      nodeNightlyVersion().then(latest => {
      	const conf = new Configstore(pkg.name);
        conf.set('version', latest);
        const os = process.platform;
        const arch = process.arch;
        const type = 'nightly';
        osArchString = `${latest}-${os}-${arch}`;
        const url = `https://nodejs.org/download/${type}/${latest}/node-${osArchString}.tar`;
        return download(url, __dirname, {extract:true});
      })
      .then( _ => {
      	mv(`${__dirname}/node-${osArchString}`, `${__dirname}/node-nightly`);
        console.log('node-nightly is available on your CLI! ');
        process.exit(0);
      })
      .catch(console.error);
  },
  update: () => {
    console.log('Deleting old version');
    rm.sync('./node-nightly');
    console.log(`Deleted!\n Installing newer version..`);
    this.install();
  }
};
