const path = require('path');
const fileHash = require('./fileHash.js');

function getBundleAssets(bundle) {
  let result = [];
  if (bundle.name) {
    result.push(bundle.name);
  }
  bundle.childBundles.forEach(function(child) {
    result = result.concat(getBundleAssets(child));
  });
  return result;
}

module.exports = async function computeBundleHashes(bundle, outDir, precacheFilter) {
  const assets = getBundleAssets(bundle).filter(function(filename) {
    const relativeFilename = path.relative(outDir, filename);
    return precacheFilter(relativeFilename);
  });

  return await assets.reduce(async (prev, filename) => {
    const result = await prev;
    return fileHash(filename, 'md5').then(function(hash) {
      result[path.relative(outDir, filename)] = hash;
      return result;
    });
  }, Promise.resolve({}));
}
