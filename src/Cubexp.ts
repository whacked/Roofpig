/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
//= require <utils.coffee>

import { standardize_name, side_name, log_error } from './utils'

interface FIXME_Result {
  type: string
  type_filter: string
  piece: string
  sides: string
}

//Named in flawed analogy with Regexp
export const Cubexp = (function () {
  let PIECE_NAMES = undefined;
  let Cubexp = class Cubexp {
    matches: {};
    static initClass() {

      PIECE_NAMES = ['B', 'BL', 'BR', 'D', 'DB', 'DBL', 'DBR', 'DF', 'DFL', 'DFR', 'DL', 'DR', 'F', 'FL', 'FR', 'L', 'R', 'U', 'UB', 'UBL', 'UBR', 'UF', 'UFL', 'UFR', 'UL', 'UR'];
    }

    constructor(cubexp_string) {
      let piece;
      if (cubexp_string == null) { cubexp_string = ""; }
      this.matches = {};
      for (piece of Array.from(PIECE_NAMES)) {
        this.matches[piece] = {};
      }

      for (let expression of Array.from(cubexp_string.split(" "))) {
        var side;
        const exp = this._parse(expression);

        switch (exp.type) {
          case 'XYZ':
            this._add_match(exp.piece, exp.type_filter, exp.sides);
            break;
          case 'X-':
            for (piece of Array.from(PIECE_NAMES)) {
              let excluded = false;
              for (side of Array.from(exp.piece.split(''))) {
                if (!excluded) { excluded = piece.indexOf(side) > -1; }
              }
              if (!excluded) {
                this._add_match(piece, exp.type_filter);
              }
            }
            break;
          case 'X*':
            for (piece of Array.from(PIECE_NAMES)) {
              for (side of Array.from(exp.piece.split(''))) {
                if (piece.indexOf(side) > -1) {
                  this._add_match(piece, exp.type_filter);
                }
              }
            }
            break;
          case '*':
            for (piece of Array.from(PIECE_NAMES)) {
              this._add_match(piece, exp.type_filter);
            }
            break;
          case 'x':
            for (piece of Array.from(PIECE_NAMES)) {
              if (piece.indexOf(exp.piece[0]) > -1) {
                this._add_match(piece, exp.type_filter, exp.piece);
              }
            }
            break;
          default:
            log_error(`Ignored unrecognized Cubexp '${expression}'.`);
        }
      }
    }

    matches_sticker(piece, side) {
      return (this.matches[standardize_name(piece)][side_name(side)] != null);
    }

    selected_pieces() {
      const result = [];
      for (let piece in this.matches) {
        const selections = this.matches[piece];
        let code = '';
        let selected = false;
        for (let side of Array.from(piece.split(''))) {
          if (!selected) { selected = selections[side]; }
          code += selections[side] ? side : side.toLowerCase();
        }
        if (selected) { result.push(code); }
      }
      return result;
    }

    _add_match(piece, type_filter, sides?) {
      if (sides == null) { sides = piece; }
      const piece_type = 'mec'[piece.length - 1];
      if (!type_filter || (type_filter.indexOf(piece_type) > -1)) {
        return Array.from(sides.split('')).map((side) =>
          (this.matches[piece][side] = true));
      }
    }

    _parse(expression): FIXME_Result {
      let exp;
      const result: FIXME_Result = {
        type: null,
        piece: null,
        type_filter: null,
        sides: null,
      };
      [exp, result.type_filter] = expression.split('/');
      result.piece = standardize_name(exp.toUpperCase());

      const last_char = exp[exp.length - 1];
      switch (last_char) {
        case "*":
          result.type = exp === '*' ? '*' : 'X*';
          break;
        case "-":
          result.type = 'X-';
          break;
        default:
          if (exp === result.piece.toLowerCase()) {
            result.type = 'x';
          } else {
            result.type = 'XYZ';
            result.sides = standardize_name(exp); // removes lower case letters
          }
      }
      return result;
    }
  };
  Cubexp.initClass();
  return Cubexp;
})();
