import { Cubexp } from "./Cubexp";
import { Layer } from "./Layer";
import { Tweaks } from "./Tweaks";
import { log_error } from "./utils";


export class Colors {
  static DEFAULT_COLORS = {
    g: '#0d0',
    b: '#07f',
    r: 'red',
    o: 'orange',
    y: 'yellow',
    w: '#eee'
  };

  static _set_colors(config_colors, h2c_map) {
    const dc = Colors.DEFAULT_COLORS; // shorten name for readability
    const result = {
      R: dc.g,
      L: dc.b,
      F: dc.r,
      B: dc.o,
      U: dc.y,
      D: dc.w,
      solved: '#444',
      ignored: '#888',
      cube: 'black'
    };
    const r = result; // shorten name for readability

    for (let override of config_colors.split(' ')) {
      let [type, color] = override.split(':');
      type = { s: 'solved', i: 'ignored', c: 'cube' }[type] || type;
      result[type] = Colors.DEFAULT_COLORS[color] || color;
    }

    r.U = r[h2c_map.U]
    r.D = r[h2c_map.D]
    r.R = r[h2c_map.R]
    r.L = r[h2c_map.L]
    r.F = r[h2c_map.F]
    r.B = r[h2c_map.B]
    return result;
  }

  colored: Cubexp;
  solved: Cubexp;
  tweaks: Tweaks;
  side_colors: { R: any; L: any; F: any; B: any; U: any; D: any; solved: string; ignored: string; cube: string; };

  constructor(pov, colored, solved, tweaks, overrides = "") {
    this.colored = new Cubexp(pov.cube_to_hand(colored) || "*");
    this.solved = new Cubexp(pov.cube_to_hand(solved));
    this.tweaks = new Tweaks(pov.cube_to_hand(tweaks));
    this.side_colors = Colors._set_colors(overrides, pov.hand_to_cube_map());
  }

  to_draw(piece_name, side) {
    const result = { hovers: false, color: this.of(side), x_color: undefined };

    if (this.solved.matches_sticker(piece_name, side)) {
      result.color = this.of('solved');
    } else if (this.colored.matches_sticker(piece_name, side)) {
      result.hovers = true;
    } else {
      result.color = this.of('ignored');
    }

    for (let tweak of this.tweaks.for_sticker(piece_name, side)) {
      result.hovers = true;
      switch (tweak) {
        case 'X': case 'x':
          result.x_color = { X: 'black', x: 'white' }[tweak];
          break;
        default:
          if (Layer.by_name(tweak)) {
            result.color = this.of(tweak);
          } else {
            log_error(`Unknown tweak: '${tweak}'`);
          }
      }
    }
    return result;
  }

  of(sticker_type) {
    const type = sticker_type.name || sticker_type;
    if (!this.side_colors[type]) {
      throw new Error(`Unknown sticker type '${sticker_type}'`);
    }
    return this.side_colors[type];
  }
}
