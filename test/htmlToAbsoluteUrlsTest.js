const test = require("ava");
const htmlToAbsUrls = require("../src/htmlToAbsoluteUrls.js");

test("Changes a link href", async t => {
  t.is(await htmlToAbsUrls(`<a href="#testanchor">Hello</a>`, "http://example.com/"), `<a href="http://example.com/#testanchor">Hello</a>`);
  t.is(await htmlToAbsUrls(`<a href="#testanchor">Hello</a>`, "http://example.com/web/"), `<a href="http://example.com/web/#testanchor">Hello</a>`);
  t.is(await htmlToAbsUrls(`<a href="/test.html">Hello</a>`, "http://example.com/"), `<a href="http://example.com/test.html">Hello</a>`);
  t.is(await htmlToAbsUrls(`<img src="/test.png">`, "http://example.com/"), `<img src="http://example.com/test.png">`);
  t.is(await htmlToAbsUrls(`<a href="http://someotherdomain/">Hello</a>`, "http://example.com/"), `<a href="http://someotherdomain/">Hello</a>`);
});

test("Bad link href", async t => {
  t.is(await htmlToAbsUrls(`<a href="http://#">Hello</a>`, "http://example.com/"), `<a href="http://#">Hello</a>`);
});

test("Line breaks, Issue #12", async t => {
  let processOptions = {
    closingSingleTag: "slash"
  };

  t.is(await htmlToAbsUrls(`<br/>`, "http://example.com/"), `<br>`);
  t.is(await htmlToAbsUrls(`<br/>`, "http://example.com/", processOptions), `<br />`);

  let processedHtml = await htmlToAbsUrls(`<img src="/test.png">`, "http://example.com/", processOptions);
  t.is(processedHtml, `<img src="http://example.com/test.png" />`);
});

