/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
//= require utils
//= require Layer

import { Layer } from "./Layer";
import { log_error, v3, v3_add, v3_sub, v3_x } from "./utils";


const THREE = window['THREE'] // FIXME

export const Camera = (function () {
  let DISTANCE = undefined;
  let Camera = class Camera {
    static _POVs: Record<string, any>;
    cam: any;
    pov_code: any;
    user_dir: {
      dr: any; // dr == "down right"
      dl: any; // dl == "down left"
      up: any;
    };
    unbent_up: any;
    static initClass() {
      DISTANCE = 25;


      this._POVs = (function () {
        const result = {};
        for (let z of [Layer.U, Layer.D]) {
          const [zu, zl, zn] = Array.from([z.name, z.name.toLowerCase(), z.normal.clone()]);
          for (let y of [Layer.F, Layer.B]) {
            const [yu, yl, yn] = Array.from([y.name, y.name.toLowerCase(), y.normal.clone()]);
            for (let x of [Layer.R, Layer.L]) {
              const [xu, xl, xn] = Array.from([x.name, x.name.toLowerCase(), x.normal.clone()]);

              const pos = v3(xn.x, yn.y, zn.z).multiplyScalar(DISTANCE);
              const parity = xn.x * yn.y * zn.z;

              Camera._set_perms(result, zu, yl, xl, Camera._flip({ pos, up: zn, zn, yn, xn }, parity));
              Camera._set_perms(result, zl, yu, xl, Camera._flip({ pos, up: yn, zn: yn, yn: xn, xn: zn }, parity));
              Camera._set_perms(result, zl, yl, xu, Camera._flip({ pos, up: xn, zn: xn, yn: zn, xn: yn }, parity));
            }
          }
        }
        return result;
      })();
    }

    constructor(hover, pov_code) {
      this.cam = new THREE.PerspectiveCamera(this._view_angle(hover, DISTANCE), 1, 1, 100);

      let pov = Camera._POVs[pov_code];
      if (!pov) {
        pov = Camera._POVs.Ufr;
        log_error(`Invalid POV '${this.pov_code}'. Using Ufr`);
      }

      this.cam.position.copy(pov.pos);
      this.cam.up.copy(pov.up);

      // Directions, as seen on the screen
      this.user_dir = {
        dr: pov.xn.clone(), // dr == "down right"
        dl: pov.yn.clone(), // dl == "down left"
        up: pov.zn.clone()
      };
      this._cam_moved();
    }


    rotate(axis, angle) {
      for (let v of [this.cam.position, this.cam.up, this.user_dir.dl, this.user_dir.dr, this.user_dir.up]) {
        v.applyAxisAngle(axis, angle);
      }
      return this._cam_moved();
    }

    to_position() {
      let ref;
      return [this.cam.position, this.cam.up, this.user_dir.dl, this.user_dir.dr, this.user_dir.up].map((v) =>
        ([v.x, v.y, v.z] = Array.from(ref = [Math.round(v.x), Math.round(v.y), Math.round(v.z)]), ref));
    }

    bend(dx, dy) {
      const v1 = v3_x(this.user_dir.up, dx);
      const v2 = v3_sub(this.user_dir.dr, this.user_dir.dl).normalize().multiplyScalar(dy);
      const axis = v3_add(v1, v2).normalize();

      this.cam.position.copy(this.unbent_position);
      this.cam.up = this.unbent_up.clone();
      for (let v of [this.cam.position, this.cam.up]) {
        v.applyAxisAngle(axis, Math.sqrt((dx * dx) + (dy * dy)));
      }
      return this.cam.lookAt(v3(0, 0, 0));
    }
    unbent_position(unbent_position: any) {
      throw new Error("Method not implemented.");
    }

    _view_angle(hover, cam_pos) {
      const max_cube_size = 2 * Math.sqrt((hover * hover) + (4 * hover) + 13);
      const distance = Math.sqrt(3 * cam_pos * cam_pos) - 2;
      const adjustment_factor = 1.015 + ((0.13 * (5 - hover)) / 4); // I don't understand the math, but this looks OK
      return adjustment_factor * 2 * Math.atan(max_cube_size / (2 * distance)) * (180 / Math.PI);
    }

    _cam_moved() {
      this.cam.lookAt(v3(0, 0, 0));
      this.unbent_up = this.cam.up.clone();
      return this.unbent_position = this.cam.position.clone();
    }

    static _flip(pov, parity) {
      if (parity > 0) {
        [pov.xn, pov.yn] = Array.from([pov.yn, pov.xn]);
      }
      return pov;
    }

    static _set_perms(povs, a, b, c, value) {
      return povs[a + b + c] = (povs[a + c + b] = (povs[b + a + c] = (povs[b + c + a] = (povs[c + a + b] = (povs[c + b + a] = value)))));
    }
  };
  Camera.initClass();
  return Camera;
})();
