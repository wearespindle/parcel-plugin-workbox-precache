const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const computeBundleHashes = require('./computeBundleHashes.js');
const injectScript = require('./injectScript.js');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

module.exports = async function upgradeServiceWorker(bundle, swFilename, precacheFilter) {
  const outDir = path.resolve(bundle.entryAsset.options.outDir);
  const baseDir = path.resolve(path.dirname(bundle.entryAsset.name));
  const inFile = path.join(baseDir, swFilename);
  const outFile = path.join(outDir, swFilename);
  if (!fs.existsSync(inFile)) {
    console.log(`Skipping workbox precache because ${swFilename} is not found.`);
    return;
  }

  const hashes = await computeBundleHashes(bundle, outDir, precacheFilter);
  const precacheManifest = Object.entries(hashes).map(function([filename, hash]) {
    return { url: `${bundle.entryAsset.options.publicURL}/${filename}`, revision: hash };
  });

  const script = `
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');
const precacheManifest = ${JSON.stringify(precacheManifest, null, 2)};
`;

  const contents = await readFile(inFile, { encoding: 'utf8' });
  await writeFile(outFile, injectScript(contents, script));
};
