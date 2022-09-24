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

import { Camera } from "./Camera";
import { OneChange } from "./changers/OneChange";
import { Config } from "./Config";
import { Dom } from "./Dom";
import { EventHandlers } from "./EventHandlers";
import { Alg } from "./moves/Alg";
import { Move } from "./moves/Move";
import { Pieces3D } from "./Pieces3D";
import { PovTracker } from "./PovTracker";
import { log_error } from "./utils";


const THREE = window['THREE'] // FIXME

export class CubeAnimation {
  static by_id: any;
  static last_id: number;
  static webgl_cubes: number;
  static webgl_browser: boolean;
  static canvas_browser: boolean;
  id: any;
  config: any;
  renderer: any;
  dom: any;
  scene: any;
  world3d: { camera: any; pieces: any; };
  alg: any;
  changers: {};
  now_solving: boolean;
  pov: any;
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

  static count() {
    return Object.keys(this.by_id).length;
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
      roofpig_div.html("This browser does not support <a href='http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation'>WebGL</a>.<p/> Find out how to get it <a href='http://get.webgl.org/'>here</a>.");
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

    this.dom = new Dom(this.id, roofpig_div, this.renderer, this.has_alg(), this.config.flag('showalg'), this.user_controlled());
    this.scene = new THREE.Scene();
    this.world3d = {
      camera: new Camera(this.config.hover, this.config.pov),
      pieces: new Pieces3D(this.scene, this.config.hover, this.config.colors, use_canvas)
    };

    this.alg = new Alg(this.config.alg, this.world3d, this.config.algdisplay, this.config.speed, this.dom);

    if (this.config.setup) { new Alg(this.config.setup, this.world3d).to_end(); }
    if (!this.config.flag('startsolved')) { this.alg.mix(); }

    if (CubeAnimation.count() === 1) {
      EventHandlers.set_focus(this);
    }

    this.changers = {};
    this.animate(true);

    EventHandlers.initialize();
    // } catch (e) {
    //   roofpig_div.html(e.message);
    //   roofpig_div.css({ background: '#f66' });
    // }
  }

  has_alg() {
    return this.config.alg !== "";
  }

  user_controlled() {
    return !this.has_alg();
  }

  solved() {
    return this.world3d.pieces.solved();
  }

  reset() {
    return this.add_changer('pieces', new OneChange(() => this.world3d.pieces.reset()));
  }

  starting_solve() {
    return this.now_solving = true;
  }

  remove() {
    if (this === EventHandlers.focus()) {
      const new_focus = (this === this.next_cube() ? null : this.next_cube());
      EventHandlers.set_focus(new_focus);
    }
    delete CubeAnimation.by_id[this.id];
    return this.dom.div.remove();
  }

  animate(first_time = false) {  // called for each redraw
    let any_change;
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

  external_move(hand_code) {
    if (!this.pov) { this.pov = new PovTracker(); }
    const move = Move.make(hand_code, this.world3d, 200);
    this.pov.track(move);
    if (this.now_solving) {
      document.dispatchEvent(new CustomEvent('cube_move', { detail: { move: hand_code } }));
    }
    this.add_changer('pieces', move.show_do());
    if (this.solved() && this.now_solving) {
      document.dispatchEvent(new CustomEvent('cube_solved', { detail: { 'id': this.id } }));
      return this.now_solving = false;
    }
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
