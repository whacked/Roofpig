/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
//= require three.min
//= require Tweaks

describe("Tweaks", function() {
  it("#for_sticker", function() {
    const tweaks = new Tweaks("X:Uf x:Dl RF:DL");

    expect(tweaks.for_sticker('UF', 'U'), 1).to.deep.equal(['X']);
    expect(tweaks.for_sticker('UF', 'F'), 2).to.deep.equal([]);
    expect(tweaks.for_sticker('DL', 'D'), 3).to.deep.equal(['x', 'R']);
    expect(tweaks.for_sticker('DL', 'L'), 4).to.deep.equal(['F']);
    return expect(tweaks.for_sticker('UFR','U'), 5).to.deep.equal([]);
  });

  it("handles syntax", function() {
    let tweaks = new Tweaks("Uf:X    DL:RF");
    return tweaks = new Tweaks("XYZ");
  });

  return it("handles Cubexps", function() {
    const tweaks = new Tweaks("X:DBL-");
    expect(tweaks.for_sticker('UFR', 'R')).to.deep.equal(['X']);
    expect(tweaks.for_sticker('UF',  'U')).to.deep.equal(['X']);
    expect(tweaks.for_sticker('F',   'F')).to.deep.equal(['X']);
    expect(tweaks.for_sticker('DFR', 'F')).to.deep.equal([]);
    return expect(tweaks.for_sticker('D',    'D')).to.deep.equal([]);
  });
});

//  it "'last wins'", ->
//    tweaks = new Tweaks("F:U* R:L*")
