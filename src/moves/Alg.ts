/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
//= require Move
//= require AlgAnimation

import { AlgAnimation } from "../changers/AlgAnimation";
import { PovTracker } from "../PovTracker";
import { Move } from "./Move";

export class Alg {
  move_codes: any;
  world3d: any;
  algdisplay: any;
  speed: any;
  dom: any;
  moves: any[];
  next: number;
  playing: boolean;

  constructor(move_codes, world3d?, algdisplay?, speed?, dom?) {
    this.move_codes = move_codes;
    this.world3d = world3d;
    this.algdisplay = algdisplay;
    this.speed = speed;
    this.dom = dom;
    this.moves = [];
    for (let code of this.move_codes.split(' ')) {
      if (code.length > 0) {
        this.moves.push(Move.make(code, this.world3d, this.speed));
      }
    }
    this.next = 0;
    this.playing = false;
    this._update_dom('first time');
  }

  next_move() {
    if (!this.at_end()) {
      this.next += 1;
      if (this.at_end()) { this.playing = false; }
      this._update_dom();
      return this.moves[this.next - 1];
    }
  }

  prev_move() {
    if (!this.at_start()) {
      this.next -= 1;
      this._update_dom();
      return this.moves[this.next];
    }
  }

  play() {
    this.playing = true;
    this._update_dom();
    return new AlgAnimation(this);
  }

  stop() {
    this.playing = false;
    return this._update_dom();
  }

  to_end() {
    return (() => {
      const result = [];
      while (!this.at_end()) {
        result.push(this.next_move().do());
      }
      return result;
    })();
  }

  to_start() {
    return (() => {
      const result = [];
      while (!this.at_start()) {
        result.push(this.prev_move().undo());
      }
      return result;
    })();
  }

  at_start() {
    return this.next === 0;
  }

  at_end() {
    return this.next === this.moves.length;
  }

  mix() {
    this.next = this.moves.length;
    return (() => {
      const result = [];
      while (!this.at_start()) {
        result.push(this.prev_move().mix());
      }
      return result;
    })();
  }

  to_s() {
    return (this.moves.map(move => move.to_s())).join(' ');
  }

  display_text() {
    let past;
    let active = (past = []);
    const future = [];
    for (let i = 0; i < this.moves.length; i++) {
      const move = this.moves[i];
      if (this.next === i) { active = future; }
      const text = move.display_text(this.algdisplay);
      if (text) {
        active.push(text);
      }
    }
    return { past: past.join(' '), future: future.join(' ') };
  }

  // Translate "hand" moves to BRDFLU
  unhand() {
    const pov = new PovTracker();
    const result = [];
    for (let move of Array.from(this.moves)) {
      result.push(pov.hand_to_cube(move.as_brdflu()));
      pov.track(move);
    }
    return result.join(' ').replace(/[ ]+/g, ' ').replace(/^ +| +$/g, '');
  }

  static pov_from(move_codes) {
    return new PovTracker(new Alg(move_codes).moves);
  }

  _update_dom(time?) {
    if (time == null) { time = 'later'; }
    if (this.dom && (this.moves.length > 0)) {
      if (time === 'first time') {
        this.dom.init_alg_text(this.display_text().future);
      }

      return this.dom.alg_changed(this.playing, this.at_start(), this.at_end(), this._count_text(), this.display_text());
    }
  }

  _count_text() {
    let current;
    let total = (current = 0);
    for (let i = 0; i < this.moves.length; i++) {
      const move = this.moves[i];
      const count = move.count(this.algdisplay.rotations);
      if (this.next > i) { current += count; }
      total += count;
    }
    return `${current}/${total}`;
  }
}