/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
//= require three.min
//= require jquery-3.1.1.min.js
//= require Camera
//= require CubeAnimation
//= require EventHandlers

const mock_div = {
  data() {},
  css() {},
  width() {},
  append() {},
  attr() {},
  remove() {}
};

const new_cube = () => new CubeAnimation(mock_div);

describe("CubeAnimation", function() {
  beforeEach(function() {
    CubeAnimation.webgl_browser = true;
    CubeAnimation.canvas_browser = true;
    CubeAnimation.last_id = 0;
    CubeAnimation.by_id = [];
    return EventHandlers.initialize;
  });

  it("gives the keyboard focus to the first CubeAnimation created", function() {
    expect(EventHandlers.focus().is_null).to.equal(true);

    const c1 = new_cube();
    expect(EventHandlers.focus()).to.equal(c1);

    const c2 = new_cube();
    return expect(EventHandlers.focus()).to.equal(c1);
  });

  it("@id, #next_cube(), #previous_cube()", function() {
    const [c1, c2, c3] = Array.from([new_cube(), new_cube(), new_cube()]);

    expect(c1.id).to.equal(1);
    expect(c2.id).to.equal(2);
    expect(c3.id).to.equal(3);

    expect(c1.next_cube()).to.equal(c2);
    expect(c2.next_cube()).to.equal(c3);
    expect(c3.next_cube()).to.equal(c1);

    expect(c1.previous_cube()).to.equal(c3);
    expect(c2.previous_cube()).to.equal(c1);
    expect(c3.previous_cube()).to.equal(c2);

    c2.remove();

    expect(c1.next_cube()).to.equal(c3);
    expect(c3.next_cube()).to.equal(c1);
    expect(c1.previous_cube()).to.equal(c3);
    return expect(c3.previous_cube()).to.equal(c1);
  });

  return it("removes focus from deleted cubes", function() {
    const [c1, c2] = Array.from([new_cube(), new_cube()]);
    expect(EventHandlers.focus()).to.equal(c1);

    c1.remove();

    expect(EventHandlers.focus()).to.equal(c2);

    c2.remove();

    return expect(EventHandlers.focus().is_null).to.equal(true);
  });
});

