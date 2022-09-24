/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
//= require <utils.coffee>

import { v3 } from "./utils";

export const Layer = (function () {
  let all = undefined;
  let sides = undefined;
  var Layer = class Layer {
    normal: any;
    sticker_cycle: any;
    cycle1: any;
    cycle2: any;
    positions: any;
    name: any;

    static R: Layer;
    static L: Layer;
    static F: Layer;
    static S: Layer;
    static E: Layer;
    static M: Layer;
    static D: Layer;
    static U: Layer;
    static B: Layer;

    static initClass() {

      this.R = new Layer('R', v3(-1, 0, 0), ['UFR', 'DFR', 'DBR', 'UBR'], ['UR', 'FR', 'DR', 'BR'], ['R'], { B: 'D', D: 'F', F: 'U', U: 'B', L: 'L', R: 'R' });
      this.L = new Layer('L', v3(1, 0, 0), ['UBL', 'DBL', 'DFL', 'UFL'], ['BL', 'DL', 'FL', 'UL'], ['L'], { B: 'U', U: 'F', F: 'D', D: 'B', L: 'L', R: 'R' });
      this.F = new Layer('F', v3(0, 1, 0), ['DFL', 'DFR', 'UFR', 'UFL'], ['FL', 'DF', 'FR', 'UF'], ['F'], { U: 'R', R: 'D', D: 'L', L: 'U', F: 'F', B: 'B' });
      this.B = new Layer('B', v3(0, -1, 0), ['UBL', 'UBR', 'DBR', 'DBL'], ['UB', 'BR', 'DB', 'BL'], ['B'], { U: 'L', L: 'D', D: 'R', R: 'U', F: 'F', B: 'B' });
      this.U = new Layer('U', v3(0, 0, 1), ['UBR', 'UBL', 'UFL', 'UFR'], ['UR', 'UB', 'UL', 'UF'], ['U'], { F: 'L', L: 'B', B: 'R', R: 'F', U: 'U', D: 'D' });
      this.D = new Layer('D', v3(0, 0, -1), ['DFR', 'DFL', 'DBL', 'DBR'], ['DF', 'DL', 'DB', 'DR'], ['D'], { F: 'R', R: 'B', B: 'L', L: 'F', U: 'U', D: 'D' });

      this.M = new Layer('M', this.L.normal, ['UF', 'UB', 'DB', 'DF'], ['U', 'B', 'D', 'F'], [], this.L.sticker_cycle);
      this.E = new Layer('E', this.D.normal, ['BL', 'BR', 'FR', 'FL'], ['L', 'B', 'R', 'F'], [], this.D.sticker_cycle);
      this.S = new Layer('S', this.F.normal, ['DL', 'DR', 'UR', 'UL'], ['L', 'D', 'R', 'U'], [], this.F.sticker_cycle);

      all = { R: this.R, L: this.L, F: this.F, B: this.B, D: this.D, U: this.U, M: this.M, E: this.E, S: this.S };
      sides = { R: this.R, L: this.L, F: this.F, B: this.B, D: this.D, U: this.U };
    }
    constructor(name, normal, cycle1, cycle2, uncycled, sticker_cycle) {
      this.name = name;
      this.normal = normal;
      this.cycle1 = cycle1;
      this.cycle2 = cycle2;
      this.sticker_cycle = sticker_cycle;
      this.positions = this.cycle1.concat(this.cycle2, uncycled);
    }

    static by_name(name) {
      return all[name];
    }

    static side_by_name(name) {
      return sides[name];
    }

    shift(side_name, turns) {
      if (!this.sticker_cycle[side_name]) { return null; }
      if (turns < 1) { throw new Error(`Invalid turn number: '${turns}'`); }

      let result = side_name;
      for (let n = 1, end = turns, asc = 1 <= end; asc ? n <= end : n >= end; asc ? n++ : n--) {
        result = this.sticker_cycle[result];
      }
      return result;
    }

    on_same_axis_as(other_layer) {
      let same_zeroes = 0;
      for (let axis of ['x', 'y', 'z']) {
        if ((this.normal[axis] === 0) && (other_layer.normal[axis] === 0)) {
          same_zeroes++;
        }
      }
      return same_zeroes === 2;
    }
  };
  Layer.initClass();
  return Layer;
})();