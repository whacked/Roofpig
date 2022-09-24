/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
//= require three.min
//= require Move

describe("Move", function() {

  describe("#make", function() {
    it('seen with to_s()', function() {
      expect(Move.make("F2", {}, 0).to_s(), 1).to.equal("F2");
      expect(Move.make("R" , {}, 0).to_s(), 1).to.equal("R");
      expect(Move.make("DZ", {}, 0).to_s(), 1).to.equal("DZ");
      expect(Move.make("B'", {}, 0).to_s(), 1).to.equal("B'");

      expect(Move.make("f", {}, 0).to_s(), 1).to.equal("(F S)");
      expect(Move.make("M", {}, 0).to_s(), 1).to.equal("M");
      expect(Move.make("d2", {}, 0).to_s(), 1).to.equal("(D2 E2)");
      expect(Move.make("x", {}, 0).to_s(), 1).to.equal("(R M' L')");
      expect(Move.make("y'", {}, 0).to_s(), 1).to.equal("(U' E D)");
      return expect(Move.make("z", {}, 0).to_s(), 1).to.equal("(F S B')");
    });

    return it('seen with as_brdflu()', function() {
      expect(Move.make("F2", {}, 0).as_brdflu(), 1).to.equal("F2");
      expect(Move.make("R" , {}, 0).as_brdflu(), 1).to.equal("R");
      expect(Move.make("DZ", {}, 0).as_brdflu(), 1).to.equal("D2");
      expect(Move.make("B'", {}, 0).as_brdflu(), 1).to.equal("B'");
      expect(Move.make("M", {}, 0).as_brdflu(), 1).to.equal("L' R");

      expect(Move.make("f", {}, 0).as_brdflu(), 1).to.equal("B");
      expect(Move.make("d2", {}, 0).as_brdflu(), 1).to.equal("U2");
      expect(Move.make("x", {}, 0).as_brdflu(), 1).to.equal("");
      expect(Move.make("y'", {}, 0).as_brdflu(), 1).to.equal("");
      return expect(Move.make("z", {}, 0).as_brdflu(), 1).to.equal("");
    });
  });

  describe("#parse_code", function() {
    it("parses all code variations", function() {
      expect(Move.parse_code("U1")).to.have.members([Layer.U, 1, false]);
      expect(Move.parse_code("B") ).to.have.members([Layer.B, 1, false]);

      expect(Move.parse_code("L2")).to.have.members([Layer.L, 2, false]);
      expect(Move.parse_code("L²")).to.have.members([Layer.L, 2, false]);

      expect(Move.parse_code("LZ") ).to.have.members([Layer.L,-2, false]);
      expect(Move.parse_code("L2'")).to.have.members([Layer.L,-2, false]);

      expect(Move.parse_code("D3")).to.have.members([Layer.D,-1, false]);
      expect(Move.parse_code("F'")).to.have.members([Layer.F,-1, false]);

      expect(() => Move.parse_code("Q2")).to.throw("Invalid Move code 'Q2'");
      expect(() => Move.parse_code("U0")).to.throw("Invalid Move code 'U0'");

      expect(Move.parse_code("M") ).to.have.members([Layer.M, 1, false]);
      expect(Move.parse_code("E2")).to.have.members([Layer.E, 2, false]);
      expect(Move.parse_code("S'")).to.have.members([Layer.S,-1, false]);

      expect(Move.parse_code("U>")).to.have.members([Layer.U, 1, true]);
      expect(Move.parse_code("L>>")).to.have.members([Layer.L, 2, true]);
      expect(Move.parse_code("L<<") ).to.have.members([Layer.L,-2, true]);
      expect(Move.parse_code("D<")).to.have.members([Layer.D,-1, true]);

      expect(Move.parse_code("M>")).to.have.members([Layer.M, 1, true]);
      expect(Move.parse_code("S>")).to.have.members([Layer.S, 1, true]);
      return expect(Move.parse_code("E>")).to.have.members([Layer.E, 1, true]);
    });

    return it("throws exceptions for bad codes", function() {
      expect(() => Move.parse_code("Q>")).to.throw("Invalid Move code 'Q>'");
      return expect(() => Move.parse_code("U<>")).to.throw("Invalid Move code 'U<>'");
    });
  });

  return describe("#turn_code", function() {
    it("returns correct code", function() {
      expect(Move.turn_code(1)).to.equal("");
      expect(Move.turn_code(2)).to.equal("2");
      expect(Move.turn_code(-1)).to.equal("'");
      expect(Move.turn_code(-2)).to.equal("Z");

      expect(Move.turn_code(1, true)).to.equal(">");
      expect(Move.turn_code(2, true)).to.equal(">>");
      expect(Move.turn_code(-1, true)).to.equal("<");
      return expect(Move.turn_code(-2, true)).to.equal("<<");
    });

    return describe("human_name", () => it("translates", function() {
      expect(Move.human_name("R+M'+L'")).to.equal("x");
      expect(Move.human_name("U2+EZ+DZ")).to.equal("y2");
      expect(Move.human_name("F'+S'+B")).to.equal("z'");
      return expect(Move.human_name("F2")).to.equal("F2");
    }));
  });
});
