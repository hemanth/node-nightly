'use strict';
const fetch = require('isomorphic-fetch');
const download = require('download');
const nodeNightlyVersion = require('node-nightly-version');
const mv = require('fs').rename;

module.exports = {
  install: () => {
      console.log('Downloading the nightly version, hang on...');
       nodeNightlyVersion().then(latest => {
        const os = process.platform;
        const arch = process.arch;
        const type = 'nightly';
        const url = `https://nodejs.org/download/${type}/${latest}/node-${latest}-${os}-${arch}.tar`
        download(url, './', {extract:true})
        .then( _ => {
          mv(`./node-${latest}-${os}-${arch}`, `./node-nightly`)
          console.log('node-nightly is avalible on CLI! Just try `node-nightly`')
        }).catch(err => console.error(err));
      }).catch(err => console.error(err))
  }
};