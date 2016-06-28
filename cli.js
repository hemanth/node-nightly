#!/usr/bin/env node
'use strict';
const kexec = require('kexec');
const nodeNightly = require('./');
const existsSync = require('fs').existsSync;
const execFileSync = require('child_process').execFileSync
const Configstore = require('configstore');
const pkg = require('./package.json');
const nodeNightlyVersion = require('node-nightly-version');

const extractDate = versionString => ~~versionString.split('nightly')[1].slice(0,8);
const compVersion = (currentVersion, latestVersion) => extractDate(currentVersion) < extractDate(latestVersion);
let args = process.argv.slice(2);

// Check for upgrade.
let index = args.indexOf('--upgrade');
if(!!~index) {
  args = args.splice(index, 1);
  nodeNightly.update();
}

if(!existsSync(`${__dirname}/node-nightly`)) {
  //First install
  console.log('Downloading the nightly version, hang on...');
  nodeNightly.install();
} else {
  nodeNightlyVersion().then(latestVersion => {
      const currentVersion = new Configstore(pkg.name).get('version');
      if(compVersion(currentVersion, latestVersion)) {
        console.log('\x1b[36m', 'New nightly available. To upgrade: `node-nightly --upgrade`' ,'\x1b[0m');
      }
      kexec(`${__dirname}/node-nightly/bin/node`, args);
    }).catch(console.error);
}
