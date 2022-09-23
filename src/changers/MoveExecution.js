/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS205: Consider reworking code to avoid use of IIFEs
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
//= require TimedChanger

class MoveExecution extends TimedChanger {
  constructor(pieces, axis, angle_to_turn, turn_time, animate) {
    super(turn_time);
    this.pieces = pieces;
    this.axis = axis;
    this.angle_to_turn = angle_to_turn;

    if (!animate) {
      this.finish();
    }
  }

  do_change(completion_diff) {
    return Array.from(this.pieces).map((piece) =>
      this._rotateAroundWorldAxis(piece, completion_diff * this.angle_to_turn));
  }

  // Rotate an object around an arbitrary axis in world space #adapted from http://stackoverflow.com/questions/11119753/how-to-rotate-a-object-on-axis-world-three-js
  _rotateAroundWorldAxis(object, radians) {
    const rotWorldMatrix = new THREE.Matrix4();
    rotWorldMatrix.makeRotationAxis(this.axis, radians);
    rotWorldMatrix.multiply(object.matrix); // pre-multiply

    object.matrix = rotWorldMatrix;
    return object.rotation.setFromRotationMatrix(object.matrix);
  }

  _realign() {
    const p2 = Math.PI / 2;
    return (() => {
      const result = [];
      for (let piece of Array.from(this.pieces)) {
        var ref;
        const r = piece.rotation;
        result.push([r.x, r.y, r.z] = Array.from(ref = [Math.round(r.x / p2) * p2, Math.round(r.y / p2) * p2, Math.round(r.z / p2) * p2]), ref);
      }
      return result;
    })();
  }
}

