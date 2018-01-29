# eleventy-plugins-rss

A pack of Eleventy plugins for generating an RSS feed using the Nunjucks templating engine.

See `sample/feed.njk` for an example RSS feed template.

## Nunjucks Filters

* `rssLastUpdatedDate`: Gets the most recently updated content in the collection and retrieves the properly formatted Date for the top-level `<updated>` element.
* `rssDate`: format a Date to be used for individual `<entry><updated>` elements.
* `absoluteUrl`: converts a single URL (relative or absolute path) to a full absolute URL including protocol, domain, full path.
* `htmlToAbsoluteUrls`: transforms all of the URLs in a block of HTML with `absoluteUrl` above. Uses [posthtml-urls](https://github.com/posthtml/posthtml-urls) with `a[href]`, `video[src]`, `audio[src]`, `source`, `img[src]`, `[srcset]` and [a whole bunch more](https://github.com/posthtml/posthtml-urls/blob/307c91342a211b3f9fb22bc57264bbb31f235fbb/lib/defaultOptions.js).
