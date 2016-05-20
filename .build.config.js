'use strict';

module.exports.uglifyOptions = {
    warnings:           true,
    mangle:             true,
    output: {
        inline_script:  true,
        comments:       false,
        semicolons:     true
    },
    compress: {
        sequences:      true,   // join consecutive statemets with the "comma operator"
        properties:     true,   // optimize property access: a["foo"]  a.foo
        dead_code:      true,   // discard unreachable code
        drop_debugger:  true,   // discard "debugger" statements
        unsafe:         false,  // some unsafe optimizations (see below)
        conditionals:   true,   // optimize if-s and conditional expressions
        comparisons:    true,   // optimize comparisons
        evaluate:       true,   // evaluate constant expressions
        booleans:       true,   // optimize boolean expressions
        loops:          true,   // optimize loops
        unused:         true,   // drop unused variables/functions
        hoist_funs:     true,   // hoist function declarations
        hoist_vars:     false,  // hoist variable declarations
        if_return:      true,   // optimize if-s followed by return/continue
        join_vars:      true,   // join var declarations
        cascade:        true,   // try to cascade `right` into `left` in sequences
        side_effects:   true,   // drop side-effect-free statements
        warnings:       true    // warn about potentially dangerous optimizations/code
    }
};

module.exports.compatConfig = {
    'ignore_unlisted':  true,
    'ios_saf': {
        fail:           '4.15',
        report:         '4.15'
    }
};

module.exports.jshint = {
    node:               true,
    curly:              true,
    eqeqeq:             true,
    freeze:             true,
    futurehostile:      true
};

module.exports.devBuild = {
    browserify: {
        insetGlobals:   true,
        debug:          false
    },
    metaScript: {
        ASSERT_TYPE:    true,
        DEBUG:          true
    }
};

module.exports.prodBuild = {
    browserify: {
        insetGlobals:   true,
        debug:          false
    },
    metaScript: {
        ASSERT_TYPE:    false,
        DEBUG:          false
    }
};

module.exports.buildDir = './final/';

module.exports.buildName = 'bebop';

module.exports.entryPoint = './src/main.js';

module.exports.srcDir = './src/**/*.js';