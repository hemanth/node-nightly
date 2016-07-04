'use strict';
const download = require('download');
const nodeNightlyVersion = require('node-nightly-version');
const Configstore = require('configstore');
const pkg = require('./package.json');
const mv = require('fs').rename;
const rm = require('rimraf');

module.exports = {
  install: () => {
       nodeNightlyVersion().then(latest => {
        const conf = new Configstore(pkg.name);
        conf.set('version', latest);
        const os = process.platform;
        const arch = process.arch;
        const nightlyUrl = process.env.NODEJS_ORG_NIGHTLY_MIRROR || 'https://nodejs.org/download/nightly';
        const url = `${nightlyUrl}/${latest}/node-${latest}-${os}-${arch}.tar`;
        download(url, __dirname, {extract:true})
        .then( _ => {
          mv(`${__dirname}/node-${latest}-${os}-${arch}`, `${__dirname}/node-nightly`);
          console.log('node-nightly is available on your CLI! ');
          process.exit(0);
        }).catch(err => console.error(err));
      }).catch(err => console.error(err))
  },
  update: function() {
     console.log('Deleting old version');
     rm.sync('./node-nightly');
     console.log('Deleted, installing newer version..');
     this.install();
  }
};
