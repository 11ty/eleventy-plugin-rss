import rssPlugin from "../.eleventy.js";

export default function(eleventyConfig) {
  // eleventyConfig.ignores.add("json.njk");
  // eleventyConfig.ignores.add("atom.njk");
  // eleventyConfig.ignores.add("rss.njk");

  eleventyConfig.addPlugin(rssPlugin, {
    posthtmlRenderOptions: {}
  });
};
