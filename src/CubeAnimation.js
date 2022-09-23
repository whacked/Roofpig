/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS203: Remove `|| {}` from converted for-own loops
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
//= require Alg
//= require Config
//= require Dom
//= require EventHandlers
//= require Move
//= require Pieces3D
//= require OneChange

class CubeAnimation {
  static initClass() {
    this.last_id = 0;
    this.by_id = {};
    this.webgl_cubes = 0;
  }

  static initialize() {
    CubeAnimation.webgl_browser = (function () {
      try {
        return !!window.WebGLRenderingContext && !!document.createElement("canvas").getContext("experimental-webgl");
      } catch (e) {
        return false;
      }
    })();

    CubeAnimation.canvas_browser = !!window.CanvasRenderingContext2D;
    if (CubeAnimation.canvas_browser) {
      if (!CubeAnimation.webgl_browser) { return log_error("No WebGL support in this browser. Falling back on regular Canvas."); }
    } else {
      return log_error("No Canvas support in this browser. Giving up.");
    }
  }

  static create_in_dom(parent_selector, config, div_attributes) {
    const new_pig = $(`<div ${div_attributes} data-config=\"${config}\"></div>`).appendTo($(parent_selector));
    return new CubeAnimation(new_pig);
  }

  next_cube() {
    const ids = Object.keys(CubeAnimation.by_id);
    const next_id = ids[(ids.indexOf(this.id.toString()) + 1) % ids.length];
    return CubeAnimation.by_id[next_id];
  }

  previous_cube() {
    const ids = Object.keys(CubeAnimation.by_id);
    const previous_id = ids[((ids.indexOf(this.id.toString()) + ids.length) - 1) % ids.length];
    return CubeAnimation.by_id[previous_id];
  }

  constructor(roofpig_div) {
    if (!CubeAnimation.canvas_browser) {
      roofpig_div.html("Your browser does not support <a href='http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation'>WebGL</a>.<p/> Find out how to get it <a href='http://get.webgl.org/'>here</a>.");
      roofpig_div.css({ background: '#f66' });
      return;
    }

    // try {
    this.id = (CubeAnimation.last_id += 1);
    CubeAnimation.by_id[this.id] = this;

    this.config = new Config(roofpig_div.data('config'));

    const use_canvas = this.config.flag('canvas') || !CubeAnimation.webgl_browser || (CubeAnimation.webgl_cubes >= 16);
    if (use_canvas) {
      this.renderer = new THREE.CanvasRenderer({ alpha: true }); // alpha -> transparent
    } else {
      CubeAnimation.webgl_cubes += 1;
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    }

    this.dom = new Dom(this.id, roofpig_div, this.renderer, this.config.alg !== "", this.config.flag('showalg'));
    this.scene = new THREE.Scene();
    this.world3d = {
      camera: new Camera(this.config.hover, this.config.pov),
      pieces: new Pieces3D(this.scene, this.config.hover, this.config.colors, use_canvas)
    };

    this.alg = new Alg(this.config.alg, this.world3d, this.config.algdisplay, this.config.speed, this.dom);

    if (this.config.setup) { new Alg(this.config.setup, this.world3d).to_end(); }
    if (!this.config.flag('startsolved')) { this.alg.mix(); }

    if (this.cube_count() === 1) {
      EventHandlers.set_focus(this);
    }

    this.changers = {};
    this.animate(true);

    EventHandlers.initialize();
    // } catch (e) {
    //   roofpig_div.html('YOWZA' + e.message);
    //   roofpig_div.css({background: '#f66'});
    // }
  }

  remove() {
    if (this === EventHandlers.focus()) {
      const new_focus = (this.cube_count() === 1 ? null : this.next_cube());
      EventHandlers.set_focus(new_focus);
    }
    delete CubeAnimation.by_id[this.id];
    return this.dom.div.remove();
  }

  cube_count() {
    return Object.keys(CubeAnimation.by_id).length;
  }

  animate(first_time) {  // called for each redraw
    let any_change;
    if (first_time == null) { first_time = false; }
    const now = (new Date()).getTime();

    for (let category of Object.keys(this.changers || {})) {
      const changer = this.changers[category];
      if (changer) {
        changer.update(now);
        if (changer.finished()) { this.changers[category] = null; }
        any_change = true;
      }
    }

    if (any_change || first_time) {
      this.renderer.render(this.scene, this.world3d.camera.cam);
    }

    return requestAnimationFrame(() => this.animate()); // request next frame
  }

  add_changer(category, changer) {
    if (this.changers[category]) { this.changers[category].finish(); }
    return this.changers[category] = changer;
  }

  button_click(name, shift) {
    let changer;
    switch (name) {
      case 'play':
        changer = !shift ? this.alg.play(this.world3d) : new OneChange(() => this.alg.to_end(this.world3d));
        break;
      case 'pause':
        this.alg.stop();
        break;
      case 'next':
        if (!this.alg.at_end()) { changer = this.alg.next_move().show_do(this.world3d); }
        break;
      case 'prev':
        if (!this.alg.at_start()) { changer = this.alg.prev_move().show_undo(this.world3d); }
        break;
      case 'reset':
        changer = new OneChange(() => this.alg.to_start(this.world3d));
        break;
    }

    if (changer) {
      return this.add_changer('pieces', changer);
    }
  }
}
CubeAnimation.initClass();
