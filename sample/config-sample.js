const rssPlugin = require("../")

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(rssPlugin, {
    posthtmlRenderOptions: {}
  });

  eleventyConfig.addJavaScriptFunction("absoluteUrl", rssPlugin.absoluteUrl);
  eleventyConfig.addJavaScriptFunction("htmlToAbsoluteUrls", rssPlugin.convertHtmlToAbsoluteUrls);
  eleventyConfig.addJavaScriptFunction("dateToRfc3339", rssPlugin.dateToRfc3339);
};
