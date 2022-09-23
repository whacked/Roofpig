/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
//= require Pov

describe("Pov", function() {
  describe("track", () => it("handles move or array", function() {
    let pov = new Pov();
    expect(pov.map).to.deep.equal(Pov.start_map());

    pov.track(new Move("M"));
    expect(pov.map).to.deep.equal({B: 'U', D: 'B', F: 'D', L: 'L', R: 'R', U: 'F'});

    pov = new Pov();
    pov.track([new Move("M"), new Move("F'"), new Move("E2")]);
    return expect(pov.map).to.deep.equal({B: 'U', D: 'F', F: 'D', L: 'R', R: 'L', U: 'B'});
  }));

  describe("cube_to_hand", () => it("cube_to_hand", function() {
    const pov = new Pov(new Move("S'"));
    expect(pov.cube_to_hand("XYZ:URF")).to.equal("XYZ:LUF");
    expect(pov.cube_to_hand("XYZ:Urf")).to.equal("XYZ:Luf");
    return expect(pov.cube_to_hand(null)).to.equal(null);
  }));

  return describe("hand_to_cube", () => it("hand_to_cube", function() {
    let pov = new Pov(new Move("S'"));
    expect(pov.hand_to_cube("F"), 1).to.equal("F");
    expect(pov.hand_to_cube("L"), 1).to.equal("U");

    pov = new Pov(new Move("E"));
    expect(pov.hand_to_cube("F"), 1).to.equal("L");
    expect(pov.hand_to_cube("f"), 1).to.equal("l");

    return expect(pov.cube_to_hand(null)).to.equal(null);
  }));
});
