module.exports.data = {
  permalink: "feed.json",
  eleventyExcludeFromCollections: true,
  normalizeAbsoluteUrls: true,
  metadata: {
    title: "My Blog about Boats",
    subtitle: "I am writing about my experiences as a naval navel-gazer.",
    language: "en",
    url: "https://example.com/",
    author: {
      name: "Boaty McBoatFace",
      url: "https://example.com/about-boaty/"
    }
  }
};

module.exports.render = async function({ permalink, metadata, collections, normalizeAbsoluteUrls }) {
  let feed = {
    version: "https://jsonfeed.org/version/1.1",
    title: metadata.title,
    language: metadata.language,
    home_page_url: metadata.url,
    feed_url: this.absoluteUrl(this.url(permalink), metadata.url),
    description: metadata.subtitle,
    author: {
      name: metadata.author.name,
      url: metadata.author.url,
    },
    items: []
  };

  for(let post of collections.posts.slice().reverse()) {
    let absolutePostUrl = this.absoluteUrl(this.url(post.url), metadata.url);
    let item = {
      id: absolutePostUrl,
      url: absolutePostUrl,
      title: post.data.title,
      date_published: this.dateToRfc3339(post.date),
      content_html: post.templateContent,
    };
    if(normalizeAbsoluteUrls) {
      item.content_html = await this.htmlToAbsoluteUrls(item.content_html, absolutePostUrl);
    }
    feed.items.push(item);
  }

  return JSON.stringify(feed, null, 2);
};
