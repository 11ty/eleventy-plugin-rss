const posthtml = require('posthtml');
const urls = require('posthtml-urls')
const absoluteUrl = require("./absoluteUrl");

module.exports = async function(htmlContent, base, processOptions = {}) {
  if( !base ) {
    throw new Error( "eleventy-plugin-rss, htmlToAbsoluteUrls(absolutePostUrl) was missing the full URL base `absolutePostUrl` argument.")
  }

  let options = {
    eachURL: function(url) {
      return absoluteUrl(url.trim(), base);
    }
  };

  let modifier = posthtml().use(urls(options));

  let result =  await modifier.process(htmlContent, processOptions);
  return result.html;
};
