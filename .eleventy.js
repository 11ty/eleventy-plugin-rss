const rssPlugin = require("./src/rssPlugin.js");
const dateRfc3339 = require("./src/dateRfc3339.js");
const dateRfc822 = require("./src/dateRfc822.js");
const getNewestCollectionItemDate = require("./src/getNewestCollectionItemDate.js");
const virtualTemplate = require("./src/virtualTemplate.js");

const absoluteUrl = require("./src/absoluteUrl.js");
const convertHtmlToAbsoluteUrls = require("./src/htmlToAbsoluteUrls.js");

module.exports = rssPlugin;
module.exports.feedPlugin = virtualTemplate;
module.exports.dateToRfc3339 = dateRfc3339;
module.exports.dateToRfc822 = dateRfc822;
module.exports.getNewestCollectionItemDate = getNewestCollectionItemDate;
module.exports.absoluteUrl = absoluteUrl;
module.exports.convertHtmlToAbsoluteUrls = convertHtmlToAbsoluteUrls;
