/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS204: Change includes calls to have a more natural evaluation order
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
//= require Layer
//= require CameraMovement
//= require MoveExecution

class Move {
  constructor(code, world3d, speed) {
    this.world3d = world3d;
    if (speed == null) { speed = 400; }
    this.speed = speed;
    [this.layer, this.turns, this.is_rotation] = Array.from(Move._parse_code(code));
    this.turn_time = (this.speed/2) * (1 + Math.abs(this.turns));
  }

  static _parse_code(code) {
    let needle;
    const turns = Move.parse_turns(code.substring(1));
    const is_rotation = (needle = code.substring(1), [">", ">>", "<", "<<"].includes(needle));
    const layer = Layer.by_name(code[0]);

    if (!layer || !turns) {
      throw new Error(`Invalid Move code '${code}'`);
    }
    return [layer, turns, is_rotation];
  }

  static parse_turns(tcode) {
    switch (tcode) {
      case "1":  case "": case ">": return 1;
      case "2": case "²":case ">>": return 2;
      case "3": case "'": case "<": return -1;
      case "Z":case "2'":case "<<": return -2;
    }
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
                result1.push(pov_map[side] = cycle[((i-this.turns)+4)% 4]);
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

    const standard_turn_codes = { 1: '', 2: '2', '-1': "'", '-2': '2'};
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
    return this._do( -this.turns, true);
  }

  _do(do_turns, animate) {
    if (this.is_rotation) {
      return new CameraMovement(this.world3d.camera, this.layer.normal, (do_turns * Math.PI)/2, this.turn_time, animate);
    } else {
      this.world3d.pieces.move(this.layer, do_turns);
      return new MoveExecution(this.world3d.pieces.on(this.layer), this.layer.normal, (do_turns * -Math.PI)/2, this.turn_time, animate);
    }
  }

  count(count_rotations) {
    if (count_rotations || !this.is_rotation) { return 1; }
    return 0;
  }

  to_s() {
    const turn_codes = { true: { 1: '>', 2: '>>', '-1': '<', '-2': '<<'}, false: { 1: '', 2: '2', '-1': "'", '-2': 'Z'}};
    return `${this.layer.name}${turn_codes[this.is_rotation][this.turns]}`;
  }

  static displayify(move_text, algdisplay) {
    let result = move_text.replace('Z', algdisplay.Zcode);
    if (algdisplay.fancy2s) { result = result.replace('2', '²'); }
    return result;
  }

  display_text(algdisplay) {
    if (algdisplay.rotations || !this.is_rotation) { return Move.displayify(this.to_s(), algdisplay); }
    return '';
  }
}
