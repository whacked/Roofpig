/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
//= require three.min
//= require Pieces3D

const mock_scene = { add() {} };

const mock_colors = {
  to_draw() {
    return { hovers: true, color: 'red'};
  },
  of() {
    return 'black';
  }
};
describe("Pieces3D", function() {
  it(".make_stickers() creates Pieces3D.UBL, Pieces3D.UL, Pieces3D.F etc", function() {
    let piece;
    const pieces = new Pieces3D(mock_scene, 1, mock_colors);

    for (piece of [pieces.UBL, pieces.UL, pieces.U]) {
      expect(piece).to.be.defined;
    }

    return (() => {
      const result = [];
      for (piece of [pieces.BLU, pieces.WTF, pieces.LU]) {
        result.push(expect(piece).to.be.undefined);
      }
      return result;
    })();
  });

  describe("keeps track of pieces and stickers", function() {
    it("for regular moves", function() {
      const pieces = new Pieces3D(mock_scene, 1, mock_colors);

      expect(pieces.at.UFR.name).to.equal('UFR');
      expect(pieces.at.DR.name).to.equal('DR');
      expect(pieces.UFR.sticker_locations.join('')).to.equal('UFR');
      expect(pieces.DR.sticker_locations.join('')).to.equal('DR');

      pieces.move(Layer.R, 1);

      expect(pieces.at.UFR.name).to.equal('DFR'); //The DFR piece is now in the UFR position
      expect(pieces.at.DR.name).to.equal('BR');
      expect(pieces.DFR.sticker_locations.join('')).to.equal('FUR'); // The D sticker of the DFR piece is on the F side. F is on U. R is on R.
      expect(pieces.BR.sticker_locations.join('')).to.equal('DR');

      pieces.move(Layer.U, 2);

      expect(pieces.at.UFR.name).to.equal('UBL');
      expect(pieces.at.DR.name).to.equal('BR');
      return expect(pieces.UBL.sticker_locations.join('')).to.equal('UFR');
    });

    return it("for slice moves", function() {
      const pieces = new Pieces3D(mock_scene, 1, mock_colors);

      pieces.move(Layer.M, 1);

      expect(pieces.at.UF.name).to.equal('UB');
      expect(pieces.at.U.name).to.equal('B');
      expect(pieces.UB.sticker_locations.join('')).to.equal('FU');
      expect(pieces.B.sticker_locations.join('')).to.equal('U');

      pieces.move(Layer.E, 2);

      expect(pieces.at.FR.name).to.equal('BL');
      expect(pieces.at.F.name).to.equal('D');
      expect(pieces.BL.sticker_locations.join('')).to.equal('FR');
      expect(pieces.U.sticker_locations.join('')).to.equal('B');

      return expect(pieces.at.UFR.name).to.equal('UFR');
    });
  });

  return it("#solved", function() {
    const solved = 'B BL BR D DB DBL DBR DF DFL DFR DL DR F FL FR L R U UB UBL UBR UF UFL UFR UL UR ';

    const pieces = new Pieces3D(mock_scene, 1, mock_colors);
    expect(pieces.state()).to.equal(solved);

    pieces.move(Layer.R, 2);
    pieces.move(Layer.R, -2);
    return expect(pieces.state()).to.equal(solved);
  });
});
