import test from "ava";
import { feedPlugin } from "../.eleventy.js";

// https://github.com/11ty/plugin-rss/issues/50
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

test("JSON virtual template uses `metadata.subtitle` for description", async (t) => {
	const { default: Eleventy } = await import("@11ty/eleventy");

	let elev = new Eleventy("./test", "./test/_site", {
		config: function (eleventyConfig) {
			eleventyConfig.addTemplate("virtual.md", `# Hello`, { tags: ["posts"] })

			eleventyConfig.addPlugin(feedPlugin, {
				type: "json",
				outputPath: "/feed.json",
				collection: {
					name: "posts",
				},
				metadata: {
					subtitle: "My subtitle",
				},
			});
		},
	});

	let results = await elev.toJSON();
	let [ feed ] = results.filter(entry => entry.outputPath.endsWith(".json"));
	t.is(JSON.parse(feed.content).description, "My subtitle");
});

// https://github.com/11ty/plugin-rss/issues/63
async function getFeedTitles(collectionOptions, reorder) {
	const { default: Eleventy } = await import("@11ty/eleventy");

	let elev = new Eleventy("./test", "./test/_site", {
		config: function (eleventyConfig) {
			for(let j = 1; j <= 5; j++) {
				eleventyConfig.addTemplate(`post${j}.md`, `# Hello`, { title: `Post ${j}`, date: new Date(Date.UTC(2025, 0, j)), tags: ["blog"] });
			}
			eleventyConfig.addCollection("posts", (collectionApi) => {
				let posts = collectionApi.getFilteredByTag("blog");
				return reorder ? reorder(posts) : posts;
			});

			eleventyConfig.addPlugin(feedPlugin, {
				type: "rss",
				outputPath: "/feed.xml",
				collection: {
					name: "posts",
					limit: 2,
					...collectionOptions,
				},
			});
		},
	});

	let results = await elev.toJSON();
	let [ feed ] = results.filter(entry => entry.outputPath.endsWith(".xml"));
	return Array.from(feed.content.matchAll(/<title>(Post \d)<\/title>/g), match => match[1]);
}

test("Feed shows newest entries from an ascending collection (default)", async (t) => {
	t.deepEqual(await getFeedTitles({}), ["Post 5", "Post 4"]);
});

test("Feed shows oldest entries from a descending collection with `sort: \"auto\"`", async (t) => {
	t.deepEqual(await getFeedTitles({ sort: "auto" }, posts => posts.reverse()), ["Post 1", "Post 2"]);
});

test("Feed shows newest entries from a descending collection with `sort: \"descending\"`", async (t) => {
	t.deepEqual(await getFeedTitles({ sort: "descending" }, posts => posts.reverse()), ["Post 5", "Post 4"]);
});

test("Feed shows newest entries from an unordered collection with `sort: \"descending\"`", async (t) => {
	let order = [3, 5, 1, 4, 2];
	t.deepEqual(await getFeedTitles({ sort: "descending" }, posts => order.map(j => posts[j - 1])), ["Post 5", "Post 4"]);
});

test("Feed shows oldest entries from an unordered collection with `sort: \"ascending\"`", async (t) => {
	let order = [3, 5, 1, 4, 2];
	t.deepEqual(await getFeedTitles({ sort: "ascending" }, posts => order.map(j => posts[j - 1])), ["Post 1", "Post 2"]);
});

test("Invalid `collection.sort` throws", async (t) => {
	let error = await t.throwsAsync(() => getFeedTitles({ sort: "newest" }));
	t.regex(error.originalError.message, /collection\.sort/);
});

// https://github.com/11ty/plugin-rss/issues/66
for(let type of ["rss", "atom", "json"]) {
	test(`${type} feed skips entries with \`permalink: false\``, async (t) => {
		const { default: Eleventy } = await import("@11ty/eleventy");

		let elev = new Eleventy("./test", "./test/_site", {
			config: function (eleventyConfig) {
				eleventyConfig.addTemplate("post1.md", `# Hello`, { title: "Post 1", tags: ["posts"] });
				eleventyConfig.addTemplate("post2.md", `# Hello`, { title: "Post 2", tags: ["posts"], permalink: false });

				eleventyConfig.addPlugin(feedPlugin, {
					type,
					outputPath: "/feed.txt",
					collection: {
						name: "posts",
						limit: 1,
					},
				});
			},
		});

		let results = await elev.toJSON();
		let [ feed ] = results.filter(entry => entry.outputPath && entry.outputPath.endsWith(".txt"));
		t.true(feed.content.includes("Post 1"));
		t.false(feed.content.includes("Post 2"));
	});
}
