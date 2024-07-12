const pkg = require("../package.json");

const dateRfc3339 = require("./dateRfc3339.js");
const dateRfc822 = require("./dateRfc822.js");
const getNewestCollectionItemDate = require("./getNewestCollectionItemDate.js");

const absoluteUrl = require("./absoluteUrl.js");
const convertHtmlToAbsoluteUrls = require("./htmlToAbsoluteUrls.js");


function eleventyRssPlugin(eleventyConfig, options = {}) {
  eleventyConfig.versionCheck(pkg["11ty"].compatibility);

  // Guaranteed unique, first add wins
  const pluginHtmlBase = eleventyConfig.resolvePlugin("@11ty/eleventy/html-base-plugin");
  eleventyConfig.addPlugin(pluginHtmlBase, options.htmlBasePluginOptions || {});

  // Dates
  eleventyConfig.addNunjucksFilter("getNewestCollectionItemDate", getNewestCollectionItemDate);
  eleventyConfig.addNunjucksFilter("dateToRfc3339", dateRfc3339);
  eleventyConfig.addNunjucksFilter("dateToRfc822", dateRfc822);

  // Deprecated in favor of the more efficient HTML <base> plugin bundled with Eleventy
  eleventyConfig.addNunjucksFilter("absoluteUrl", absoluteUrl);

  // Deprecated in favor of the more efficient HTML <base> plugin bundled with Eleventy
  eleventyConfig.addNunjucksAsyncFilter("htmlToAbsoluteUrls", (htmlContent, base, callback) => {
    if(!htmlContent) {
      callback(null, "");
      return;
    }

    let posthtmlOptions = Object.assign({
      // default PostHTML render options
      closingSingleTag: "slash"
    }, options.posthtmlRenderOptions);

    convertHtmlToAbsoluteUrls(htmlContent, base, posthtmlOptions).then(html => {
      callback(null, html);
    });
  });

  // These are removed, their names are incorrect! Issue #8, #21
  eleventyConfig.addNunjucksFilter("rssLastUpdatedDate", () => {
    throw new Error("The `rssLastUpdatedDate` filter was removed. Use `getNewestCollectionItemDate | dateToRfc3339` (for Atom) or `getNewestCollectionItemDate | dateToRfc822` (for RSS) instead.")
  });
  eleventyConfig.addNunjucksFilter("rssDate", () => {
    throw new Error("The `rssDate` filter was removed. Use `dateToRfc3339` (for Atom) or `dateToRfc822` (for RSS) instead.");
  });
};

Object.defineProperty(eleventyRssPlugin, "eleventyPackage", {
	value: pkg.name
});

Object.defineProperty(eleventyRssPlugin, "eleventyPluginOptions", {
	value: {
    unique: true
  }
});

module.exports = eleventyRssPlugin;
