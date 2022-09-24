/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
//= require changers/TimedChanger

describe("TimedChanger", () => it("easing starts and ends properly", function() {
  const c = new TimedChanger(1.0);
  expect(c._ease(c.start_time)).to.equal(0.0);
  return expect(c._ease(c.start_time + c.duration)).to.equal(c.duration);
}));