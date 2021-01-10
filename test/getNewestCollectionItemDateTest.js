const test = require("ava");
const getNewestCollectionItemDate = require("../src/getNewestCollectionItemDate");

test("getNewestCollectionItemDate", t => {
  let first = new Date(2018, 1, 1);
  let second = new Date(2019, 1, 1);

  t.deepEqual(getNewestCollectionItemDate([{
    date: first
  },{
    date: second
  }]), second);
});

test("getNewestCollectionItemDate (empty)", t => {
  let now = new Date();

  t.deepEqual(getNewestCollectionItemDate(null, now), now);
  t.deepEqual(getNewestCollectionItemDate([], now), now);
});
