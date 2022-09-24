/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
// Any change to the world (3D model or camera) must be done with a Changer object.
//
// Changers must implement 3 functions
// - update: (now) ->
//     Performs a change, possibly based on time.
// - finish: ->
//     Finish this Changer, probably since a new one has arrived.
// - finished: ->
//     Returns true if this Changer is done.



export class TimedChanger { // Base class
  duration: number;
  start_time: number;
  last_time: number;
  private _finished: boolean;

  constructor(duration) {
    this.duration = duration;
    this.start_time = (new Date()).getTime();
    this.last_time = this.start_time;
  }

  update(now) {
    if (this._finished) { return; }

    if (now > (this.start_time + this.duration)) {
      return this.finish();
    } else {
      return this._make_change(now);
    }
  }

  finish() {
    if (!this.finished()) {
      this._make_change(this.start_time + this.duration);
      this._finished = true;
      return this._realign();
    }
  }

  finished() {
    return this._finished;
  }

  do_change(completion_diff) { }  // abstract method
  _realign() { }  // abstract method

  _make_change(to_time) {
    this.do_change(this._ease(to_time) - this._ease(this.last_time));
    return this.last_time = to_time;
  }

  // Ease in/out makes the movement look natural
  _ease(a_time) {
    const x = (a_time - this.start_time) / this.duration;
    return x * x * (2 - (x * x));
  }
}