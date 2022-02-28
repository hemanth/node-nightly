'use strict';
import download from 'download';
import nodeNightlyVersion from 'node-nightly-version';
import Configstore from 'configstore';
import rm from 'rimraf';
import realFs from 'fs';
import gracefulFs from 'graceful-fs';
import path from 'path';
import {fileURLToPath} from 'url';

//import * as pkg from "./package.json"

const pkg = {name: 'node-nightly'}


gracefulFs.gracefulify(realFs);
const mv = gracefulFs.renameSync;

const extractDate = versionString => ~~versionString.split('nightly'[1].slice(0, 8));
const compVersion = (currentVersion, latestVersion) => extractDate(currentVersion) < extractDate(latestVersion);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {

	install: (version) => {
		let osArchString, nodeNightlyVer;
		nodeNightlyVer = version !== undefined ? Promise.resolve(version) : nodeNightlyVersion();

		return nodeNightlyVer.then(latest => {
      const os = process.platform === 'win32' ? 'win' : process.platform,
            extention = os === 'win' ? 'zip' : 'tar.gz',
            arch = process.arch === 'ia32' ? 'x86' : process.arch,
            type = 'nightly',
            osArchString = `${latest}-${os}-${arch}`,
            url = `https://nodejs.org/download/${type}/${latest}/node-${osArchString}.${extention}`,
            nightlyDir = `${__dirname}/node-nightly`;

      const extractedTo = `${__dirname}/node-${osArchString}`;

      if (gracefulFs.existsSync(extractedTo)) {
        rm.sync(extractedTo);
      }

      return download(url, __dirname, {
        extract: true
      }).then(_ => {
        if (gracefulFs.existsSync(nightlyDir)) {
          console.log('Deleting old version');
          rm.sync(nightlyDir);
          console.log(`Deleted!\nInstalling newer version..`);
        }

        mv(extractedTo, nightlyDir);
        console.log(`node-nightly is available on your CLI!`);

        new Configstore(pkg.name).set('version', version);

        return 'Installed';
      });
    });
  },

  update: function() {
		console.log('Checking for update...');
		return this.check().then(updatedVersion => {
			if (updatedVersion) {
				return this.install(updatedVersion);
			}
			return 'You are using latest version already.';
		});
	},

	check: function() {
		return nodeNightlyVersion().then(latestVersion => {
			const currentVersion = new Configstore(pkg.name).get('version');
			if (!currentVersion || compVersion(currentVersion, latestVersion)) {
				return latestVersion;
			}
			return false;
		});
	}
};
