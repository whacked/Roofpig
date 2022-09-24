/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
//= require Alg
//= require Colors

import { Colors } from "./Colors";
import { log_error } from "./utils";
import { Alg } from './moves/Alg'


enum ConfigProperty {
  ALG = 'alg',
  BASE = 'base',
  ALGDISPLAY = 'algdisplay',
  COLORED = 'colored',
  COLORS = "colors",
  FLAGS = 'flags',
  HOVER = 'hover',
  POV = 'pov',
  SETUPMOVES = 'setupmoves',
  SOLVED = 'solved',
  SPEED = 'speed',
  TWEAKS = 'tweaks',
}

type ConfigRecord = { [P in ConfigProperty]?: any };

export enum Flags {
  STARTSOLVED = 'startsolved',
  CANVAS = 'canvas',
  SHOWALG = 'showalg',
}

export interface AlgDisplay {
  fancy2s: boolean,
  rotations: boolean,
  Zcode: "2" | "2'" | "Z",
}

enum AlgDisplayFlags {
  fancy2s = 'fancy2s',
  rotations = 'rotations',
  '2p' = '2p',
  Z = 'Z',
}

export enum HoverProperty {
  NEAR = 'near',
  FAR = 'far',
  NONE = 'none',
}

export class Config {
  raw_input: ConfigRecord;
  base: Config | { raw(): void; };
  alg: any;
  algdisplay: AlgDisplay;
  colors: Colors;
  flags: string;
  hover: number;
  pov: any;
  setup: any;
  speed: any;
  constructor(config_string) {
    this.raw_input = Config._parse(config_string);
    this.base = this.base_config(this.raw_input[ConfigProperty.BASE], config_string);

    this.alg = this.raw(ConfigProperty.ALG);
    this.algdisplay = this._alg_display();
    this.colors = new Colors(
      Alg.pov_from(this.alg),
      this.raw(ConfigProperty.COLORED),
      this.raw(ConfigProperty.SOLVED),
      this.raw(ConfigProperty.TWEAKS),
      this.raw(ConfigProperty.COLORS)
    );
    this.flags = this.raw(ConfigProperty.FLAGS);
    this.hover = this._hover();
    this.pov = this.raw(ConfigProperty.POV, "Ufr");
    this.setup = this.raw(ConfigProperty.SETUPMOVES);
    this.speed = this.raw(ConfigProperty.SPEED, 400);
  }

  flag(name: string) {
    return this.flags.indexOf(name) > -1;
  }

  raw<T = string>(name: ConfigProperty, default_value: string | number = ""): T {
    return this.raw_input[name] || this.base.raw(name) || default_value;
  }

  base_config(base_id, config_string) {
    let base_string = window[`ROOFPIG_CONF_${base_id}`];
    if (base_id && !base_string) {
      log_error(`'ROOFPIG_CONF_${base_id}' does not exist`);
    }

    if (config_string && (config_string === base_string)) {
      log_error(`${base_string} tries to inherit from itself.`);
      base_string = null;
    }

    if (base_string) { return new Config(base_string); } else { return { raw() { } }; }
  }

  _hover(): number {
    const raw_hover = this.raw<HoverProperty>(ConfigProperty.HOVER, HoverProperty.NEAR);
    switch (raw_hover) {
      case HoverProperty.NONE: return 1.0;
      case HoverProperty.NEAR: return 2.0;
      case HoverProperty.FAR: return 7.1;
      default:
        return raw_hover;
    }
  }

  _alg_display(): AlgDisplay {
    const ad = this.raw(ConfigProperty.ALGDISPLAY);
    const result: AlgDisplay = {
      fancy2s: ad.indexOf(AlgDisplayFlags.fancy2s) > -1,
      rotations: ad.indexOf(AlgDisplayFlags.rotations) > -1,
      Zcode: "2",
    };
    if (ad.indexOf(AlgDisplayFlags['2p']) > -1) { result.Zcode = "2'"; }
    if (ad.indexOf(AlgDisplayFlags.Z) > -1) { result.Zcode = "Z"; }
    return result;
  }

  static _parse(config_string: string): ConfigRecord {
    if (!config_string) { return {}; }

    const result: ConfigRecord = {};
    for (let conf of config_string.split("|")) {

      const eq_pos = conf.indexOf("=");
      const key = conf.substring(0, eq_pos).trim();
      const value = conf.substring(eq_pos + 1).trim();

      if (!(key in ConfigProperty)) {
        log_error(`Unknown config parameter '${key}' ignored`);
        continue
      }
      result[key] = value;
    }

    return result;
  }
}