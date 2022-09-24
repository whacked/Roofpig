import { standardize_name, side_name, log_error } from './utils'

interface FIXME_Result {
  type: string
  type_filter: string
  piece: string
  sides: string
}


export enum PieceNames {
  'B', 'BL', 'BR', 'D', 'DB', 'DBL', 'DBR', 'DF', 'DFL', 'DFR', 'DL', 'DR', 'F', 'FL', 'FR', 'L', 'R', 'U', 'UB', 'UBL', 'UBR', 'UF', 'UFL', 'UFR', 'UL', 'UR'
}

type Matches = { [P in PieceNames]?: any };

//Named in flawed analogy with Regexp
export class Cubexp {

  matches: Matches;

  constructor(cubexp_string) {
    if (cubexp_string == null) { cubexp_string = ""; }
    this.matches = {};
    for (const piece in PieceNames) {
      this.matches[piece] = {};
    }

    for (let expression of cubexp_string.split(" ")) {
      const exp = this._parse(expression);

      switch (exp.type) {
        case 'XYZ':
          this._add_match(exp.piece, exp.type_filter, exp.sides);
          break;
        case 'X-':
          for (const piece in PieceNames) {
            let excluded = false;
            for (const side of exp.piece.split('')) {
              if (!excluded) { excluded = piece.indexOf(side) > -1; }
            }
            if (!excluded) {
              this._add_match(piece, exp.type_filter);
            }
          }
          break;
        case 'X*':
          for (const piece in PieceNames) {
            for (const side of exp.piece.split('')) {
              if (piece.indexOf(side) > -1) {
                this._add_match(piece, exp.type_filter);
              }
            }
          }
          break;
        case '*':
          for (const piece in PieceNames) {
            this._add_match(piece, exp.type_filter);
          }
          break;
        case 'x':
          for (const piece in PieceNames) {
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
      for (let side of piece.split('')) {
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
      return sides.split('').map((side) =>
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
}
