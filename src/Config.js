/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
//= require Alg
//= require Colors

let ALG, ALGDISPLAY, BASE, COLORED, COLORS, FLAGS, HOVER, POV, SETUPMOVES, SOLVED, SPEED, TWEAKS;
class Config {
  constructor(config_string) {
    this.raw_input = Config._parse(config_string);
    this.base = this.base_config(this.raw_input[BASE], config_string);

    this.alg = this.raw(ALG);
    this.algdisplay= this._alg_display();
    this.colors = new Colors(Alg.pov_from(this.alg), this.raw(COLORED), this.raw(SOLVED), this.raw(TWEAKS), this.raw(COLORS));
    this.flags = this.raw(FLAGS);
    this.hover = this._hover();
    this.pov = this.raw(POV, "Ufr");
    this.setup = this.raw(SETUPMOVES);
    this.speed = this.raw(SPEED, 400);
  }

  flag(name) {
    return this.flags.indexOf(name) > -1;
  }

  raw(name, default_value) {
    if (default_value == null) { default_value = ""; }
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

    if (base_string) { return new Config(base_string); } else { return { raw() {} }; }
  }

  _hover() {
    const raw_hover = this.raw(HOVER, "near");
    switch (raw_hover) {
      case 'none': return 1.0;
      case 'near': return 2.0;
      case 'far': return 7.1;
      default:
        return raw_hover;
    }
  }

  _alg_display() {
    const ad = this.raw(ALGDISPLAY);
    const result = {};
    result.fancy2s = ad.indexOf('fancy2s') > -1;
    result.rotations = ad.indexOf('rotations') > -1;
    result.Zcode = "2";
    if (ad.indexOf('2p') > -1) { result.Zcode = "2'"; }
    if (ad.indexOf('Z') > -1) { result.Zcode = "Z"; }
    return result;
  }

  static _parse(config_string) {
    if (!config_string) { return {}; }

    const result = {};
    for (let conf of Array.from(config_string.split("|"))) {
      const eq_pos = conf.indexOf("=");
      const key = conf.substring(0, eq_pos).trim();
      const value = conf.substring(eq_pos+1).trim();
      result[key] = value;

      if (PROPERTIES.indexOf(key) === -1) {
        log_error(`Unknown config parameter '${key}' ignored`);
      }
    }

    return result;
  }
}

var PROPERTIES = [
  (ALG = 'alg'), (BASE = 'base'), (ALGDISPLAY = 'algdisplay'), (COLORED = 'colored'), (COLORS = "colors"), (FLAGS = 'flags'),
  (HOVER = 'hover'), (POV = 'pov'), (SETUPMOVES = 'setupmoves'), (SOLVED = 'solved'), (SPEED = 'speed'), (TWEAKS = 'tweaks')
];
