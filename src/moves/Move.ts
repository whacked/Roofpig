/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS204: Change includes calls to have a more natural evaluation order
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
// Move utility functions

import { Layer } from "../Layer";
import { CompositeMove } from "./CompositeMove";
import { SingleMove } from "./SingleMove";

export const Move = (function () {
  let turn_code_pairs = undefined;
  let HUMAN_NAMES = undefined;
  let Move = class Move {
    static initClass() {

      turn_code_pairs = { '-2': ['Z', '2'], '-1': ["'", ''], 1: ['', "'"], 2: ['2', 'Z'] };

      HUMAN_NAMES = {
        "F2+S2+BZ": "z2",
        "F+S+B'": "z",
        "F'+S'+B": "z'",
        "U2+EZ+DZ": "y2",
        "U+E'+D'": "y",
        "U'+E+D": "y'",
        "R2+MZ+LZ": "x2",
        "R+M'+L'": "x",
        "R'+M+L": "x'",
      };
    }
    static make(code, world3d, speed) {
      let moves, t1, t2;
      if (code.indexOf('+') > -1) {
        return new CompositeMove(code, world3d, speed);

      } else if (['x', 'y', 'z'].includes(code[0])) {
        [t1, t2] = Array.from(turn_code_pairs[Move.parse_turns(code.substring(1))]);
        moves = (() => {
          switch (code[0]) {
            case 'x': return `R${t1}+M${t2}+L${t2}`;
            case 'y': return `U${t1}+E${t2}+D${t2}`;
            case 'z': return `F${t1}+S${t1}+B${t2}`;
          }
        })();
        return new CompositeMove(moves, world3d, speed, code);

      } else {
        let last_char_index;
        if ((code[1] === 'w') && ['U', 'D', 'L', 'R', 'F', 'B'].includes(code[0])) { last_char_index = 2; }
        if (['u', 'd', 'l', 'r', 'f', 'b'].includes(code[0])) { last_char_index = 1; }
        if (last_char_index) {
          [t1, t2] = Array.from(turn_code_pairs[Move.parse_turns(code.substring(last_char_index))]);
          moves = (() => {
            switch (code[0].toUpperCase()) {
              case 'R': return `R${t1}+M${t2}`;
              case 'L': return `L${t1}+M${t1}`;
              case 'U': return `U${t1}+E${t2}`;
              case 'D': return `D${t1}+E${t1}`;
              case 'F': return `F${t1}+S${t1}`;
              case 'B': return `B${t1}+S${t2}`;
            }
          })();
          return new CompositeMove(moves, world3d, speed, code);

        } else {
          return new SingleMove(code, world3d, speed);
        }
      }
    }

    static parse_code(code) {
      let needle;
      const turns = Move.parse_turns(code.substring(1));
      const is_rotation = (needle = code.substring(1), [">", ">>", "<", "<<"].includes(needle));
      const layer = Layer.by_name(code[0]);

      if (!layer || !turns) {
        throw new Error(`Invalid Move code '${code}'`);
      }
      return [layer, turns, is_rotation];
    }

    static parse_turns(turn_code) {
      switch (turn_code) {
        case "1": case "": case ">": return 1;
        case "2": case "²": case ">>": return 2;
        case "3": case "'": case "<": return -1;
        case "Z": case "2'": case "<<": return -2;
      }
    }

    static turn_code(turns, rotation) {
      if (rotation == null) { rotation = false; }
      return { true: { 1: '>', 2: '>>', '-1': '<', '-2': '<<' }, false: { 1: '', 2: '2', '-1': "'", '-2': 'Z' } }[rotation][turns];
    }

    static displayify(move_text, algdisplay) {
      let result = move_text.replace('Z', algdisplay.Zcode);
      if (algdisplay.fancy2s) { result = result.replace('2', '²'); }
      return result;
    }
    static human_name(primitive_name) {

      return HUMAN_NAMES[primitive_name] || primitive_name;
    }
  };
  Move.initClass();
  return Move;
})();

window['Move'] = Move