const pkg = require("../package.json");
const { DeepCopy } = require("@11ty/eleventy-utils");
const debug = require("debug")("Eleventy:Rss:Feed");

function getFeedContent(type, { stylesheet, collectionName, limit }) {
  let stylesheetUrl = stylesheet?.[type];
  // Note: page.lang comes from the i18n plugin: https://www.11ty.dev/docs/plugins/i18n/#page.lang

  if(type === "rss") {
    // Nunjucks template
    return `<?xml version="1.0" encoding="utf-8"?>
${stylesheetUrl ? `<?xml-stylesheet href="${stylesheetUrl}" type="text/xsl"?>\n` : ""}<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xml:base="{{ metadata.base | addPathPrefixToFullUrl }}" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>{{ metadata.title }}</title>
    <link>{{ metadata.base | addPathPrefixToFullUrl }}</link>
    <atom:link href="{{ permalink | htmlBaseUrl(metadata.base) }}" rel="self" type="application/rss+xml" />
    <description>{{ metadata.subtitle }}</description>
    <language>{{ metadata.language or page.lang }}</language>
    {%- for post in collections.${collectionName} | reverse | head(${limit}) %}
    {%- set absolutePostUrl = post.url | htmlBaseUrl(metadata.base) %}
    <item>
      <title>{{ post.data.title }}</title>
      <link>{{ absolutePostUrl }}</link>
      <description>{{ post.content | renderTransforms(post.data.page, metadata.base) }}</description>
      <pubDate>{{ post.date | dateToRfc822 }}</pubDate>
      <dc:creator>{{ metadata.author.name }}</dc:creator>
      <guid>{{ absolutePostUrl }}</guid>
    </item>
    {%- endfor %}
  </channel>
</rss>`;
  }

  if(type === "atom") {
    // Nunjucks template
    return `<?xml version="1.0" encoding="utf-8"?>
${stylesheetUrl ? `<?xml-stylesheet href="${stylesheetUrl}" type="text/xsl"?>\n` : ""}<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="{{ metadata.language or page.lang }}">
  <title>{{ metadata.title }}</title>
  <subtitle>{{ metadata.subtitle }}</subtitle>
  <link href="{{ permalink | htmlBaseUrl(metadata.base) }}" rel="self" />
  <link href="{{ metadata.base | addPathPrefixToFullUrl }}" />
  <updated>{{ collections['${collectionName}'] | getNewestCollectionItemDate | dateToRfc3339 }}</updated>
  <id>{{ metadata.base | addPathPrefixToFullUrl }}</id>
  <author>
    <name>{{ metadata.author.name }}</name>
    <email>{{ metadata.author.email }}</email>
  </author>
  {%- for post in collections['${collectionName}'] | reverse | head(${limit}) %}
  {%- set absolutePostUrl %}{{ post.url | htmlBaseUrl(metadata.base) }}{% endset %}
  <entry>
    <title>{{ post.data.title }}</title>
    <link href="{{ absolutePostUrl }}" />
    <updated>{{ post.date | dateToRfc3339 }}</updated>
    <id>{{ absolutePostUrl }}</id>
    <content type="html">{{ post.content | renderTransforms(post.data.page, metadata.base) }}</content>
  </entry>
  {%- endfor %}
</feed>`;
  }

  if(type === "json") {
    return `{
  "version": "https://jsonfeed.org/version/1.1",
  "title": "{{ metadata.title }}",
  "language": "{{ metadata.language or page.lang }}",
  "home_page_url": "{{ metadata.base | addPathPrefixToFullUrl }}",
  "feed_url": "{{ permalink | htmlBaseUrl(metadata.base) }}",
  "description": "{{ metadata.description }}",
  "authors": [
    {
      "name": "{{ metadata.author.name }}",
      "url": "{{ metadata.author.url }}"
    }
  ],
  "items": [
    {%- for post in collections['${collectionName}'] | reverse | head(${limit}) %}
    {%- set absolutePostUrl %}{{ post.url | htmlBaseUrl(metadata.base) }}{% endset %}
    {
      "id": "{{ absolutePostUrl }}",
      "url": "{{ absolutePostUrl }}",
      "title": "{{ post.data.title }}",
      "content_html": {% if post.content %}{{ post.content | renderTransforms(post.data.page, metadata.base) | dump | safe }}{% else %}""{% endif %},
      "date_published": "{{ post.date | dateToRfc3339 }}"
    }
    {% if not loop.last %},{% endif %}
    {%- endfor %}
  ]
}`
  }

  throw new Error("Missing or invalid feed type. Received: " + type);
}

function getInputPath(type) {
  return `virtual:eleventy-plugin-rss:${type}.njk`;
}

async function eleventyFeedPlugin(eleventyConfig, options = {}) {
  eleventyConfig.versionCheck(">=3.0.0-alpha.11");

  // Guaranteed unique
  const pluginRss = require("../.eleventy.js");
  eleventyConfig.addPlugin(pluginRss, options.rssPluginOptions || {});

  // Guaranteed unique
  let pluginHtmlBase = await eleventyConfig.resolvePlugin("@11ty/eleventy/html-base-plugin");
  eleventyConfig.addPlugin(pluginHtmlBase, options.htmlBasePluginOptions || {});

  options = DeepCopy({
    collectionName: false, // required
    limit: 0, // limit number of entries, 0 means no limit
    files: {
      // rss and json also supported
      atom: "/feed.xml",
    },
    templateData: {
      // atom: {},
    },
    metadata: {
      title: "Blog Title",
      subtitle: "This is a longer description about your blog.",
      language: "", // downstream templates use `page.lang` as fallback
      base: "https://example.com/",
      author: {
        name: "Your Name",
        email: "me@example.com"
      }
    }
  }, options);

  if(!options.collectionName) {
    throw new Error("Missing `collectionName` option in feedPlugin from @11ty/eleventy-plugin-rss.");
  }

  let templateData = {
    eleventyExcludeFromCollections: [ options.collectionName ],
    eleventyImport: {
      collections: [ options.collectionName ],
    },
    layout: false,
    metadata: options.metadata,
    // Get the first `n` elements of a collection.
    head: function(array, n) {
      if(!n || n === 0) {
        return array;
      }
      if(n < 0) {
        throw new Error("`limit` option must be a positive number.");
      }
      return array.slice(0, n);
    },
  };

  for(let type in options.files) {
    let files = options.files[type];
    let inputPath;
    let outputPath;

    if(Array.isArray(files) && files.length >= 2) {
      [inputPath, outputPath] = files;
    } else if(typeof files === "string") {
      inputPath = getInputPath(type);
      outputPath = files;
    } else {
      throw new Error("Invalid `files` option. Needs an array of length 2 [inputPath, outputPath] or a string `outputPath`");
    }

    let data = {
      permalink: outputPath,
      ...options?.templateData?.[type] || {},
      ...templateData,
    };
    eleventyConfig.addTemplate(inputPath, getFeedContent(type, options), data);
  }
};


Object.defineProperty(eleventyFeedPlugin, "eleventyPackage", {
  value: `${pkg.name}/feed-plugin`
});

Object.defineProperty(eleventyFeedPlugin, "eleventyPluginOptions", {
  value: {
    // multiple adds of this one is OK
    unique: false
  }
});

module.exports = eleventyFeedPlugin;
