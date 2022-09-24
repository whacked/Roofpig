/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */


type FIXME_Changer = any
export class ConcurrentChangers {
  sub_changers: FIXME_Changer[];
  constructor(sub_changers) {
    this.sub_changers = sub_changers;
  }

  update(now) {
    return Array.from(this.sub_changers).map((changer) =>
      changer.update(now));
  }

  finish() {
    return Array.from(this.sub_changers).map((changer) =>
      changer.finish());
  }

  finished() {
    for (let changer of Array.from(this.sub_changers)) {
      if (!changer.finished()) { return false; }
    }
    return true;
  }
}

window['ConcurrentChangers'] = ConcurrentChangers