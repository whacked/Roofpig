'use strict';

var gulp   = require('gulp');
var gutil  = require('gulp-util');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var ts         = require('gulp-typescript');
var source     = require('vinyl-source-stream');
var tsify      = require('tsify');
var browserify = require('browserify');

var dateFormat = require('dateformat');
var del        = require('del');
var filenames  = require('gulp-filenames');
var replace    = require('gulp-replace');


var build_dir = 'local/build/';
var rp_js_file = 'roofpig.js';
var extras_file = '3extras.js';
var release_file = 'roofpig_and_three.min.js';

var tsProject = ts.createProject("tsconfig.json")

// ------------- BUILD -----
gulp.task('default', function() {
  return browserify({
    basedir: '.',
      debug: true,
      entries: [
          "src/utils.ts",
          "src/Layer.ts",
          'src/changers/TimedChanger.ts',
          'src/changers/CameraMovement.ts',
          'src/changers/MoveExecution.ts',
          'src/moves/SingleMove.ts',
          'src/moves/Move.ts',
          'src/changers/ConcurrentChangers.ts',
          'src/moves/CompositeMove.ts',
          'src/changers/AlgAnimation.ts',
          'src/moves/Alg.ts',
          'src/changers/OneChange.ts',
      ],
      cache: {},
      packageCache: {},
  })
    .exclude(require.resolve('./lib/three'))
    .plugin(tsify)
    .bundle()
    // .pipe(source("roofpig.js"))
    // .pipe(gulp.dest("local/build"))
    .pipe(source("ts-include.js"))
    .pipe(gulp.dest("src"))

  return tsProject.src().pipe(tsProject())
    .js
    .pipe(gulp.dest(build_dir));
});

gulp.task('clean-build', function() {
  return del(build_dir +'**/*');
});

gulp.task('build-rp', ['clean-build', 'default'], function() {
  return gulp.src([
      /*
      'src/utils.js',
      'src/Layer.js',
      */
      'src/ts-include.js',

      'src/Css.js',
      'src/document.js',
      'src/Cubexp.js',
      'src/Tweaks.js',
      'src/PovTracker.js',
      'src/Pieces3D.js',
      'src/EventHandlers.js',
      'src/Dom.js',
      'src/Colors.js',
      'src/Config.js',
      'src/CubeAnimation.js',
      'src/Camera.js',
    ])
    .pipe(concat('roofpig.js'))
    .pipe(replace('@@BUILT_WHEN@@', dateFormat(new Date(), "yyyy-mm-dd HH:MM")))
    // .pipe(uglify())
    .pipe(gulp.dest(build_dir));
});

gulp.task('build-3x', ['clean-build'], function() {
  return gulp.src(['lib/Projector.js', 'lib/CanvasRenderer.js'])
    // .pipe(uglify())
    .pipe(concat(extras_file))
    .pipe(gulp.dest(build_dir));
});

gulp.task('build', ['build-rp', 'build-3x'], function() {
  gulp.src(['lib/three.min.js', build_dir + extras_file, build_dir + rp_js_file])
    .pipe(concat(release_file))
    .pipe(gulp.dest(build_dir));
});


// ------------- TEST -----

var rename = require("gulp-rename");
var glob   = require("glob");
//var sourcemaps = require('gulp-sourcemaps');

var js_dir = 'local/test_js/';
var test_js_dir = js_dir+'test/';

gulp.task('clean-js', function() {
  return del(js_dir+'**/*');
});

gulp.task('compile-test', ['clean-js'], function() {
  return gulp.src('test/**/*.js')
//    .pipe(sourcemaps.init())
//    .pipe(sourcemaps.write())
    .pipe(gulp.dest(test_js_dir));
});

gulp.task('compile-src', ['clean-js'], function() {
  return gulp.src('src/**/*.js')
    .pipe(gulp.dest(js_dir+'src'));
});

gulp.task('test', ['compile-test', 'compile-src'], function(){
  var test_html = '';
  glob.sync(test_js_dir+'**/*.js', {}).forEach(function(test_file){
    test_html += '<script src="'+test_file+'"></script>\n';
  });

  console.log("\nTests generated. `open rptest.html` can run them!\n")

  return gulp.src('misc/rptest_template.html')
    .pipe(replace('@@TEST_FILES_GO_HERE@@', test_html))
    .pipe(rename('rptest.html'))
    .pipe(gulp.dest('.'));
});
