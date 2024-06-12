const pkg = require("./package.json");
const dateRfc3339 = require("./src/dateRfc3339");
const dateRfc822 = require("./src/dateRfc822");
const getNewestCollectionItemDate = require("./src/getNewestCollectionItemDate");
const virtualTemplate = require("./src/virtualTemplate.js");

const absoluteUrl = require("./src/absoluteUrl");
const convertHtmlToAbsoluteUrls = require("./src/htmlToAbsoluteUrls");

async function eleventyRssPlugin(eleventyConfig, options = {}) {
  eleventyConfig.versionCheck(pkg["11ty"].compatibility);

  // Guaranteed unique, first add wins
  const pluginHtmlBase = await eleventyConfig.resolvePlugin("@11ty/eleventy/html-base-plugin");
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
module.exports.feedPlugin = virtualTemplate;
module.exports.dateToRfc3339 = dateRfc3339;
module.exports.dateToRfc822 = dateRfc822;
module.exports.getNewestCollectionItemDate = getNewestCollectionItemDate;
module.exports.absoluteUrl = absoluteUrl;
module.exports.convertHtmlToAbsoluteUrls = convertHtmlToAbsoluteUrls;
