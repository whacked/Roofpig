/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
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

const make_moves = (pieces, moves) => (() => {
  const result = [];
  for (let move of Array.from(moves.split(' '))) {
    const [layer, turns, is_rotation] = Array.from(Move.parse_code(move));
    result.push(pieces.move(layer, turns));
  }
  return result;
})();

describe("Pieces3D", function() {
  it("constructor creates Pieces3D.UBL, Pieces3D.UL, Pieces3D.F etc", function() {
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

  describe("#move tracks pieces and stickers", function() {
    it("B move", function() {
      const pieces = new Pieces3D(mock_scene, 1, mock_colors);
      pieces.move(Layer.B, 1);

      expect(pieces.at.UB.name).to.equal('BR');
      expect(pieces.BR.sticker_locations.join('')).to.equal('BU');
      return expect(pieces.UB.sticker_locations.join('')).to.equal('LB');
    });

    it("R move", function() {
      const pieces = new Pieces3D(mock_scene, 1, mock_colors);
      pieces.move(Layer.R, 1);

      expect(pieces.at.DR.name).to.equal('BR');
      expect(pieces.BR.sticker_locations.join('')).to.equal('DR');
      return expect(pieces.DR.sticker_locations.join('')).to.equal('FR');
    });

    it("D move", function() {
      const pieces = new Pieces3D(mock_scene, 1, mock_colors);
      pieces.move(Layer.D, 1);

      expect(pieces.at.DF.name).to.equal('DL');
      expect(pieces.DL.sticker_locations.join('')).to.equal('DF');
      return expect(pieces.DF.sticker_locations.join('')).to.equal('DR');
    });

    it("F move", function() {
      const pieces = new Pieces3D(mock_scene, 1, mock_colors);
      pieces.move(Layer.F, 1);

      expect(pieces.at.FL.name).to.equal('DF');
      expect(pieces.DF.sticker_locations.join('')).to.equal('LF');
      return expect(pieces.FL.sticker_locations.join('')).to.equal('FU');
    });

    it("L move", function() {
      const pieces = new Pieces3D(mock_scene, 1, mock_colors);
      pieces.move(Layer.L, 1);

      expect(pieces.at.DL.name).to.equal('FL');
      expect(pieces.FL.sticker_locations.join('')).to.equal('DL');
      return expect(pieces.DL.sticker_locations.join('')).to.equal('BL');
    });

    it("U move", function() {
      const pieces = new Pieces3D(mock_scene, 1, mock_colors);
      pieces.move(Layer.U, 1);

      expect(pieces.at.UF.name).to.equal('UR');
      expect(pieces.UR.sticker_locations.join('')).to.equal('UF');
      return expect(pieces.UF.sticker_locations.join('')).to.equal('UL');
    });

    it("M move", function() {
      const pieces = new Pieces3D(mock_scene, 1, mock_colors);
      pieces.move(Layer.M, 1);

      expect(pieces.at.UF.name).to.equal('UB');
      expect(pieces.UB.sticker_locations.join('')).to.equal('FU');
      return expect(pieces.UF.sticker_locations.join('')).to.equal('FD');
    });

    it("E move", function() {
      const pieces = new Pieces3D(mock_scene, 1, mock_colors);
      pieces.move(Layer.E, 1);

      expect(pieces.at.FR.name).to.equal('FL');
      expect(pieces.FL.sticker_locations.join('')).to.equal('RF');
      return expect(pieces.FR.sticker_locations.join('')).to.equal('RB');
    });

    it("S move", function() {
      const pieces = new Pieces3D(mock_scene, 1, mock_colors);
      pieces.move(Layer.S, 1);

      expect(pieces.at.UL.name).to.equal('DL');
      expect(pieces.DL.sticker_locations.join('')).to.equal('LU');
      return expect(pieces.UL.sticker_locations.join('')).to.equal('RU');
    });

    return it("many random moves", function() {
      const pieces = new Pieces3D(mock_scene, 1, mock_colors);

      make_moves(pieces, "M' B' U R' S2 M2 L D F E' R2 D2 B2 R L2 E2 B U2 D' F' S F2 L' U'");

      // check that the sticker tracking matches the piece tracking
      return ['B','BL','BR','D','DB','DBL','DBR','DF','DFL','DFR','DL','DR','F','FL','FR','L','R','U','UB','UBL','UBR','UF','UFL','UFR','UL','UR'].map((name) =>
        expect(name.split('').sort().join('')).to.equal(pieces.at[name].sticker_locations.sort().join('')));
    });
  });


  return describe("#solved", function() {
    it("simple cases", function() {
      const pieces = new Pieces3D(mock_scene, 1, mock_colors);
      expect(pieces.solved()).to.equal(true);

      pieces.move(Layer.R, 2);
      expect(pieces.solved()).to.equal(false);

      pieces.move(Layer.R, -2);
      return expect(pieces.solved()).to.equal(true);
    });


    return it("works in different orientation", function() {
      const pieces = new Pieces3D(mock_scene, 1, mock_colors);
      expect(pieces.solved(), 1).to.equal(true);

      pieces.move(Layer.F, 1);
      expect(pieces.solved(), 2).to.equal(false);
      pieces.move(Layer.S, 1);
      expect(pieces.solved(), 3).to.equal(false);
      pieces.move(Layer.B, 3);
      expect(pieces.solved(), 4).to.equal(true);

      make_moves(pieces, "F S B'");
      expect(pieces.solved(), 5).to.equal(true);

      make_moves(pieces, "F S B'");
      expect(pieces.solved(), 6).to.equal(true);

      make_moves(pieces, "R M' L'");
      return expect(pieces.solved(), 7).to.equal(true);
    });
  });
});


