/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
// --- Terser THREE.Vector3 ---

const v3 = (x, y, z) => new THREE.Vector3(x, y, z);

const v3_add = (v1, v2) => v1.clone().add(v2);

const v3_sub = (v1, v2) => v1.clone().sub(v2);

const v3_x = (v, factor) => v.clone().multiplyScalar(factor);

// --- Piece names ---

const standardize_name = function(name) {
  const sides = [name[0], name[1], name[2]];

  let result = "";
  for (let ordered_side of ['U', 'D', 'F', 'B', 'R', 'L']) {
    if (Array.from(sides).includes(ordered_side)) {
      result += ordered_side;
    }
  }
  return result;
};

const side_name = function(side) {
  if (side) { return side.name || side; } else { return ""; }
};

// --- Logging ---

const log_error = text => console.log(`RoofPig error: ${text}`);
