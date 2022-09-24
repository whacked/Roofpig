/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
//= require three.min.js
//= require <utils.coffee>

describe("v3", function() {
  it("#constructor", function() {
    const v123 = v3(1, 2, 3);
    expect(v123.x).to.equal(1);
    expect(v123.y).to.equal(2);
    return expect(v123.z).to.equal(3);
  });

  it("#add", function() {
    const sum = v3_add(v3(1, 2, 3), v3(4, 5, 6));
    expect(sum.x).to.equal(5);
    expect(sum.y).to.equal(7);
    return expect(sum.z).to.equal(9);
  });

  it("#sub", function() {
    const diff = v3_sub(v3(5, 6, 7), v3(3, 2, 1));
    expect(diff.x).to.equal(2);
    expect(diff.y).to.equal(4);
    return expect(diff.z).to.equal(6);
  });

  it("#x", function() {
    const whole = v3(2, 4, 6);
    const half = v3_x(whole, 0.5);
    expect(half.x).to.equal(whole.x/2);
    expect(half.y).to.equal(whole.y/2);
    return expect(half.z).to.equal(whole.z/2);
  });

  describe("#standardize_name", () => it("ignores non side names, and only looks at 3 first characters", function() {
    expect(standardize_name("LDF")).to.equal("DFL");
    expect(standardize_name("LdF")).to.equal("FL");
    expect(standardize_name("RDFL")).to.equal("DFR");
    return expect(standardize_name("x UD")).to.equal("U");
  }));

  return describe("#side_name", () => it("works with strings, Layer objects and nulls", function() {
    expect(side_name("F")).to.equal("F");
    expect(side_name({name: "D"})).to.equal("D");
    return expect(side_name()).to.equal("");
  }));
});