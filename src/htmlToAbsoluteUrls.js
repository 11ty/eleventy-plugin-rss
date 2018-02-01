const posthtml = require('posthtml');
const urls = require('posthtml-urls')
const absoluteUrl = require("./absoluteUrl");

module.exports = function(htmlContent, base) {
  if( !base ) {
    throw new Error( "eleventy-plugin-rss, htmlToAbsoluteUrls(absolutePostUrl) was missing the full URL base `absolutePostUrl` argument.")
  }

  let options = {
    eachURL: function(url, attr, element) {
      url = url.trim();

      // #anchor in-page
      if( url.indexOf("#") === 0 ) {
        return url;
      }

      return absoluteUrl(url, base);
    }
  };

  let modifier = posthtml().use(urls(options));

  return modifier.process(htmlContent);
};
