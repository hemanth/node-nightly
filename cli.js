#!/usr/bin/env node
'use strict';
const kexec = require('kexec');
const nodeNightly = require('./');
const existsSync = require('fs').existsSync;
const execFileSync = require('child_process').execFileSync
const Configstore = require('configstore');
const pkg = require('./package.json');
const prompt = require('single-prompt').prompt;
const nodeNightlyVersion = require('node-nightly-version');

const args = process.argv.slice(2);
const extractDate = versionString => ~~versionString.split('nightly')[1].slice(0,8);
const compVersion = (currentVersion, latestVersion) => extractDate(currentVersion) < extractDate(latestVersion);

if(!existsSync('./node-nightly')) {
  console.log('Downloading the nightly version, hang on...');
  nodeNightly.install();
} else {
  nodeNightlyVersion().then(latestVersion => {
      const currentVersion = new Configstore(pkg.name).get('version');
      if(compVersion(currentVersion, latestVersion)) {
          prompt('Newer version is available, do you want to upgrade?', ['y', 'n'])
              .then(function(choice) {
              if(choice === 'y') {
                  console.log('Updating...')
                  nodeNightly.update();
              } else {
                  kexec('./node-nightly/bin/node', args);
              }
          }).catch(console.error);
      }
      else {
          kexec('./node-nightly/bin/node', args);
      }
  });
}
