const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const workbox = require('workbox-build');

const computeBundleHashes = require('./computeBundleHashes.js');
const injectScript = require('./injectScript.js');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

async function getPrecacheManifest(bundle, outDir, ignoreFiles) {
  const hashes = await computeBundleHashes(bundle, outDir, ignoreFiles);
  return Object.entries(hashes).map(function([filename, hash]) {
    return { url: filename, revision: hash };
  });
}

module.exports = async function upgradeServiceWorker(bundle, swFilename, ignoreFiles) {
  const outDir = path.resolve(bundle.entryAsset.options.outDir);
  const swFile = path.join(outDir, swFilename);
  const precacheManifest = await getPrecacheManifest(bundle, outDir, ignoreFiles);
  const script = `
importScripts('${workbox.getModuleURL('workbox-sw')}');
const precacheManifest = ${JSON.stringify(precacheManifest, null, 2)};
`;

  const contents = await readFile(swFile, {encoding: 'utf8'});
  await writeFile(swFile, injectScript(contents, script));
}
