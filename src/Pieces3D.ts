/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS202: Simplify dynamic range loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */

const THREE = window['THREE']


import { standardize_name, v3, v3_add, v3_sub, v3_x } from "./utils";
import { Layer } from './Layer'

// pieces.UFR is the 3D model for the UFR piece
//
// -- Keeping track of where the 3D pieces are is hard, so we track them in parallel:
// pieces.at.UFR is the 3D piece currently at the UFR position
// piece.UFR.sticker_locations == 'LFU' means the U sticker is on the L side, the F sticker on F, and R sticker on U
//
export const Pieces3D = function () {
  let TINY = undefined;
  let NAMES = undefined;
  let Pieces3D = class Pieces3D {
    use_canvas: any;
    at: {};
    cube_surfaces: boolean[];
    sticker_size: number;
    hover_size: number;
    static initClass() {
      TINY = 0.0030;
      NAMES = ['B', 'BL', 'BR', 'D', 'DB', 'DBL', 'DBR', 'DF', 'DFL', 'DFR', 'DL', 'DR', 'F', 'FL', 'FR', 'L', 'R', 'U', 'UB', 'UBL', 'UBR', 'UF', 'UFL', 'UFR', 'UL', 'UR'];
    }

    constructor(scene, hover, colors, use_canvas) {
      this.use_canvas = use_canvas;
      this.at = {};
      this.cube_surfaces = this.use_canvas ? [true] : [true, false];
      this.sticker_size = this.use_canvas ? 0.84 : 0.90;
      this.hover_size = this.use_canvas ? 0.91 : 0.97;
      this.make_surfaces(scene, hover, colors);
    }

    on(layer) {
      return (layer.positions.map((position) => this.at[position]));
    }

    move(layer, turns) {
      const positive_turns = (turns + 4) % 4;
      this._track_stickers(layer, positive_turns);
      return this._track_pieces(positive_turns, layer.cycle1, layer.cycle2);
    }

    solved() {
      const side_for = {};
      for (let center of ['B', 'R', 'D', 'F', 'L', 'U']) {
        side_for[this.at[center].name] = center;
      }

      for (let position_name of NAMES) {
        const iterable = this.at[position_name].name.split('');
        for (let index = 0; index < iterable.length; index++) {
          const sticker_color = iterable[index];
          if (side_for[sticker_color] !== this.at[position_name].sticker_locations[index]) {
            return false;
          }
        }
      }
      return true;
    }

    state() {
      const result = [];
      for (let name of NAMES) {
        result.push(`${name}: ${this.at[name].name} -> ${this.at[name].sticker_locations.join('')}`);
      }
      return result.join("\n");
    }

    _track_stickers(layer, turns) {
      return this.on(layer).map((piece) =>
        (piece.sticker_locations = (piece.sticker_locations.map((item) => layer.shift(item, turns)))));
    }

    _track_pieces(turns, cycle1, cycle2) {
      return (() => {
        const result = [];
        for (let n = 1, end = turns, asc = 1 <= end; asc ? n <= end : n >= end; asc ? n++ : n--) {
          this._permute(cycle1);
          result.push(this._permute(cycle2));
        }
        return result;
      })();
    }

    reset() {
      return (() => {
        const result = [];
        for (let name of NAMES) {
          const piece = this[name];

          this.at[name] = piece;
          piece.sticker_locations = name.split('');
          result.push(piece.rotation.x = (piece.rotation.y = (piece.rotation.z = 0)));
        }
        return result;
      })();
    }


    _permute(p) {
      let ref;
      return [this.at[p[0]], this.at[p[1]], this.at[p[2]], this.at[p[3]]] = Array.from(ref = [this.at[p[1]], this.at[p[2]], this.at[p[3]], this.at[p[0]]]), ref;
    }

    // ========= The 3D Factory =========

    make_surfaces(scene, hover, colors) {
      const slice = { normal: v3(0.0, 0.0, 0.0), name: '-' };

      return [Layer.R, slice, Layer.L].map((x_side) =>
        [Layer.F, slice, Layer.B].map((y_side) =>
          (() => {
            const result = [];
            for (let z_side of [Layer.U, slice, Layer.D]) {
              const piece = this._new_piece(x_side, y_side, z_side);

              for (let side of [x_side, y_side, z_side]) {
                if (side !== slice) {
                  const sticker_look = colors.to_draw(piece.name, side);

                  this._add_sticker(side, piece, sticker_look);
                  if (sticker_look.hovers && (hover > 1)) { this._add_hover_sticker(side, piece, sticker_look, hover); }
                  this._add_cubeside(side, piece, colors.of('cube'));
                }
              }

              this[piece.name] = (this.at[piece.name] = piece);
              result.push(scene.add(piece));
            }
            return result;
          })()));
    }

    _new_piece(x_side, y_side, z_side) {
      const new_piece = new THREE.Object3D();
      new_piece.name = standardize_name(x_side.name + y_side.name + z_side.name);
      // @ts-ignore
      new_piece.sticker_locations = new_piece.name.split('');
      // @ts-ignore
      new_piece.middle = v3(2 * x_side.normal.x, 2 * y_side.normal.y, 2 * z_side.normal.z);
      return new_piece;
    }

    _add_sticker(side, piece_3d, sticker) {
      const [dx, dy] = this._offsets(side.normal, this.sticker_size, false);
      piece_3d.add(this._diamond(this._square_center(side, piece_3d.middle, 1 + TINY), dx, dy, sticker.color));

      if (sticker.x_color) {
        return this._add_X(side, piece_3d, sticker.x_color, 1 + (2 * TINY), true);
      }
    }

    _add_hover_sticker(side, piece_3d, sticker, hover) {
      const [dx, dy] = this._offsets(side.normal, this.hover_size, true);
      piece_3d.add(this._diamond(this._square_center(side, piece_3d.middle, hover), dx, dy, sticker.color));

      if (sticker.x_color) {
        return this._add_X(side, piece_3d, sticker.x_color, hover - TINY, false);
      }
    }

    _add_cubeside(side, piece_3d, color) {
      return (() => {
        const result = [];
        for (let reversed of this.cube_surfaces) {
          const [dx, dy] = this._offsets(side.normal, 1.0, reversed);
          result.push(piece_3d.add(this._diamond(this._square_center(side, piece_3d.middle, 1), dx, dy, color)));
        }
        return result;
      })();
    }

    _add_X(side, piece_3d, color, distance, reversed) {
      const [dx, dy] = Array.from(this._offsets(side.normal, 0.54, reversed));
      const center = this._square_center(side, piece_3d.middle, distance);
      piece_3d.add(this._rect(center, dx, v3_x(dy, 0.14), color));
      return piece_3d.add(this._rect(center, v3_x(dx, 0.14), dy, color));
    }

    _square_center(side, piece_center, distance) {
      return v3_add(piece_center, v3_x(side.normal, distance));
    }

    _rect(center, d1, d2, color) {
      return this._diamond(center, v3_add(d1, d2), v3_sub(d1, d2), color);
    }

    _diamond(center, d1, d2, color) {
      const geo = new THREE.Geometry();
      geo.vertices.push(v3_add(center, d1), v3_add(center, d2), v3_sub(center, d1), v3_sub(center, d2));
      geo.faces.push(new THREE.Face3(0, 1, 2), new THREE.Face3(0, 2, 3));

      // http://stackoverflow.com/questions/20734216/when-should-i-call-geometry-computeboundingbox-etc
      geo.computeFaceNormals();
      geo.computeBoundingSphere();

      return new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color, overdraw: 0.8 }));
    }

    _offsets(axis1, sticker_size, reversed) {
      const axis2 = v3(axis1.y, axis1.z, axis1.x);
      const axis3 = v3(axis1.z, axis1.x, axis1.y);
      const flip = (axis1.y + axis1.z + axis1.x) * (reversed ? -1.0 : 1.0);

      const dx = v3_add(axis2, axis3).multiplyScalar(sticker_size * flip);
      const dy = v3_sub(axis2, axis3).multiplyScalar(sticker_size);
      return [dx, dy];
    }
  };
  Pieces3D.initClass();
  return Pieces3D;
}();
