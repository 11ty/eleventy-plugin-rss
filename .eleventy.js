const pkg = require("./package.json");
const dateRfc3339 = require("./src/dateRfc3339");
const dateRfc822 = require("./src/dateRfc822");
const getNewestCollectionItemDate = require("./src/getNewestCollectionItemDate");
const virtualTemplate = require("./src/virtualTemplate.js");

const absoluteUrl = require("./src/absoluteUrl");
const convertHtmlToAbsoluteUrls = require("./src/htmlToAbsoluteUrls");

function eleventyRssPlugin(eleventyConfig, options = {}) {
  try {
    eleventyConfig.versionCheck(pkg["11ty"].compatibility);
  } catch(e) {
    console.log( `WARN: Eleventy Plugin (${pkg.name}) Compatibility: ${e.message}` );
  }

  // Deprecated in favor of the HTML <base> plugin bundled with Eleventy 2.0
  eleventyConfig.addNunjucksFilter("absoluteUrl", absoluteUrl);

  // Deprecated in favor of the HTML <base> plugin bundled with Eleventy 2.0
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

  // Dates
  eleventyConfig.addNunjucksFilter("getNewestCollectionItemDate", getNewestCollectionItemDate);
  eleventyConfig.addNunjucksFilter("dateToRfc3339", dateRfc3339);
  eleventyConfig.addNunjucksFilter("dateToRfc822", dateRfc822);

  // Removed, this name is incorrect! Issue #8, #21
  eleventyConfig.addNunjucksFilter("rssLastUpdatedDate", () => {
    throw new Error("The `rssLastUpdatedDate` filter was removed. Use `getNewestCollectionItemDate | dateToRfc3339` (for Atom) or `getNewestCollectionItemDate | dateToRfc822` (for RSS) instead.")
  });

  // Removed, this name is incorrect! Issue #8, #21
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
