const dateToISO = require("./src/dateToISO");
const absoluteUrl = require("./src/absoluteUrl");
const htmlToAbsoluteUrls = require("./src/htmlToAbsoluteUrls");

module.exports = function(eleventyConfig) {
  eleventyConfig.addNunjucksFilter("rssLastUpdatedDate", collection => {
    if( !collection || !collection.length ) {
      throw new Error( "Collection is empty in rssLastUpdatedDate filter." );
    }

    // Newest date in the collection
    return dateToISO(collection[ collection.length - 1 ].date);
  });

  eleventyConfig.addNunjucksFilter("rssDate", dateObj => dateToISO(dateObj));

  eleventyConfig.addNunjucksFilter("absoluteUrl", (href, base) => absoluteUrl(href, base));

  eleventyConfig.addNunjucksAsyncFilter("htmlToAbsoluteUrls", (htmlContent, base, callback) => {
    if(!htmlContent) {
      callback(null, "");
      return;
    }

    htmlToAbsoluteUrls(htmlContent, base).then(result => {
      callback(null, result.html);
    });
  });
};
