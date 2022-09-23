/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
//= require Move
//= require CompositeMove
//= require AlgAnimation

var Alg = (function() {
  let turn_codes = undefined;
  Alg = class Alg {
    static initClass() {
  
      turn_codes = {'-2': ['Z', '2'], '-1': ["'", ''], 1: ['', "'"], 2: ['2', 'Z']};
    }
    constructor(move_codes, world3d, algdisplay, speed, dom) {
      this.move_codes = move_codes;
      this.world3d = world3d;
      this.algdisplay = algdisplay;
      this.speed = speed;
      this.dom = dom;
      this.moves = [];
      for (let code of Array.from(this.move_codes.split(' '))) {
        if (code.length > 0) {
          this.moves.push(this._make_move(code));
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
        return this.moves[this.next-1];
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
      this.next =  this.moves.length;
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
      return { past: past.join(' '), future: future.join(' ')};
    }
    _make_move(code) {
      let moves, t1, t2;
      if (code.indexOf('+') > -1) {
        return new CompositeMove(code, this.world3d, this.speed);

      } else if (['x', 'y', 'z'].includes(code[0])) {
        [t1, t2] = Array.from(turn_codes[Move.parse_turns(code.substring(1))]);
        moves = (() => { switch (code[0]) {
          case 'x': return `R${t1}+M${t2}+L${t2}`;
          case 'y': return `U${t1}+E${t2}+D${t2}`;
          case 'z': return `F${t1}+S${t1}+B${t2}`;
        } })();
        return new CompositeMove(moves, this.world3d, this.speed, code);

      } else {
        let last_char_index;
        if ((code[1] === 'w') && ['U', 'D', 'L', 'R', 'F', 'B'].includes(code[0])) { last_char_index = 2; }
        if (['u', 'd', 'l', 'r', 'f', 'b'].includes(code[0])) { last_char_index = 1; }
        if (last_char_index) {
          [t1, t2] = Array.from(turn_codes[Move.parse_turns(code.substring(last_char_index))]);
          moves = (() => { switch (code[0].toUpperCase()) {
            case 'R': return `R${t1}+M${t2}`;
            case 'L': return `L${t1}+M${t1}`;
            case 'U': return `U${t1}+E${t2}`;
            case 'D': return `D${t1}+E${t1}`;
            case 'F': return `F${t1}+S${t1}`;
            case 'B': return `B${t1}+S${t2}`;
          } })();
          return new CompositeMove(moves, this.world3d, this.speed, code);

        } else {
          return new Move(code, this.world3d, this.speed);
        }
      }
    }

    unhand() {
      const pov = new Pov();
      const result = [];
      for (let move of Array.from(this.moves)) {
        result.push(pov.hand_to_cube(move.as_brdflu()));
        pov.track(move);
      }
      return result.join(' ').replace(/[ ]+/g, ' ').replace(/^ +| +$/g, '');
    }

    static pov_from(move_codes) {
      return new Pov(new Alg(move_codes).moves);
    }

    _update_dom(time) {
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
  };
  Alg.initClass();
  return Alg;
})();