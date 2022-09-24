/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
//= require Cubexp

const exp = e => new Cubexp(e);

describe("Cubexp", function() {
  describe("matches", function() {
    it("simple piece names", function() {
      expect(JSON.stringify(exp("UFR").matches)).to.equal(JSON.stringify(exp("UFR").matches));
      expect(exp("UFR").matches).to.deep.equal(exp("UFR").matches);
      expect(exp("UFR FL").matches).to.deep.equal(exp("UFR FL").matches);
      expect(exp("").matches).to.deep.equal(exp("").matches);
      return expect(exp(null).matches).to.deep.equal(exp("").matches);
    });

    it("Shorthand syntax", function() {
      expect(exp("U*").matches).to.deep.equal(exp("U UB UBL UBR UF UFL UFR UL UR").matches);
      expect(exp("F*").matches).to.deep.equal(exp("DF DFL DFR F FL FR UF UFL UFR").matches);
      expect(exp("UF*").matches).to.deep.equal(exp("U UB UBL UBR UL UR DF DFL DFR F FL FR UF UFL UFR").matches);

      expect(exp("B-").matches).to.deep.equal(exp("D DF DFL DFR DL DR F FL FR L R U UF UFL UFR UL UR").matches);
      expect(exp("BF-").matches).to.deep.equal(exp("D DL DR L R U UL UR").matches);
      expect(exp("BL-").matches).to.deep.equal(exp("D DF DFR DR F FR R U UF UFR UR").matches);
      expect(exp("DLB-").matches).to.deep.equal(exp("UFR UF UR FR U F R").matches);

      expect(exp("*").matches).to.deep.equal(exp("B BL BR D DB DBL DBR DF DFL DFR DL DR F FL FR L R U UB UBL UBR UF UFL UFR UL UR").matches);

      return expect(exp("f").matches).to.deep.equal(exp("dF dFl dFr F Fl Fr uF uFl uFr").matches);
    });

    it("type filter syntax", function() {
      expect(exp("DBL-/e").matches).to.deep.equal(exp("UF UR FR").matches);

      expect(exp("U*/c").matches).to.deep.equal(exp("UBL UBR UFL UFR").matches);
      expect(exp("F*/cm").matches).to.deep.equal(exp("DFL DFR F UFL UFR").matches);

      expect(exp("B-/m").matches).to.deep.equal(exp("D F L R U").matches);

      expect(exp("*/ce").matches).to.deep.equal(exp("BL BR DB DBL DBR DF DFL DFR DL DR FL FR UB UBL UBR UF UFL UFR UL UR").matches);

      return expect(exp("f/me").matches).to.deep.equal(exp("dF F Fl Fr uF").matches);
    });

    it("permuted names", function() {
      expect(exp("FRU").matches).to.deep.equal(exp("UFR").matches);
      return expect(exp("Fur LF").matches).to.deep.equal(exp("uFr FL").matches);
    });

    it("ignores ill formed expressions", () => expect(exp("Kraken").matches).to.deep.equal(exp("").matches));

    return it("selections accumulate", function() {
      expect(exp("Ufr ufR").matches).to.deep.equal(exp("UfR").matches);
      return expect(exp("UF f/e").matches).to.deep.equal(exp("UF Fl Fr dF").matches);
    });
  });


  describe("#matches_sticker", function() {
    it("doesn't have the substring bug", function() {
      const ufr_fr = exp("UFR FR");
      expect(ufr_fr.matches_sticker("UFR", "U")).to.be.true;
      expect(ufr_fr.matches_sticker("FR", "R")).to.be.true;
      expect(ufr_fr.matches_sticker("UF", "F")).to.be.false;
      return expect(ufr_fr.matches_sticker("U", "U")).to.be.false;
    });

    it("individual stickers", function() {
      const sample = exp("dFL dFr Bu");
      expect(sample.matches_sticker("DFL", "D"), 1).to.be.false;
      expect(sample.matches_sticker("DFL", "F"), 2).to.be.true;
      expect(sample.matches_sticker("DFL", "L"), 3).to.be.true;

      expect(sample.matches_sticker("DFR", "D"), 4).to.be.false;
      expect(sample.matches_sticker("DFR", "F"), 5).to.be.true;
      expect(sample.matches_sticker("DFR", "R"), 6).to.be.false;

      expect(sample.matches_sticker("BU", "B"), 7).to.be.true;
      return expect(sample.matches_sticker("BU", "U"), 8).to.be.false;
    });


    return it("handles permuted piece names", function() {
      const ufr_fr = exp("UFR FR");
      expect(ufr_fr.matches_sticker("FRU", "F")).to.be.true;
      expect(ufr_fr.matches_sticker("URF", "F")).to.be.true;
      expect(ufr_fr.matches_sticker("RF", "F")).to.be.true;
      return expect(ufr_fr.matches_sticker("UFFR", "F")).to.be.false;
    });
  });

  return describe("@selected_pieces", function() {
    it("returns the selected pieces", () => expect(exp("DBL-/e DL").selected_pieces()).to.deep.equal(["DL", "FR", "UF", "UR"]));

    return it("recognizes individual stickers", () => expect(exp("UfR Dl").selected_pieces()).to.deep.equal(["Dl", "UfR"]));
  });
});
