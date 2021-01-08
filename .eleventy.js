const dateToISO = require("./src/dateToISO");
const absoluteUrl = require("./src/absoluteUrl");
const htmlToAbsoluteUrls = require("./src/htmlToAbsoluteUrls");

const defaultPosthtmlRenderOptions = {
  closingSingleTag: "slash"
};

module.exports = function(eleventyConfig, options = {}) {
  eleventyConfig.addNunjucksFilter("rssLastUpdatedDate", collection => {
    if( !collection || !collection.length ) {
      throw new Error( "Collection is empty in rssLastUpdatedDate filter." );
    }

    // Newest date in the collection
    return dateToISO(new Date(Math.max(...collection.map(item => {return item.date}))));
  });

  eleventyConfig.addNunjucksFilter("rssDate", dateObj => dateToISO(dateObj));

  eleventyConfig.addNunjucksFilter("absoluteUrl", (href, base) => absoluteUrl(href, base));

  eleventyConfig.addNunjucksAsyncFilter("htmlToAbsoluteUrls", (htmlContent, base, urlOptions, callback) => {
    if(!htmlContent) {
      callback(null, "");
      return;
    }

    let posthtmlOptions = Object.assign({}, defaultPosthtmlRenderOptions, options.posthtmlRenderOptions, urlOptions);

    htmlToAbsoluteUrls(htmlContent, base, posthtmlOptions).then(result => {
      callback(null, result.html);
    });
  });
};
