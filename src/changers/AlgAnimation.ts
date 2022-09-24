import { Alg } from "../moves/Alg";

/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
export class AlgAnimation {
  alg: Alg;
  _finished: boolean;
  move_changer: any;
  constructor(alg) {
    this.alg = alg;
    this._next_alg_move();
  }

  update(now) {
    if (this._finished) { return; }

    if (this.move_changer.finished()) {
      this._next_alg_move();
    }

    return this.move_changer.update(now);
  }

  finish() { }
  // API creep

  finished() {
    return this._finished;
  }

  _next_alg_move() {
    if (this.alg.at_end() || !this.alg.playing) {
      return this._finished = true;
    } else {
      return this.move_changer = this.alg.next_move().show_do();
    }
  }
}
