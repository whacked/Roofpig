/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
//= require utils
//= require Layer
//= require Cubexp

import { Cubexp } from "./Cubexp";
import { side_name, standardize_name } from "./utils";
import { Layer } from './Layer'

export class Tweaks {
  tweaks: {};

  constructor(expressions) {
    this.tweaks = {};
    if (!expressions) { return; }

    for (let expression of expressions.split(" ")) {
      var side;
      const [what, where] = expression.split(':');
      if (!where) { continue; }

      if (what.length === 1) {
        for (let piece_exp of Array.from(new Cubexp(where).selected_pieces())) {
          for (side of Array.from(piece_exp.split(''))) {
            this._add(piece_exp.toUpperCase(), side, what);
          }
        }
      } else {
        const piece = standardize_name(where.toUpperCase());
        const iterable = where.split('');
        for (let i = 0; i < iterable.length; i++) {
          side = iterable[i];
          this._add(piece, side, what[i]);
        }
      }
    }
  }


  for_sticker(piece, side) {
    const match = this.tweaks[standardize_name(piece)] || {};
    return match[side_name(side)] || [];
  }

  _add(piece, side, what) {
    if (Layer.side_by_name(side)) { // not lower case
      if (this.tweaks[piece] == null) { this.tweaks[piece] = {}; }
      if (this.tweaks[piece][side] == null) { this.tweaks[piece][side] = []; }
      return this.tweaks[piece][side].push(what);
    }
  }
}
