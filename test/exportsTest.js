import test from "ava";
import pluginRss, * as named from "../.eleventy.js";

// https://github.com/11ty/plugin-rss/issues/91
test("Named exports are also available on the default export", (t) => {
	for(let name of Object.keys(named)) {
		if(name === "default" || name === "rssPlugin") {
			continue;
		}
		t.is(typeof pluginRss[name], "function", name);
		t.is(pluginRss[name], named[name], name);
	}
});
