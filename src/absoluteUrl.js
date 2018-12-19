const { URL } = require("url");
const debug = require("debug")("EleventyPluginRSS");

module.exports = function(url, base) {
  try {
    return (new URL(url, base)).toString()
  } catch(e) {
    debug("Trying to convert %o to be an absolute url with base %o and failed, returning: %o (invalid url)", url, base, url)
    // TODO add debug output!
    return url;
  }
};
