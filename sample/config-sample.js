module.exports = async function(eleventyConfig) {
  const { default: rssPlugin } = await import("../.eleventy.js");

  // eleventyConfig.ignores.add("json.njk");
  // eleventyConfig.ignores.add("atom.njk");
  // eleventyConfig.ignores.add("rss.njk");

  eleventyConfig.addPlugin(rssPlugin, {
    posthtmlRenderOptions: {}
  });
};
