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
