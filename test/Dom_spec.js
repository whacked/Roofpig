/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
//= require Dom

//TODO: Make selenium work somehow. 'rake konacha:run' shows errors.

({
  state(button) {
    return false;
  }
});
//  if button.css('display') == 'none'
//    'hidden'
//  else
//    if button.attr('disabled') == 'disabled'
//      'disabled'
//    else
//      'on'

describe("Dom#constructor", () => xit("creates the right buttons with the right states", function() {}));
//    row = new Dom()
//    expect(state(row.reset)'reset').to.equal('on')
//    expect(state(row.prev) 'prev' ).to.equal('disabled')
//    expect(state(row.next) 'next' ).to.equal('on')
//    expect(state(row.pause)'pause').to.equal('hidden')
//    expect(state(row.play) 'play' ).to.equal('on')
