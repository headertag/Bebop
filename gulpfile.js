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

// Code Quality Dependencies
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var lintReporter = require('jshint-stylish').reporter;

// Test Dependencies
var Jasmine = require('jasmine');

// Helpers
var buildDir = './final/';
var buildName = 'squib';
var entryPoint = './src/main.js';

var uglifyOptions = {
    warnings: true,
    mangle: true,
    output: {
        inline_script: true,
        comments: false,
        semicolons: true
    },
    compress: {
        sequences: true, // join consecutive statemets with the "comma operator"
        properties: true, // optimize property access: a["foo"]  a.foo
        dead_code: true, // discard unreachable code
        drop_debugger: true, // discard "debugger" statements
        unsafe: false, // some unsafe optimizations (see below)
        conditionals: true, // optimize if-s and conditional expressions
        comparisons: true, // optimize comparisons
        evaluate: true, // evaluate constant expressions
        booleans: true, // optimize boolean expressions
        loops: true, // optimize loops
        unused: true, // drop unused variables/functions
        hoist_funs: true, // hoist function declarations
        hoist_vars: false, // hoist variable declarations
        if_return: true, // optimize if-s followed by return/continue
        join_vars: true, // join var declarations
        cascade: true, // try to cascade `right` into `left` in sequences
        side_effects: true, // drop side-effect-free statements
        warnings: true // warn about potentially dangerous optimizations/code
    }
};

function build(options) {
    return gulp.src(entryPoint)
        .pipe(browserify(options.browserify))
        .pipe(metaScript(options.metaScript))
        .pipe(rename(buildName + '.js'))
        .pipe(gulp.dest(buildDir))
        .pipe(uglify(uglifyOptions))
        .pipe(rename(buildName + '.min.js'))
        .pipe(gulp.dest(buildDir));
}

// Tasks
gulp.task('clean', function () {
    var stream = del([buildDir]);
    return stream;
});

gulp.task('lint', function () {
    return gulp.src(['./src/**/*.js'])
        .pipe(jshint({
            node: true,
            curly: true,
            eqeqeq: true,
            freeze: true,
            futurehostile: true
        }))
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

gulp.task('build', ['clean'], function () {
    return build({
        browserify: {
            insetGlobals: true,
            debug: false
        },
        metaScript: {
            ASSERT_TYPE: true,
            DEBUG: true
        }
    });
});

gulp.task('prod-build', ['clean'], function () {
    return build({
        browserify: {
            insetGlobals: true,
            debug: false
        },
        metaScript: {
            ASSERT_TYPE: false,
            DEBUG: false
        }
    });
});

gulp.task('watch', function () {
    watch('./src/**/*.js', batch(function (events, done) {
        gulp.start('build', done);
    }));
});

gulp.task('default', ['build']);