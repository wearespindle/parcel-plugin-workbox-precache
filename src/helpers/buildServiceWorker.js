const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const workbox = require('workbox-build');
const computeBundleHashes = require('./computeBundleHashes.js');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);


async function getPrecacheManifest(bundle, outDir, ignoreFiles) {
  const hashes = await computeBundleHashes(bundle, outDir, ignoreFiles);
  return Object.entries(hashes).map(function([filename, hash]) {
    return { url: filename, revision: hash };
  });
}

module.exports = async function buildServiceWorker(bundle, swFilename, ignoreFiles) {
  const outDir = path.resolve(bundle.entryAsset.options.outDir);
  const swFile = path.join(outDir, swFilename);

  console.log('Prepending workbox precache manifest to:', swFilename);
  const contents = await readFile(swFile);
  const precacheManifest = await getPrecacheManifest(bundle, outDir, ignoreFiles);

  const preamble = `
importScripts('${workbox.getModuleURL('workbox-sw')}');
workbox.precaching.precacheAndRoute(${JSON.stringify(precacheManifest, null, 2)});
`;

  await writeFile(swFile, [preamble, contents].join('\n'));
}
