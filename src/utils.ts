// import * as THREE from '../lib/three.js'

/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */


// --- Terser THREE.Vector3 ---
export const v3 = (x, y, z) => new window['THREE'].Vector3(x, y, z);

export const v3_add = (v1, v2) => v1.clone().add(v2);

export const v3_sub = (v1, v2) => v1.clone().sub(v2);

export const v3_x = (v, factor) => v.clone().multiplyScalar(factor);

// --- Piece names ---

export const standardize_name = function (name) {
  const sides: string[] = [name[0], name[1], name[2]];

  let result = "";
  for (let ordered_side of ['U', 'D', 'F', 'B', 'R', 'L']) {
    if (sides.includes(ordered_side)) {
      result += ordered_side;
    }
  }
  return result;
};

export const side_name = function (side) {
  if (side) { return side.name || side; } else { return ""; }
};

// --- Logging ---

export const log_error = text => console.log(`RoofPig error: ${text}`);



window['v3'] = v3
window['v3'] = v3
window['v3_add'] = v3_add
window['v3_sub'] = v3_sub
window['v3_x'] = v3_x
window['standardize_name'] = standardize_name
window['side_name'] = side_name
window['log_error'] = log_error
