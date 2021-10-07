const pkg = require("./package.json");
const dateRfc3339 = require("./src/dateRfc3339");
const absoluteUrl = require("./src/absoluteUrl");
const convertHtmlToAbsoluteUrls = require("./src/htmlToAbsoluteUrls");
const getNewestCollectionItemDate = require("./src/getNewestCollectionItemDate");

module.exports = function(eleventyConfig, options = {}) {
  try {
    eleventyConfig.versionCheck(pkg["11ty"].compatibility);
  } catch(e) {
    console.log( `WARN: Eleventy Plugin (${pkg.name}) Compatibility: ${e.message}` );
  }

  eleventyConfig.addNunjucksFilter("absoluteUrl", absoluteUrl);

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

  // Deprecated, these names are incorrect! Issue #8
  eleventyConfig.addNunjucksFilter("rssLastUpdatedDate", collection => {
    return dateRfc3339(getNewestCollectionItemDate(collection));
  });

  // Deprecated, this name is incorrect! Issue #8
  eleventyConfig.addNunjucksFilter("rssDate", dateRfc3339);
};

module.exports.dateToRfc3339 = dateRfc3339;
module.exports.getNewestCollectionItemDate = getNewestCollectionItemDate;
module.exports.absoluteUrl = absoluteUrl;
module.exports.convertHtmlToAbsoluteUrls = convertHtmlToAbsoluteUrls;
