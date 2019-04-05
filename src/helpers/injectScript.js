const TAG_START = '//BEGIN workbox';
const TAG_END = '//END workbox';

module.exports = function injectWorkbox(contents, script) {
  // Search for a previous injection. When found replace it with the
  // updated script.
  const startTag = contents.indexOf(TAG_START);
  if (startTag !== -1) {
    const start = startTag + TAG_START.length;
    const end = contents.indexOf(TAG_END, start);
    if (end !== -1) {
      return [contents.substring(0, start), script, contents.substring(end)].join('\n');
    } else {
      console.warn('Workbox precache: no end tag found, possibly injecting twice...');
    }
  }

  // Inject the script in the head of the file.
  return [TAG_START, script, TAG_END, contents].join('\n');
};
