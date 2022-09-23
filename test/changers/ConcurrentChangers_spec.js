/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
//= require changers/ConcurrentChangers

describe("ConcurrentChangers", () => it("#finished", function() {
  const true_func = () => true;
  const false_func = () => false;

  const c1 = { finished: false_func };
  const c2 = { finished: false_func };

  const cc = new ConcurrentChangers([c1, c2]);
  expect(cc.finished()).to.be.false;

  c1.finished = true_func;
  expect(cc.finished()).to.be.false;

  c2.finished = true_func;
  return expect(cc.finished()).to.be.true;
}));
