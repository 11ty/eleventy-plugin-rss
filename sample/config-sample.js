const rssPlugin = require("../")

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(rssPlugin, {
    posthtmlRenderOptions: {}
  });
};
