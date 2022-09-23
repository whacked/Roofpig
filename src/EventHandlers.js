/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
//= require utils
//= require OneChange

//This is all page wide data and functions.
var EventHandlers = (function() {
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
  let key_question = undefined;
  let button_keys = undefined;
  let rotate_keys = undefined;
  let turn_keys = undefined;
  let side_for = undefined;
  EventHandlers = class EventHandlers {
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
      key_question = 191;
  
      button_keys = [key_space, key_home, key_left_arrow, key_right_arrow];
      rotate_keys = [key_C, key_Z, key_A, key_D, key_S, key_X];
      turn_keys   = [key_J, key_K, key_L];
  
      side_for = {};
      side_for[key_J] = "U";
      side_for[key_K] = "F";
      side_for[key_L] = "R";
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

      $('body').keydown(e => EventHandlers.key_down(e));
      $('body').keyup(e => EventHandlers.key_up(e));

      $(document).on('mousedown', '.roofpig', function(e) { return EventHandlers.mouse_down(e, $(this).data('cube-id')); });
      $('body').mousemove(e => EventHandlers.mouse_move(e));
      $('body').mouseup(e => EventHandlers.mouse_end(e));
      $('body').mouseleave(e => EventHandlers.mouse_end(e));

      $(document).on('click', '.roofpig', function(e) {
        const cube = CubeAnimation.by_id[$(this).data('cube-id')];
        return EventHandlers.set_focus(cube);
    });

      $(document).on('click', '.roofpig button', function(e) {
        const [button_name, cube_id] = Array.from($(this).attr('id').split('-'));
        return CubeAnimation.by_id[cube_id].button_click(button_name, e.shiftKey);
    });

      $(document).on('click', '.roofpig-help-button', function(e) {
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
      this.focus().add_changer('camera', new OneChange( () => this.camera.bend(0, 0)));
      return this.bending = false;
    }

    static mouse_move(e) {
      if (this.bending) {
        const dx = (-0.02 * (e.pageX - this.bend_start_x)) / this.dom.scale;
        let dy = (-0.02 * (e.pageY - this.bend_start_y)) / this.dom.scale;
        if (e.shiftKey) {
          dy = 0;
        }
        return this.focus().add_changer('camera', new OneChange( () => this.camera.bend(dx, dy)));
      }
    }


    // ---- Keyboard Events ----

    static key_down(e) {
      let turns, unhandled;
      if (this.focus().is_null) { return; }

      const help_toggled = this.dom.remove_help();

      if (e.ctrlKey || e.metaKey) {
        return true;
      }

      const [key, shift, alt] = Array.from([e.keyCode, e.shiftKey, e.altKey]);

      if (Array.from(turn_keys).includes(key)) {
        turns = shift ? 3 : alt ? 2 : 1;
        this._move(`${side_for[key]}${turns}`);

      } else if (alt) {
        unhandled = true;

      } else if (key === key_tab) {
        const new_focus = shift ? this.focus().previous_cube() : this.focus().next_cube();
        this.set_focus(new_focus);

      } else if ((key === key_end) || ((key === key_right_arrow) && shift)) {
        this.focus().add_changer('pieces', new OneChange( () => this.focus().alg.to_end(this.focus().world3d)));

      } else if (Array.from(button_keys).includes(key)) {
        this._fake_click_down(this._button_for(key, shift));

      } else if (Array.from(rotate_keys).includes(key)) {
        const axis = (() => { switch (key) {
          case key_C: case key_Z: return 'up';
          case key_A: case key_D: return 'dr';
          case key_S: case key_X: return 'dl';
        } })();
        turns = (() => { switch (key) {
          case key_C: case key_A: case key_S: return 1;
          case key_Z: case key_D: case key_X: return -1;
        } })();
        this._rotate(axis, turns);

      } else if (key === key_question) {
        if (!help_toggled) { this.focus().dom.show_help(); }

      } else {
        unhandled = true;
      }

      if (!unhandled) {
        e.preventDefault();
        return e.stopPropagation();
      }
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

    static _rotate(axis_name, turns) {
      const angle_to_turn = (-Math.PI/2) * turns;
      return this.focus().add_changer('camera', new CameraMovement(this.camera, this.camera.user_dir[axis_name], angle_to_turn, 500, true));
    }

    static _move(code) {
      return this.focus().add_changer('pieces', new Move(code, this.focus().world3d, 200).show_do());
    }
  };
  EventHandlers.initClass();
  return EventHandlers;
})();
