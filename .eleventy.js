const dateRfc3339 = require("./src/dateRfc3339");
const absoluteUrl = require("./src/absoluteUrl");
const htmlToAbsoluteUrls = require("./src/htmlToAbsoluteUrls");

function getNewestCollectionItemDate(collection) {
  if( !collection || !collection.length ) {
    throw new Error( "Collection is empty in rssLastUpdatedDate filter." );
  }

  return new Date(Math.max(...collection.map(item => {return item.date})));
}

async function convertHtmlToUseAbsoluteUrls(htmlContent, base, options) {
  let result = await htmlToAbsoluteUrls(htmlContent, base, options);
  return result.html;
}

module.exports = function(eleventyConfig, options = {}) {
  eleventyConfig.addNunjucksFilter("absoluteUrl", (href, base) => absoluteUrl(href, base));

  eleventyConfig.addNunjucksAsyncFilter("htmlToAbsoluteUrls", (htmlContent, base, callback) => {
    if(!htmlContent) {
      callback(null, "");
      return;
    }

    let posthtmlOptions = Object.assign({
      // default PostHTML render options
      closingSingleTag: "slash"
    }, options.posthtmlRenderOptions);

    convertHtmlToUseAbsoluteUrls(htmlContent, base, posthtmlOptions).then(html => {
      callback(null, html);
    });
  });

  // Dates
  eleventyConfig.addNunjucksFilter("getNewestCollectionItemDate", collection => {
    return getNewestCollectionItemDate(collection);
  });
  eleventyConfig.addNunjucksFilter("dateToRfc3339", dateRfc3339);

  // Deprecated, these names are incorrect! Issue #8
  eleventyConfig.addNunjucksFilter("rssLastUpdatedDate", collection => {
    return dateRfc3339(getNewestCollectionItemDate(collection));
  });

  // Deprecated, this name is incorrect! Issue #8
  eleventyConfig.addNunjucksFilter("rssDate", dateRfc3339);
};
