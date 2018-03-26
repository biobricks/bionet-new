'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var cssimport = require('gulp-cssimport');
var inlineSource = require('gulp-inline-source');
var js = require('./bin/build.js');
var jest = require('gulp-jest').default;
 
gulp.task('test', function () {
    process.env.NODE_ENV = 'test';
    return gulp.src('__tests__').pipe(jest({
    "preprocessorIgnorePatterns": [
      "<rootDir>/dist/", "<rootDir>/node_modules/"
    ],
    "automock": false
  }));
});

gulp.task('build:js', js.build); 
gulp.task('buildtest:js', js.buildtest); 

gulp.task('watch:js', js.watch);

// with hot module reloading
gulp.task('hot:js', js.hot);

gulp.task('build:css', function() {
  return gulp.src('./src/css/index.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cssimport())
    .pipe(gulp.dest('./static/build'));
});
 
gulp.task('watch:css', function() {
  gulp.watch('./src/css/**/*.scss', ['build:css']);
});

// not currently used
gulp.task('build:html', function() {
  return gulp.src('./static/index.html')
    .pipe(inlineSource())
    .pipe(gulp.dest('./static/build'));
});

gulp.task('buildtest', ['buildtest:js', 'build:css']);

gulp.task('build', ['build:js', 'build:css']);

gulp.task('watch', ['watch:js', 'watch:css']);

gulp.task('hot', ['hot:js', 'watch:css']);
