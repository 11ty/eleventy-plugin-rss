import rssPlugin from "./src/rssPlugin.js";
import dateRfc3339 from "./src/dateRfc3339.js";
import dateRfc822 from "./src/dateRfc822.js";
import getNewestCollectionItemDate from "./src/getNewestCollectionItemDate.js";
import virtualTemplate, { getFeedTemplate } from "./src/virtualTemplate.js";

import absoluteUrl from "./src/absoluteUrl.js";
import convertHtmlToAbsoluteUrls from "./src/htmlToAbsoluteUrls.js";

// Also attach to the default export for v2 compatibility, see #91
Object.assign(rssPlugin, {
  feedPlugin: virtualTemplate,
  getFeedTemplate,
  dateToRfc3339: dateRfc3339,
  dateToRfc822: dateRfc822,
  getNewestCollectionItemDate,
  absoluteUrl,
  convertHtmlToAbsoluteUrls,
});

export default rssPlugin;

export {
  rssPlugin,
  virtualTemplate as feedPlugin,
  getFeedTemplate,
  dateRfc3339 as dateToRfc3339,
  dateRfc822 as dateToRfc822,
  getNewestCollectionItemDate as getNewestCollectionItemDate,
  absoluteUrl as absoluteUrl,
  convertHtmlToAbsoluteUrls as convertHtmlToAbsoluteUrls
};
