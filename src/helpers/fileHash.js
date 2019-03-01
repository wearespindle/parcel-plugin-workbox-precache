const { createReadStream } = require('fs');
const { createHash } = require('crypto');

// https://gist.github.com/GuillermoPena/9233069#gistcomment-2364896
// Algorithm depends on availability of OpenSSL on platform
// Example algorithms: 'sha1', 'md5', 'sha256', 'sha512' ...
module.exports = function fileHash(filename, algorithm) {
  return new Promise((resolve, reject) => {
    const h = createHash(algorithm);
    try {
      const s = createReadStream(filename)
      s.on('data', function(data) {
        h.update(data)
      })
      s.on('end', function() {
        return resolve(h.digest('hex'));
      })
    } catch (error) {
      return reject(error);
    }
  });
}
