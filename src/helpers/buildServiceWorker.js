const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const workbox = require('workbox-build');

const computeBundleHashes = require('./computeBundleHashes.js');
const injectScript = require('./injectScript.js');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

module.exports = async function upgradeServiceWorker(bundle, swFilename, precacheFilter) {
  const outDir = path.resolve(bundle.entryAsset.options.outDir);
  const swFile = path.join(outDir, swFilename);
  if (!fs.existsSync(swFile)) {
    console.log(`Skipping workbox precache because ${swFilename} is not found.`);
    return;
  }

  const hashes = await computeBundleHashes(bundle, outDir, precacheFilter);
  const precacheManifest = Object.entries(hashes).map(function([filename, hash]) {
    return { url: `${bundle.entryAsset.options.publicURL}/${filename}`, revision: hash };
  });

  const vendorDir = path.join(outDir, 'vendor');
  const relPath = await workbox.copyWorkboxLibraries(vendorDir);
  const workboxLibDir = path.relative(outDir, path.join(vendorDir, relPath));
  console.log(`Copied workbox libraries to ${workboxLibDir}`);

  const script = `
importScripts('${workboxLibDir}/workbox-sw.js');
workbox.setConfig({modulePathPrefix: '/${workboxLibDir}/'});
const precacheManifest = ${JSON.stringify(precacheManifest, null, 2)};
`;

  const contents = await readFile(swFile, { encoding: 'utf8' });
  await writeFile(swFile, injectScript(contents, script));
};
