/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS203: Remove `|| {}` from converted for-own loops
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
// POV = Point Of View. Cube notations has two POVs.
//
// Seen from the cube, U is always up, and there are only six kinds of moves: B, R, D, F, L, and U.
// Seen from the hands of a human, more moves exist (x, y, x, M, E, S, etc), and after a z2 move,
// U as seen from the cube is D as seen from the hands.
//
// This class keeps track of and maps between these POVs

export class PovTracker {
  map: { B: string; D: string; F: string; L: string; R: string; U: string; };
  constructor(moves?) {
    this.map = PovTracker.start_map();
    if (moves) { this.track(moves); }
  }

  static start_map() {
    return { B: 'B', D: 'D', F: 'F', L: 'L', R: 'R', U: 'U' };
  }

  track(moves: any[]) {  // FIXME
    if (!Array.isArray(moves)) { moves = [moves]; }
    return Array.from(moves).map((move) =>
      move.track_pov(this.map));
  }

  hand_to_cube_map() {
    const reverse_map = {};
    for (let key of Object.keys(this.map || {})) {
      const value = this.map[key];
      reverse_map[value] = key;
    }
    return reverse_map;
  }

  cube_to_hand(code) {
    return this._case_map(this.map, code);
  }

  hand_to_cube(code) {
    return this._case_map(this.hand_to_cube_map(), code);
  }

  _case_map(map, code) {
    if (!code) { return code; }
    return (code.split('').map((char) => this.map[char] || __guard__(map[char.toUpperCase()], x => x.toLowerCase()) || char)).join('');
  }
}

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}