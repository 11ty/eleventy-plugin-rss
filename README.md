# eleventy-plugin-rss

A pack of [Eleventy](https://github.com/11ty/eleventy) plugins for generating Atom and JSON feeds using the Nunjucks templating engine.

_Note: the plugin is called RSS but does not technically include an example of an RSS feed. Generally feed readers that support RSS also support Atom. If you’d like to contribute an example, a pull request would be welcome!_

## Installation

Available on [npm](https://www.npmjs.com/package/@11ty/eleventy-plugin-rss).

```
npm install @11ty/eleventy-plugin-rss --save-dev
```

Open up your Eleventy config file (probably `.eleventy.js`) and use `addPlugin`:

```
const pluginRss = require("@11ty/eleventy-plugin-rss");
module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);
};
```

Read more about [Eleventy plugins.](https://www.11ty.io/docs/plugins/)

## Usage

See `sample/feed.njk` for an example Atom feed template or `sample/feed.json` for an example JSON feed template.

### Supplies: Nunjucks Filters

* `rssLastUpdatedDate`: Gets the most recently updated content in the collection and retrieves the properly formatted Date for the top-level `<updated>` element.
* `rssDate`: format a Date to be used for individual `<entry><updated>` elements.
* `absoluteUrl`: converts a single URL (relative or absolute path) to a full absolute URL including protocol, domain, full path.
* `htmlToAbsoluteUrls`: transforms all of the URLs in a block of HTML with `absoluteUrl` above. Uses [posthtml-urls](https://github.com/posthtml/posthtml-urls) with `a[href]`, `video[src]`, `audio[src]`, `source`, `img[src]`, `[srcset]` and [a whole bunch more](https://github.com/posthtml/posthtml-urls/blob/307c91342a211b3f9fb22bc57264bbb31f235fbb/lib/defaultOptions.js).
