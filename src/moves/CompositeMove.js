/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
//= require SingleMove
//= require ConcurrentChangers

class CompositeMove {
  constructor(move_codes, world3d, speed, official_text = null) {
    this.official_text = official_text;
    this.moves = (Array.from(move_codes.split('+')).map((code) => new SingleMove(code, world3d, speed)));

    const real_moves = (Array.from(this.moves).filter((move) => !move.is_rotation));
    for (let other_move of Array.from(real_moves.slice(1))) {
      if (!real_moves[0].layer.on_same_axis_as(other_move.layer)) {
        throw new Error(`Impossible Move combination '${move_codes}'`);
      }
    }
  }


  do() { return new ConcurrentChangers( (this.moves.map(move => move.do())) ); }
  undo() { return new ConcurrentChangers( (this.moves.map(move => move.undo())) ); }
  mix() { return new ConcurrentChangers( (this.moves.map(move => move.mix())) ); }
  show_do() { return new ConcurrentChangers( (this.moves.map(move => move.show_do())) ); }
  show_undo() { return new ConcurrentChangers( (this.moves.map(move => move.show_undo())) ); }

  track_pov(pov_map) {
    return Array.from(this.moves).map((move) => move.track_pov(pov_map));
  }

  count(count_rotations) {
    if (this.official_text) { return 1; }

    let result = 0;
    for (let move of Array.from(this.moves)) {
      result += move.count(count_rotations);
    }
    return result;
  }

  to_s() {
    return `(${(this.moves.map(move => move.to_s())).join(' ')})`;
  }

  as_brdflu() {
    let result = (this.moves.map(move => move.as_brdflu())).join(' ').split(' ').sort().join(' ');

    for (let side of ['B', 'R', 'D', 'F', 'L', 'U']) {
      result = result.replace(`${side} ${side}'`, "");
      result = result.replace(`${side}2 ${side}2`, "");
    }
    return result.replace(/[ ]+/g, ' ').replace(/^ +| +$/g, '');
  }


  display_text(algdisplay) {
    if (this.official_text) {
      return Move.displayify(this.official_text, algdisplay);
    }

    const display_texts = this.moves.map(move => move.display_text(algdisplay));
    return (Array.from(display_texts).filter((text) => text)).join('+');
  }
}
