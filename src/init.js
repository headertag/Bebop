'use strict';

// classes
var GPTHandler = require('./gpthandler'),
    Squib = require('./squib'),
// functions
    validate = require('./validation'),
    log = require('./log').log,
    type = require('./type'),
    util = require('./util');

function init(window) {
    var squibConfig, gptHandler, squib;

    window.googletag = window.googletag || { cmd: [] };

    if (!type.isObj(window.squibConfig)) {
        throw new Error('window.squibConfig is not an object');
    }

    squibConfig = validate.createSquibConfig(window.squibConfig);

    if (squibConfig.gpt.loadTag()) {
        GPTHandler.loadGoogletag(window);
    }

    gptHandler = new GPTHandler(window.googletag, squibConfig);
    squib = new Squib(gptHandler, squibConfig);

    if (type.isObj(window.squib)) {
        util.foreachProp(window.squib, function (key, value) {
            if (!type.isUndef(squib[key])) {
                throw new Error('Can not override public method: ' + key);
            }
        });
    }

    runQueue(window, squib);
}

function runQueue(window, squib) {
    var callback;
    util.enforceType(window.squibQueue, 'array');
    while (window.squibQueue.length > 0) {
        callback = window.squibQueue.shift();
        util.enforceType(callback, 'function');
        callback(squib);
    }

    window.squibQueue = {
        push: function (callback) {
            util.enforceType(callback, 'function');
            callback(squib);
        }
    };
}

module.exports = init;
