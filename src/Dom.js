/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
var Dom = (function() {
  let LUCIDA_WIDTHS = undefined;
  Dom = class Dom {
    static initClass() {
  
      LUCIDA_WIDTHS = {M:108, '+':100, '>':100, '<':100, w:98, D:94, U:87, 2:80, R:80, x:78, Z:77, B:73, z:73, F:68, E:68, S:68, L:67, y:65, '²':53, ' ':40, "'":29};
    }

    constructor(cube_id, div, renderer, make_alg_area, showalg, user_controlled) {
      this.cube_id = cube_id;
      this.div = div;
      this.div.css({position:'relative', 'font-family':'"Lucida Sans Unicode", "Lucida Grande", sans-serif'});
      this.has_focus(false);
      this.div.attr('data-cube-id', this.cube_id);

      renderer.setSize(this.div.width(), this.div.width());
      this.div.append(renderer.domElement);

      this.scale = this.div.width()/400;
      this.hscale = Math.max(this.scale, 15.0/40); // Minimum height -> readable text

      if (user_controlled) {
        this.mouse_target('U', 0.50, 0.25);
        this.mouse_target('F', 0.30, 0.62);
        this.mouse_target('R', 0.70, 0.62);
      }

      if (make_alg_area) {
        this.add_alg_area(showalg);
      }
    }

    mouse_target(side, x_center, y_center) {
      const width = this.div.width()*0.30;
      const left = (this.div.width()*x_center)-(width/2);
      const top  = (this.div.width()*y_center)-(width/2);
      return this.div.append(`<div class='mouse_target' data-side='${side}' style='width:${width}px; height:${width}px; left:${left}px; top:${top}px;'></div>`);
    }

    has_focus(has_it) {
      const color = has_it ? 'gray' : '#eee';
      const cursor = has_it ? 'pointer' : 'default';
      this.div.css({border: `2px solid ${color}`, cursor});
      if (has_it) { return this.div.addClass('focus'); } else { return this.div.removeClass('focus'); }
    }

    alg_changed(is_playing, at_start, at_end, count_text, alg_texts) {
      let button;
      if (is_playing) {
        for (button of Array.from(this.buttons)) {
          if (button === this.play) {
            button.hide();
          } else {
            this._show(button, button === this.pause);
          }
        }
      } else {
        for (button of Array.from(this.buttons)) {
          switch (button) {
            case this.reset: case this.prev:
              this._show(button, !at_start);
              break;
            case this.next: case this.play:
              this._show(button, !at_end);
              break;
            case this.pause:
              button.hide();
              break;
          }
        }
      }

      this.play_or_pause = is_playing ? this.pause : this.play;

      this.count.html(count_text);

      if (this.alg_text) {
        this.alg_past.text(alg_texts.past);
        return this.alg_future.text(" "+ alg_texts.future);
      }
    }

    show_help() {
      this.help = $("<div/>").addClass('roofpig-help');
      this.help.append(
        $("<div>Keyboard shortcuts</div>").css({'text-align': 'center', 'font-weight': 'bold'}),
        "<div><span>→</span> - Next move</div>",
        "<div/><span>←</span> - Previous move</div>",
        "<div/><span>⇧</span>+<span>→</span> - To end</div>",
        "<div/><span>⇧</span>+<span>←</span> - To start</div>",
        "<div/><span>&nbsp;space&nbsp;</span> - Play/Pause</div>",
        "<div/><span>Tab</span> - Next Cube</div>"
      );

      this.div.append(this.help);
      return this.help.css({right: `${(this.div.width()-this.help.outerWidth())/2}px`});
    }

    remove_help() {
      let was_removed;
      if (this.help) {
        this.help.remove();
        this.help = null;
        was_removed = true;
      }
      return was_removed;
    }

    add_alg_area(showalg) {
      this.div.append($("<div/>", {text: '?', id: `help-${this.cube_id}`}).addClass('roofpig-help-button'));

      this.alg_area = $("<div/>").height(this.div.height() - this.div.width()).width(this.div.width()).css({"border-top": "1px solid #ccc"});
      this.div.append(this.alg_area);

      if (showalg) {
        this.alg_text = $("<div/>").width(this.div.width()).addClass("roofpig-algtext");
        this.alg_area.append(this.alg_text);

        this.alg_past = $("<span/>").addClass("roofpig-past-algtext");
        this.alg_future = $("<span/>");
        this.alg_text.append(this.alg_past, this.alg_future);
      }

      this.reset = this._make_button("↩", "reset");
      this.prev  = this._make_button("-", "prev");
      this.next  = this._make_button("+", "next");
      this.pause = this._make_button("Ⅱ", "pause");
      this.play  = this._make_button("▶", "play");

      this.count = this._make_count_area();

      return this.buttons = [this.reset, this.prev, this.next, this.pause, this.play];
    }
    init_alg_text(text) {
      if (this.alg_text) {
        let width = 0;
        for (let char of Array.from(text.split(''))) {
          width += LUCIDA_WIDTHS[char] || 80;
          if (!LUCIDA_WIDTHS[char]) { log_error(`Unknown char width: '${char}'`); }
        }

        const font_size = 24 * this.scale * Math.min(1, 1970/width);
        return this.alg_text.height(1.2 * font_size).css({"font-size": font_size});
      }
    }

    _show(button, enabled) {
      button.show();
      if (enabled) {
        button.prop("disabled", false);
        return button.addClass('roofpig-button-enabled');
      } else {
        button.prop("disabled", true);
        return button.removeClass('roofpig-button-enabled');
      }
    }

    _make_button(text, name) {
      const button = $("<button/>", {text, id: `${name}-${this.cube_id}`});
      this.alg_area.append(button);

      button.addClass('roofpig-button');
      return button.css({'font-size': 28*this.hscale, float: 'left', height: 40*this.hscale, width: 76*this.scale});
    }

    _make_count_area() {
      const count_div = $("<div/>", {id: `count-${this.cube_id}`}).addClass('roofpig-count');
      this.alg_area.append(count_div);
      return count_div.height(40*this.hscale).width(80*this.scale).css("font-size", 24*this.hscale);
    }
  };
  Dom.initClass();
  return Dom;
})();
