/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
//= require Css

$(document).ready(function() {
  console.log("Roofpig version 1.5 pre release. ♇ (@@BUILT_WHEN@@). Expecting jQuery 3.1.1 and Three.js 71.");
  console.log("jQuery version", $.fn.jquery);

  $('head').append(Css.CODE);

  CubeAnimation.initialize();

  const pigs = $('.roofpig');
  console.log(`Found ${pigs.length} .roofpig divs`);
  return Array.from(pigs).map((roofpig_div) =>
    new CubeAnimation($(roofpig_div)));
});
