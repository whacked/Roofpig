/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
//= require three.min
//= require Colors
//= require Layer
//= require SingleMove


describe("Colors", function() {
  describe("of", function() {
    it("has default values", function() {
      const colors = new Colors(new PovTracker(), "", "", "");
      expect(colors.of(Layer.R)).to.equal('#0d0');
      expect(colors.of(Layer.L)).to.equal('#07f');
      expect(colors.of(Layer.F)).to.equal('red');
      expect(colors.of(Layer.B)).to.equal('orange');
      expect(colors.of(Layer.U)).to.equal('yellow');
      expect(colors.of(Layer.D)).to.equal('#eee');
      expect(colors.of('solved')).to.equal('#444');
      expect(colors.of('ignored')).to.equal('#888');

      expect(colors.of('L')).to.equal(colors.of(Layer.L));
      expect(colors.of('F')).to.equal(colors.of(Layer.F));

      return expect(() => colors.of('UNKNOWN')).to.throw(Error);
    });

    return it("can change colors", function() {
      const colors = new Colors(new PovTracker(), "", "", "", "R:o L:#abc solved:r c:#123");

      expect(colors.of(Layer.R)).to.equal('orange');
      expect(colors.of(Layer.L)).to.equal('#abc');
      expect(colors.of('solved')).to.equal('red');
      expect(colors.of('cube')).to.equal('#123');

      expect(colors.of(Layer.U)).to.equal('yellow');
      return expect(colors.of(Layer.D)).to.equal('#eee');
    });
  });

  describe("#to_draw", function() {
    it("is colored by default", function() {
      const colors = new Colors(new PovTracker(), "", "");
      expect(colors.to_draw('UFR', 'F')).to.deep.equal({color: colors.of('F'), hovers: true});
      expect(colors.to_draw('DB', 'B')).to.deep.equal({color: colors.of('B'), hovers: true});
      return expect(colors.to_draw('L', 'L')).to.deep.equal({color: colors.of('L'), hovers: true});
    });

    it("colors only specified stickers", function() {
      const colors = new Colors(new PovTracker(), "U*", "");
      expect(colors.to_draw('UFR', 'F')).to.deep.equal({color: colors.of('F'), hovers: true});
      expect(colors.to_draw('DB', 'B')).to.deep.equal({color: colors.of('ignored'), hovers: false});
      return expect(colors.to_draw('L', 'L')).to.deep.equal({color: colors.of('ignored'), hovers: false});
    });

    it("solved overrides colored", function() {
      const colors = new Colors(new PovTracker(), "U*", "F*");
      expect(colors.to_draw('UFR', 'F')).to.deep.equal({color: colors.of('solved'), hovers: false});
      expect(colors.to_draw('UR', 'U')).to.deep.equal({color: colors.of('U'), hovers: true});
      expect(colors.to_draw('F', 'F')).to.deep.equal({color: colors.of('solved'), hovers: false});
      return expect(colors.to_draw('L', 'L')).to.deep.equal({color: colors.of('ignored'), hovers: false});
    });

    it("last tweak color wins", function() {
      const colors = new Colors(new PovTracker(), "*", "", "R:U* L:F*");
      expect(colors.to_draw('D', 'D')).to.deep.equal({color: colors.of('D'), hovers: true}); //untweaked
      expect(colors.to_draw('U', 'U')).to.deep.equal({color: colors.of('R'), hovers: true}); //tweaked
      expect(colors.to_draw('F', 'F')).to.deep.equal({color: colors.of('L'), hovers: true}); //tweaked
      return expect(colors.to_draw('UF', 'U')).to.deep.equal({color: colors.of('L'), hovers: true});
    }); //double tweaked

    return describe("tweaks", function() {
      it("sets X and colors", function() {
        const colors = new Colors(new PovTracker(), "", "*", ".Xx:uFR  D.L:UfR");

        expect(colors.to_draw('UFR', 'U')).to.deep.equal({color: colors.of('D'), hovers: true});
        expect(colors.to_draw('UFR', 'F')).to.deep.equal({color: colors.of('solved'), hovers: true, x_color: 'black'});
        return expect(colors.to_draw('UFR', 'R')).to.deep.equal({color: colors.of('L'), hovers: true, x_color: 'white'});
      });

      return it("overrides colored and solved", function() {
        const colors = new Colors(new PovTracker(), "U*", "D*", "L:U  R:D");

        expect(colors.to_draw('U', Layer.U).color).to.equal(colors.of(Layer.L));
        return expect(colors.to_draw('D', Layer.D).color).to.equal(colors.of(Layer.R));
      });
    });
  });

  return describe("side pov adjustments", function() {
    it("side colors", function() {
      const plain_colors = new Colors(new PovTracker(), "", "", "");
      const pov_colors = new Colors(new PovTracker(new SingleMove("S")), "", "", "");
      expect(pov_colors.of('F')).to.equal(plain_colors.of('F'));
      return expect(pov_colors.of('R')).to.equal(plain_colors.of('U'));
    });

    it("colored", function() {
      const colors = new Colors(new PovTracker(new SingleMove("S")), "u", "", "");
      expect(colors.to_draw('U', 'U')).to.deep.equal({color: colors.of('ignored'), hovers: false});
      return expect(colors.to_draw('R', 'R')).to.deep.equal({color: colors.of('R'), hovers: true});
    });

    it("solved", function() {
      const colors = new Colors(new PovTracker(new SingleMove("S")), "Ufr", "r", "");
      expect(colors.to_draw('R', 'R')).to.deep.equal({color: colors.of('ignored'), hovers: false});
      return expect(colors.to_draw('D', 'D')).to.deep.equal({color: colors.of('solved'), hovers: false});
    });

    return it("tweaks", function() {
      const untweaked = new Colors(new PovTracker(new SingleMove("S")), "", "", "");
      expect(untweaked.to_draw('RF', 'R'), 1).to.deep.equal({color: untweaked.of('R'), hovers: true});
      expect(untweaked.to_draw('LU', 'L'), 22).to.deep.equal({color: untweaked.of('L'), hovers: true});

      const tweaked = new Colors(new PovTracker(new SingleMove("S")), "", "", "X:Uf RF:DL");
      expect(tweaked.to_draw('RF', 'R')).to.deep.equal({color: tweaked.of('R'), hovers: true, x_color: 'black'});
      return expect(tweaked.to_draw('LU', 'L')).to.deep.equal({color: tweaked.of('D'), hovers: true});
    });
  });
});
