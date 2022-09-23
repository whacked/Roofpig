/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
describe("EventHandlers", () => it("@_turns", function() {
  expect(EventHandlers._turns({shiftKey: false, altKey: false})).to.equal('');
  expect(EventHandlers._turns({shiftKey: false, altKey:  true})).to.equal('2');
  expect(EventHandlers._turns({shiftKey:  true, altKey: false})).to.equal("'");
  expect(EventHandlers._turns({shiftKey: false, altKey:  true})).to.equal('2');

  expect(EventHandlers._turns({shiftKey: false, altKey: false}, true)).to.equal("'");
  expect(EventHandlers._turns({shiftKey: false, altKey:  true}, true)).to.equal('Z');
  expect(EventHandlers._turns({shiftKey:  true, altKey: false}, true)).to.equal('');
  return expect(EventHandlers._turns({shiftKey: false, altKey:  true}, true)).to.equal('Z');
}));

