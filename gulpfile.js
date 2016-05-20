'use strict';

// Build Dependencies
var gulp = require('gulp');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var watch = require('gulp-watch');
var batch = require('gulp-batch');
var metaScript = require('gulp-metascript');
var del = require('del');

// Build Configuration
var buildConfig = require('./.build.config');

// Web Server
var webserver = require('gulp-webserver');

// Command Line Args
var argv = require('yargs').argv;

// Code Quality Dependencies
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var lintReporter = require('jshint-stylish').reporter;
var browserCompatibility = require('gulp-browser-compat');

// Test Dependencies
var Jasmine = require('jasmine');

// Helpers
function build(options) {
    return gulp.src(buildConfig.entryPoint)
        .pipe(browserify(options.browserify))
        .pipe(metaScript(options.metaScript))
        .pipe(rename(buildConfig.buildName + '.js'))
        .pipe(gulp.dest(buildConfig.buildDir))
        .pipe(uglify(buildConfig.uglifyOptions))
        .pipe(rename(buildConfig.buildName + '.min.js'))
        .pipe(gulp.dest(buildConfig.buildDir));
}

// Tasks
gulp.task('clean', function () {
    var stream = del([buildConfig.buildDir]);
    return stream;
});

gulp.task('lint', function () {
    return gulp.src(['./src/**/*.js'])
        .pipe(jshint(buildConfig.jshint))
        .pipe(jshint.reporter(lintReporter))
        .pipe(jscs())
        .pipe(jscs.reporter());
});

gulp.task('test', function () {
    var jasmine = new Jasmine();
    jasmine.loadConfig({
        spec_dir: 'tests',
        spec_files: [
            '/**/*\.test\.js',
        ]
    });
    jasmine.execute();
});


gulp.task('compat', ['prod-build'], function () {
    return gulp.src(buildConfig.buildDir + buildConfig.buildName + '.js')
        .pipe(browserCompatibility(gulp.dest, buildConfig.compatConfig));
});


gulp.task('build', ['clean'], function () {
    return build(buildConfig.devBuild);
});

gulp.task('prod-build', ['clean'], function () {
    return build(buildConfig.prodBuild);
});

gulp.task('watch', function () {
    watch(buildConfig.srcDir, batch(function (events, done) {
        gulp.start('build', done);
    }));
});

gulp.task('serve', function () {
    var port = argv.port || 8080
    gulp.src('.')
        .pipe(webserver({
            livereload: true,
            directoryListing: true,
            port: port
        }));
});

gulp.task('default', ['build']);