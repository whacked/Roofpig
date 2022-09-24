/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
//= require Layer

describe("Layer", function() {

  // shift() is tested a lot more in Pieces3D_spec
  it("#shift", function() {
    expect(Layer.F.shift('L', 1)).to.equal('U');
    expect(Layer.F.shift('L', 2)).to.equal('R');
    expect(Layer.F.shift('L', 3)).to.equal('D');

    expect(Layer.F.shift('F', 1)).to.equal('F');
    expect(Layer.F.shift('Q', 1)).to.be.null;
    return expect(() => Layer.F.shift('F', 0)).to.throw(Error);
  });

  return it("on_same_axis_as", function() {
    expect(Layer.F.on_same_axis_as(Layer.B)).to.be.true;
    expect(Layer.F.on_same_axis_as(Layer.F)).to.be.true;
    expect(Layer.F.on_same_axis_as(Layer.U)).to.be.false;
    expect(Layer.M.on_same_axis_as(Layer.L)).to.be.true;
    return expect(Layer.M.on_same_axis_as(Layer.B)).to.be.false;
  });
});