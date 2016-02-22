'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var coffee = require('gulp-coffee');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var mochaPhantomJS = require('gulp-mocha-phantomjs');

gulp.task('watch', function() {
  gulp.start('sass')
  gulp.watch('./scss/**/*.scss', ['sass']);
  gulp.watch('./src/*.coffee', ['coffee']);
  gulp.watch('./test/src/*.coffee', ['testCoffee']);
});

gulp.task('default', function() {
  gulp.start('sass', 'coffee', 'testCoffee', 'compress', 'test');
});

gulp.task('sass', function () {
  return gulp.src('./scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});

gulp.task('concat', function() {
  return gulp.src(['./src/GameManager.coffee','./src/InputManager.coffee','./src/Parser.coffee','./src/Inventory.coffee','./src/Scene.coffee','./src/Sound.coffee','./src/TextPrinter.coffee','./src/UI.coffee','./src/Util.coffee','./src/Main.coffee'])
    .pipe(concat('novel.coffee'))
    .pipe(gulp.dest('./'));
});

gulp.task('testConcat', function() {
  return gulp.src(['./test/src/Init.coffee','./test/src/Parser-test.coffee'])
    .pipe(concat('test.coffee'))
    .pipe(gulp.dest('./test'));
});

gulp.task('coffee', ['concat'], function() {
  return gulp.src('./novel.coffee')
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(gulp.dest('./'));
});

gulp.task('testCoffee', ['testConcat'], function() {
  return gulp.src('./test/test.coffee')
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(gulp.dest('./test'));
});

gulp.task('compress', ['coffee'], function() {
  return gulp.src('./novel.js')
    .pipe(uglify({"mangle":true}))
    .pipe(gulp.dest('dist'));
});

gulp.task('test', function () {
  return gulp.src('test/index.html')
    .pipe(mochaPhantomJS());
});
