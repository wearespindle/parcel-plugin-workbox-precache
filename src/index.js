const buildServiceWorker = require('./helpers/buildServiceWorker.js');

const swFilename = 'service_worker.js';
const precacheIgnoreFiles = ['manifest.webmanifest', swFilename];

module.exports = function(bundler) {
  bundler.on('bundled', async (bundle) => {
    await buildServiceWorker(bundle, swFilename, precacheIgnoreFiles);
  });
};
