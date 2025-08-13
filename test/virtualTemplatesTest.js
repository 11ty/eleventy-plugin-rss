import test from "ava";
import { feedPlugin } from "../.eleventy.js";

// https://github.com/11ty/eleventy-plugin-rss/issues/50
test("RSS virtual templates plugin", async (t) => {
	const { default: Eleventy } = await import("@11ty/eleventy");

	let elev = new Eleventy("./test", "./test/_site", {
		config: function (eleventyConfig) {
			eleventyConfig.addTemplate("virtual.md", `# Hello`, { tag: "posts" })

			eleventyConfig.addPlugin(feedPlugin, {
				type: "atom", // or "rss", "json"
				outputPath: "/feed.xml",
				collection: {
					name: "posts", // iterate over `collections.posts`
					limit: 10,     // 0 means no limit
				},
			});
		},
	});

	let results = await elev.toJSON();

	t.deepEqual(results.length, 2);
	let [ feed ] = results.filter(entry => entry.outputPath.endsWith(".xml"));
	t.truthy(feed.content.startsWith(`<?xml version="1.0" encoding="utf-8"?>`));
});

test("RSS virtual templates plugin with `all`", async (t) => {
	const { default: Eleventy } = await import("@11ty/eleventy");

	let elev = new Eleventy("./test", "./test/_site", {
		config: function (eleventyConfig) {
			eleventyConfig.addTemplate("virtual.md", `# Hello`, { tag: "posts" })

			eleventyConfig.addPlugin(feedPlugin, {
				type: "atom", // or "rss", "json"
				outputPath: "/feed.xml",
				collection: {
					name: "all", // iterate over `collections.posts`
				},
			});
		},
	});

	let results = await elev.toJSON();

	t.deepEqual(results.length, 2);
	let [ feed ] = results.filter(entry => entry.outputPath.endsWith(".xml"));
	t.truthy(feed.content.startsWith(`<?xml version="1.0" encoding="utf-8"?>`));
});

test("RSS virtual templates with multple feeds", async t => {
	const { default: Eleventy } = await import("@11ty/eleventy");

	let elev = new Eleventy("./test", "./test/_site", {
		config: function (eleventyConfig) {
			eleventyConfig.addTemplate("virtual-a.md", `# Hello`, { tag: "posts" })
			eleventyConfig.addTemplate("virtual-b.md", `# There`, { tag: "photos" })

			eleventyConfig.addPlugin(feedPlugin, {
				feeds: [
					{
						type: "atom", // or "rss", "json"
						outputPath: "/posts.xml",
						collection: {
							name: "posts", // iterate over `collections.posts`
							limit: 10,     // 0 means no limit
						},
						metadata: {
							title: "Posts" // required when there are multiple feeds
						}
					},
					{
						type: "atom", // or "rss", "json"
						outputPath: "/photos.xml",
						collection: {
							name: "photos", // iterate over `collections.photos`
							limit: 10,     // 0 means no limit
						},
						metadata: {
							title: "Photos" // required when there are multiple feeds
						}
					}
				]
			});
		},
	});

	let results = await elev.toJSON();

	t.deepEqual(results.length, 4);
	let [ postsFeed ] = results.filter(entry => entry.outputPath.endsWith("/posts.xml"));
	t.truthy(postsFeed.content.startsWith(`<?xml version="1.0" encoding="utf-8"?>`));
	t.truthy(postsFeed.content.includes('<title>Posts</title>'))

	let [ photosFeed ] = results.filter(entry => entry.outputPath.endsWith("/photos.xml"));
	t.truthy(photosFeed.content.startsWith(`<?xml version="1.0" encoding="utf-8"?>`));
	t.truthy(photosFeed.content.includes('<title>Photos</title>'))
})
