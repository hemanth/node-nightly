'use strict';
var fetch = require('isomorphic-fetch');
var download = require('download');
var mv = require('fs').rename;

module.exports = {
  install: () => {
      console.log('Downloading the nightly version, hang on...');
      fetch('https://nodejs.org/download/nightly/index.tab')
      .then(resp => resp.text())
      .then(text => {
        var latest = text.split('\n')[1].split('\t')[0];
        var os = process.platform;
        var arch = process.arch;
        var type = 'nightly';
        var url = `https://nodejs.org/download/${type}/${latest}/node-${latest}-${os}-${arch}.tar`
        download(url, './', {extract:true})
        .then( _ => {
          mv(`./node-${latest}-${os}-${arch}`, `./node-nightly`)
          console.log('node-nightly is avalible on CLI! Just try `node-nightly`')
        })
        .catch(err => console.error(err));
      })
    .catch(err => console.error(err))
  }
};