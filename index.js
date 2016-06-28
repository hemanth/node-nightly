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
        const type = 'nightly';
        const url = `https://nodejs.org/download/${type}/${latest}/node-${latest}-${os}-${arch}.tar`
        download(url, './', {extract:true})
        .then( _ => {
          mv(`./node-${latest}-${os}-${arch}`, `./node-nightly`);
          console.log('node-nightly is avalible on your CLI! ');
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