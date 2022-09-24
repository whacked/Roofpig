/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
//= require three.min
//= require SingleMove

describe("SingleMove", function() {

  let move_should_be;
  describe("#constructor", () => it("sets the right attributes", function() {
    const time = 200;

    move_should_be(new SingleMove("U"),  Layer.U,  1, false, 2*time);
    move_should_be(new SingleMove("U2"), Layer.U,  2, false, 3*time);
    move_should_be(new SingleMove("U'"), Layer.U, -1, false, 2*time);
    move_should_be(new SingleMove("UZ"), Layer.U, -2, false, 3*time);

    move_should_be(new SingleMove("U>"), Layer.U, 1,  true, 2*time);
    move_should_be(new SingleMove("U>>"),Layer.U, 2,  true, 3*time);
    move_should_be(new SingleMove("U<"), Layer.U, -1, true, 2*time);
    return move_should_be(new SingleMove("U<<"),Layer.U, -2, true, 3*time);
  }));

  it("#to_s", function() {
    expect(new SingleMove("U1").to_s()).to.equal("U");
    expect(new SingleMove("U2").to_s()).to.equal("U2");
    expect(new SingleMove("U3").to_s()).to.equal("U'");
    return expect(new SingleMove("UZ").to_s()).to.equal("UZ");
  });

  it("#display_text", function() {
    expect(new SingleMove("U1").display_text({Zcode: "2"})).to.equal("U");
    expect(new SingleMove("U2").display_text({Zcode: "2"})).to.equal("U2");
    expect(new SingleMove("U3").display_text({Zcode: "2"})).to.equal("U'");
    expect(new SingleMove("UZ").display_text({Zcode: "2"})).to.equal("U2");
    expect(new SingleMove("UZ").display_text({Zcode: "Z"})).to.equal("UZ");

    expect(new SingleMove("U>").display_text({})).to.equal('');
    return expect(new SingleMove("U>").display_text({rotations: true})).to.equal('U>');
  });

  it("#count", function() {
    expect(new SingleMove("U2").count()).to.equal(1);

    expect(new SingleMove("U>>").count(false)).to.equal(0);
    return expect(new SingleMove("U>>").count(true)).to.equal(1);
  });

  it("#track_pov", function() {
    const map = PovTracker.start_map();

    new SingleMove("U").track_pov(map);
    expect(map).to.deep.equal(PovTracker.start_map());

    new SingleMove("S").track_pov(map);
    return expect(map).to.deep.equal({B: "B", D: "L", F: "F", L: "U", R: "D", U: "R"});
  });

  it("#as_brdflu", function() {
    expect(new SingleMove("U2").as_brdflu()).to.equal("U2");
    expect(new SingleMove("M").as_brdflu()).to.equal("L' R");
    expect(new SingleMove("M2").as_brdflu()).to.equal("L2 R2");
    expect(new SingleMove("M'").as_brdflu()).to.equal("L R'");
    expect(new SingleMove("E").as_brdflu()).to.equal("D' U");
    return expect(new SingleMove("S").as_brdflu()).to.equal("B F'");
  });

  return move_should_be = function(move, layer, turns, is_rotation, turn_time) {
    expect(move.layer, move.to_s()).to.equal(layer);
    expect(move.turns, move.to_s()).to.equal(turns);
    expect(move.is_rotation, move.to_s()).to.equal(is_rotation);
    return expect(move.turn_time, move.to_s()).to.equal(turn_time);
  };
});
