/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
//= require utils
//= require OneChange

import { OneChange } from "./changers/OneChange";
import { CubeAnimation } from "./CubeAnimation";
import { Move } from "./moves/Move";

//This is all page wide data and functions.
export const EventHandlers = (function () {
  let NO_FOCUS = undefined;
  let key_tab = undefined;
  let key_space = undefined;
  let key_end = undefined;
  let key_home = undefined;
  let key_left_arrow = undefined;
  let key_up_arrow = undefined;
  let key_right_arrow = undefined;
  let key_down_arrow = undefined;
  let key_A = undefined;
  let key_C = undefined;
  let key_D = undefined;
  let key_J = undefined;
  let key_K = undefined;
  let key_L = undefined;
  let key_S = undefined;
  let key_X = undefined;
  let key_Z = undefined;
  let key_questionmark = undefined;
  let key_num = undefined;
  let key_numpad = undefined;
  let button_keys = undefined;
  let EventHandlers = class EventHandlers {
    static initialized: boolean;
    static _focus: any;
    static dom: any;
    static camera: any;
    static down_keys: {};
    static bend_start_x: any;
    static bend_start_y: any;
    static bending: boolean;
    static down_button: any;
    static initClass() {
      this.initialized = false;

      NO_FOCUS = {
        add_changer() { return {}; },
        is_null: true
      };


      // http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
      key_tab = 9;
      key_space = 32;
      key_end = 35;
      key_home = 36;
      key_left_arrow = 37;
      key_up_arrow = 38;
      key_right_arrow = 39;
      key_down_arrow = 40;
      key_A = 65;
      key_C = 67;
      key_D = 68;
      key_J = 74;
      key_K = 75;
      key_L = 76;
      key_S = 83;
      key_X = 88;
      key_Z = 90;
      key_questionmark = 191;

      key_num = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57];
      key_numpad = [96, 97, 98, 99, 100, 101, 102, 103, 104, 105];

      button_keys = [key_space, key_home, key_left_arrow, key_right_arrow];
    }

    static set_focus(new_focus) {
      if (this._focus !== new_focus) {
        if (this._focus) { this.dom.has_focus(false); }

        this._focus = new_focus;
        if (!this.focus().is_null) {
          this.camera = this._focus.world3d.camera;
          this.dom = this._focus.dom;

          return this.dom.has_focus(true);
        }
      }
    }
    static focus() {
      return this._focus || NO_FOCUS;
    }

    static initialize() {
      if (this.initialized) { return; }

      this.down_keys = {};

      $('body').keydown(e => EventHandlers.key_down(e));
      $('body').keyup(e => EventHandlers.key_up(e));

      $(document).on('mousedown', '.roofpig', function (e) { return EventHandlers.mouse_down(e, $(this).data('cube-id')); });
      $('body').mousemove(e => EventHandlers.mouse_move(e));
      $('body').mouseup(e => EventHandlers.mouse_end(e));
      $('body').mouseleave(e => EventHandlers.mouse_end(e));

      $(document).on('click', '.roofpig', function (e) {
        const cube = CubeAnimation.by_id[$(this).data('cube-id')];
        return EventHandlers.set_focus(cube);
      });
      $(document).on('click', '.focus .mouse_target', function (e) {
        return EventHandlers.left_cube_click(e, $(this).data('side'));
      });
      $(document).on('contextmenu', '.focus .mouse_target', function (e) {
        return EventHandlers.right_cube_click(e, $(this).data('side'));
      });
      $(document).on('click', '.roofpig button', function (e) {
        const [button_name, cube_id] = Array.from($(this).attr('id').split('-'));
        return CubeAnimation.by_id[cube_id].button_click(button_name, e.shiftKey);
      });
      $(document).on('click', '.roofpig-help-button', function (e) {
        const [_, cube_id] = Array.from($(this).attr('id').split('-'));
        return CubeAnimation.by_id[cube_id].dom.show_help();
      });

      return this.initialized = true;
    }

    static mouse_down(e, clicked_cube_id) {
      this.dom.remove_help();

      if (clicked_cube_id === this.focus().id) {
        this.bend_start_x = e.pageX;
        this.bend_start_y = e.pageY;

        return this.bending = true;
      }
    }

    static mouse_end(e) {
      this.focus().add_changer('camera', new OneChange(() => this.camera.bend(0, 0)));
      return this.bending = false;
    }

    static mouse_move(e) {
      if (this.bending) {
        const dx = (-0.02 * (e.pageX - this.bend_start_x)) / this.dom.scale;
        let dy = (-0.02 * (e.pageY - this.bend_start_y)) / this.dom.scale;
        if (e.shiftKey) {
          dy = 0;
        }
        return this.focus().add_changer('camera', new OneChange(() => this.camera.bend(dx, dy)));
      }
    }

    static left_cube_click(e, click_side) {
      return this._handle_cube_click(e, click_side);
    }

    static right_cube_click(e, click_side) {
      this._handle_cube_click(e, click_side);
      return e.preventDefault(); // no context menu
    }

    static _handle_cube_click(e, click_side) {
      let opposite;
      if (!this.focus().user_controlled()) { return false; }

      const third_key = e.metaKey || e.ctrlKey;
      opposite = false;
      const side_map = (() => {
        switch (e.which) {
          case 1: // left button
            opposite = third_key;
            if (third_key) { return { F: 'B', U: 'D', R: 'L' }; } else { return { F: 'F', U: 'U', R: 'R' }; }
          case 3: // right button
            if (third_key) { return { F: 'f', U: 'u', R: 'r' }; } else { return { F: 'z', U: 'y', R: 'x' }; }
          case 2: // middle button
            opposite = third_key;
            if (third_key) { return { F: 'b', U: 'd', R: 'l' }; } else { return { F: 'f', U: 'u', R: 'r' }; }
        }
      })();

      return this.focus().external_move(side_map[click_side] + this._turns(e, opposite));
    }


    static _turns(e, opposite) {
      if (opposite == null) { opposite = false; }
      let result = e.shiftKey ? -1 : e.altKey ? 2 : 1;
      if (opposite) { result = -result; }
      return { 1: '', 2: '2', '-1': "'", '-2': 'Z' }[result];
    }

    // ---- Keyboard Events ----

    static key_down(e) {
      let unhandled;
      this.down_keys[e.keyCode] = true;

      if (this.focus().is_null) { return; }

      const help_toggled = this.dom.remove_help();

      if (this.cube_key_moves(e)) {
        return true;
      }

      if (e.ctrlKey || e.metaKey || e.altKey) {
        return true;
      }

      const [key, shift] = Array.from([e.keyCode, e.shiftKey]);

      if (key === key_tab) {
        const new_focus = shift ? this.focus().previous_cube() : this.focus().next_cube();
        this.set_focus(new_focus);

      } else if ((key === key_end) || ((key === key_right_arrow) && shift)) {
        this.focus().add_changer('pieces', new OneChange(() => this.focus().alg.to_end(this.focus().world3d)));

      } else if (Array.from(button_keys).includes(key)) {
        this._fake_click_down(this._button_for(key, shift));

      } else if (key === key_questionmark) {
        if (!help_toggled) { this.focus().dom.show_help(); }

      } else {
        unhandled = true;
      }

      if (!unhandled) {
        e.preventDefault();
        return e.stopPropagation();
      }
    }


    static cube_key_moves(e) {
      if (!this.focus().user_controlled()) { return false; }

      const number_key = Math.max(key_num.indexOf(e.keyCode), key_numpad.indexOf(e.keyCode));
      if (!(number_key > 0)) { return false; }

      const side = (() => {
        switch (number_key) {
          case 1: case 4: case 7: return "F";
          case 2: case 5: case 8: return "U";
          case 3: case 6: case 9: return "R";
        }
      })();

      const turns = (() => {
        switch (number_key) {
          case 1: case 2: case 3: return 2;
          case 4: case 5: case 6: return 1;
          case 7: case 8: case 9: return -1;
        }
      })();

      const turn_code = Move.turn_code(turns);
      const anti_turn_code = Move.turn_code(-turns);

      const opposite = this.down_keys[key_Z];
      const middle = this.down_keys[key_X];
      const the_side = this.down_keys[key_C] || (!opposite && !middle);

      const moves = [];

      if (the_side) {
        moves.push(`${side}${turn_code}`);
      }

      if (middle) {
        switch (side) {
          case 'F': moves.push("S" + turn_code); break;
          case 'U': moves.push("E" + anti_turn_code); break;
          case 'R': moves.push("M" + anti_turn_code); break;
        }
      }

      if (opposite) {
        switch (side) {
          case 'F': moves.push("B" + anti_turn_code); break;
          case 'U': moves.push("D" + anti_turn_code); break;
          case 'R': moves.push("L" + anti_turn_code); break;
        }
      }

      this.focus().external_move(moves.join('+'));

      return true;
    }


    static _button_for(key, shift) {
      switch (key) {
        case key_home:
          return this.dom.reset;
        case key_left_arrow:
          if (!shift) { return this.dom.prev; } else { return this.dom.reset; }
        case key_right_arrow:
          return this.dom.next;
        case key_space:
          return this.dom.play_or_pause;
      }
    }

    static key_up(e) {
      this.down_keys[e.keyCode] = false;

      const button_key = Array.from(button_keys).includes(e.keyCode);
      if (button_key) {
        if (this.down_button) {
          this._fake_click_up(this.down_button);
          this.down_button = null;
        }
      }
      return button_key;
    }

    static _fake_click_down(button) {
      if (!button.attr("disabled")) {
        this.down_button = button;
        return button.addClass('roofpig-button-fake-active');
      }
    }

    static _fake_click_up(button) {
      if (!button.attr("disabled")) {
        button.removeClass('roofpig-button-fake-active');
        return button.click();
      }
    }
  };
  EventHandlers.initClass();
  return EventHandlers;
})();

