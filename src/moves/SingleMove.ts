/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
//= require Layer
//= require CameraMovement
//= require MoveExecution

import { CameraMovement } from "../changers/CameraMovement";
import { MoveExecution } from "../changers/MoveExecution";
import { Layer } from "../Layer";
import { Move } from "./Move";




export class SingleMove {
  world3d: any;
  speed: number;
  layer: any;
  turns: any;
  is_rotation: boolean;
  turn_time: number;
  constructor(code, world3d, speed) {
    this.world3d = world3d;
    if (speed == null) { speed = 400; }
    this.speed = speed;
    [this.layer, this.turns, this.is_rotation] = Array.from(Move.parse_code(code));
    this.turn_time = (this.speed / 2) * (1 + Math.abs(this.turns));
  }

  do() {
    return this._do(this.turns, false);
  }

  undo() {
    return this._do(-this.turns, false);
  }

  mix() {
    if (!this.is_rotation) {
      return this.undo();
    }
  }

  track_pov(pov_map) {
    return [this.layer.cycle1, this.layer.cycle2].filter((cycle) => cycle[0].length === 1).map((cycle) => // center cycle
      (() => {
        const result = [];
        for (var side in pov_map) {
          var location = pov_map[side];
          result.push((() => {
            const result1 = [];
            for (let i = 0; i <= 3; i++) {
              if (location === cycle[i]) {
                result1.push(pov_map[side] = cycle[((i - this.turns) + 4) % 4]);
              } else {
                result1.push(undefined);
              }
            }
            return result1;
          })());
        }
        return result;
      })());
  }

  as_brdflu() {
    if (this.is_rotation) { return ''; }

    const standard_turn_codes = { 1: '', 2: '2', '-1': "'", '-2': '2' };
    const t1 = standard_turn_codes[this.turns];
    const t2 = standard_turn_codes[-this.turns];

    switch (this.layer) {
      case Layer.M: return `L${t2} R${t1}`;
      case Layer.E: return `D${t2} U${t1}`;
      case Layer.S: return `B${t1} F${t2}`;
      default: return this.to_s().replace('Z', '2');
    }
  }

  show_do() {
    return this._do(this.turns, true);
  }

  show_undo() {
    return this._do(-this.turns, true);
  }

  _do(do_turns, animate) {
    if (this.is_rotation) {
      return new CameraMovement(this.world3d.camera, this.layer.normal, (do_turns * Math.PI) / 2, this.turn_time, animate);
    } else {
      this.world3d.pieces.move(this.layer, do_turns);
      return new MoveExecution(this.world3d.pieces.on(this.layer), this.layer.normal, (do_turns * -Math.PI) / 2, this.turn_time, animate);
    }
  }

  count(count_rotations) {
    if (count_rotations || !this.is_rotation) { return 1; }
    return 0;
  }

  to_s() {
    return this.layer.name + Move.turn_code(this.turns, this.is_rotation);
  }

  display_text(algdisplay) {
    if (algdisplay.rotations || !this.is_rotation) { return Move.displayify(this.to_s(), algdisplay); }
    return '';
  }
}
