/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
// Does a single immediate change
export class OneChange {
  action: any;
  constructor(action) {
    this.action = action;
  }

  update(now) {
    return this.action();
  }

  finish() { }

  finished() {
    return true;
  }
}
