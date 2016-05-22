'use strict';

// Build Configuration
var buildConfig = require('./.build.config');

// Build Dependencies
var gulp        = require('gulp');
var uglify      = require('gulp-uglify');
var rename      = require('gulp-rename');
var watch       = require('gulp-watch');
var batch       = require('gulp-batch');
var metaScript  = require('gulp-metascript');
var del         = require('del');
var browserify  = require('browserify');
var source      = require('vinyl-source-stream');
var buffer      = require('vinyl-buffer');

// Web Server
var webserver   = require('gulp-webserver');

// Command Line Args
var argv        = require('yargs').argv;

// Code Quality Dependencies
var jshint      = require('gulp-jshint');
var jscs        = require('gulp-jscs');
var reporter    = require('jshint-stylish').reporter;
var compat      = require('gulp-browser-compat');

// Test Dependencies
var Jasmine     = require('jasmine');

// Build Helpers
function build(options) {

    return browserify(options.browserify)
        .bundle()
        .pipe(source(buildConfig.buildName + '.js'))
        .pipe(buffer())
        .pipe(gulp.dest(buildConfig.buildDir))
        .pipe(uglify(buildConfig.uglifyOptions))
        .pipe(rename(buildConfig.buildName + '.min.js'))
        .pipe(gulp.dest(buildConfig.buildDir));
}

function meta(metaScriptOptions) {
    return gulp.src(buildConfig.srcDir)
        .pipe(metaScript(metaScriptOptions))
        .pipe(gulp.dest(buildConfig.tmp));
}

// Build Tasks
gulp.task('clean', function () {
    return del([buildConfig.buildDir, buildConfig.tmp]);
});

gulp.task('meta-dev', ['clean'], function () {
    return meta(buildConfig.devBuild.metaScript);
});

gulp.task('meta-prod', ['clean'], function () {
    return meta(buildConfig.prodBuild.metaScript);
});

gulp.task('build', ['meta-dev'], function () {
    return build(buildConfig.devBuild);
});

gulp.task('prod-build', ['meta-prod'], function () {
    return build(buildConfig.prodBuild);
});

gulp.task('watch', function () {
    watch(buildConfig.srcDir, batch(function (events, done) {
        gulp.start('build', done);
    }));
});

// Code Quality Tasks
gulp.task('lint', function () {
    return gulp.src(['./src/**/*.js'])
        .pipe(jshint(buildConfig.jshint))
        .pipe(jshint.reporter(reporter))
        .pipe(jscs())
        .pipe(jscs.reporter());
});

gulp.task('compat', ['prod-build'], function () {
    return gulp.src(buildConfig.buildDir + buildConfig.buildName + '.js')
        .pipe(compat(gulp.dest, buildConfig.compatConfig));
});

// Test Tasks
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

// Runs the Web Server
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