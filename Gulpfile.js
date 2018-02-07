/**
 * Automated build tasks for 'awocallaghan.github.io' Jekyll site
 * - Adapted and extended from Clean Blog's Gruntfile.js
 * @author Alex O'Callaghan
 *
 * Tasks:
 * ==
 * gulp build = build everything
 * gulp build:js = build JS
 * gulp build:css = build CSS
 *
 * gulp js = transpile JS
 * gulp js:vue = use browserify w/ babelify+vueify to transpile Vue components
 * gulp js:vue:<task> = defined in Gulp.config.json
 *
 * gulp uglify = minify JS
 * gulp uglify:<task> = defined in Gulp.config.json
 *
 * gulp concat = concatenate files
 * gulp concat:js = join all vendor + global scripts into js/common.min.js (defined in Gulp.config.json)
 */

// Load Gulp and required plugins
const gulp = require('gulp');
const babel = require('gulp-babel');
const rename = require('gulp-rename');
const browserify = require('browserify');
const babelify = require('babelify');
const vueify = require('vueify');
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer');
const sourcemaps = require('gulp-sourcemaps');
const pump = require('pump');
const uglify = require('gulp-uglify');
const path = require('path');
const concat = require('gulp-concat');
const watch = require('gulp-watch');
const batch = require('gulp-batch');

// Load JSON config
const config = require('./Gulp.config.json');

// Global build tasks
gulp.task('build', ['js', 'uglify', 'concat']);
gulp.task('build:js', ['concat:js','uglify']);
gulp.task('build:js:main', ['concat:js']);
gulp.task('build:js:projects', ['uglify:projects']);
gulp.task('build:js:maths-problems', ['uglify:maths-problems']);

// Build JavaScript files
// - Compile Vue components using Browserify + Vueify
// - Create each Vue task from Gulp.config.json
let vueTasks = Object.keys(config["js:vue"]);
for (let i = 0; i < vueTasks.length; i++) {
  let taskDef = config["js:vue"][vueTasks[i]];
  gulp.task(`js:vue:${vueTasks[i]}`, function () {
    let b = browserify({
      entries: taskDef.entries,
      debug: true,
      transform: [babelify, vueify],
    });
    return b.bundle()
      .pipe(source(taskDef.entries))
      .pipe(buffer())
      .pipe(rename(taskDef.rn))
      .pipe(gulp.dest(taskDef.dest));
  });
}
// - Create a global Vue task that runs all the vue tasks
gulp.task(
  'js:vue',
  vueTasks.map(taskName => `js:vue:${taskName}`)
);
// - All JS tasks
gulp.task('js', ['js:vue'], function () {
  console.log('JavaScript tasks complete');
});

// Uglify JavaScript tasks
// - Generic task function uglify from 'src' to 'dest'
function uglifyTask (src, rn, dest) {
  return function (cb) {
    pump([
      gulp.src(src),
      uglify(),
      rename(rn),
      gulp.dest(dest || './js')
    ], cb);
  };
}
// - Create each uglify task from Gulp.config.json
let uglifyTasks = Object.keys(config.uglify);
for (let i = 0; i < uglifyTasks.length; i++) {
  let taskName = `uglify:${uglifyTasks[i]}`;
  let taskDef = config.uglify[uglifyTasks[i]];
  let task = uglifyTask(
    taskDef.src,
    taskDef.rn,
    taskDef.dest
  );
  if (taskDef.hasOwnProperty('dependsOn')) {
    gulp.task(taskName, taskDef.dependsOn, task);
  } else {
    gulp.task(taskName, task);
  }
}
// - Define global uglify task
gulp.task(
  'uglify',
  uglifyTasks.map(task => `uglify:${task}`),
  function () {
    console.log('All uglify tasks complete');
  }
);

// Concatenate files
// - Generic concatenation task function
function concatTask (src, rn, dest) {
  return function () {
    // Concatenate src files => dest
    return gulp.src(src)
      .pipe(concat(rn))
      .pipe(gulp.dest(dest));
  };
}
// - Concatenate minified JS files into single 'js/common.min.js'
gulp.task(
  'concat:js', 
  ['uglify'], 
  concatTask(config["concat:js"].files, config["concat:js"].rn, './js')
);
// - Concat everything
gulp.task('concat', ['concat:js'], function () {
  console.log('Concatenation tasks complete');
});

// Watch files
// - Watch everything
gulp.task('watch', ['watch:js']);
// - Watch JS
gulp.task('watch:js', function () {
  watch(['js/site/clean-blog.js','js/projects/src/*','js/maths-problems/src/*'], batch(function (events, done) {
    gulp.start('build:js', done);
  }));
});
// - Watch JS: projects.js
gulp.task('watch:js:projects', function () {
  watch('js/projects/src/*', batch(function (events, done) {
    gulp.start('build:js:projects', done);
  }));
});
// - Watch JS: maths-problems/app.js
gulp.task('watch:js:maths-problems', function () {
  watch('js/maths-problems/src/*', batch(function (events, done) {
    gulp.start('build:js:maths-problems', done);
  }));
});
