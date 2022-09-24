/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
//= require TimedChanger

import { TimedChanger } from "./TimedChanger";

class CameraMovement extends TimedChanger {
  camera: any;
  angle_to_turn: number;
  axis: any;
  constructor(camera, axis, angle_to_turn, turn_time, animate) {
    super(turn_time);
    this.camera = camera;
    this.axis = axis;
    this.angle_to_turn = angle_to_turn;

    if (!animate) {
      this.finish();
    }
  }

  do_change(completion_diff) {
    return this.camera.rotate(this.axis, completion_diff * this.angle_to_turn);
  }

  _realign() {
    return this.camera.to_position();
  }
}

window['CameraMovement'] = CameraMovement