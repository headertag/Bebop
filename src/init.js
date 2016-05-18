'use strict';

// classes
var GPTHandler = require('./gpthandler'),
    Bebop = require('./bebop'),
// functions
    validate = require('./validation'),
    log = require('./log').log,
    type = require('./type'),
    util = require('./util');

function init(window) {
    var bebopSettings, gptHandler, bebop;

    window.googletag = window.googletag || { cmd: [] };

    if (!type.isObj(window.bebopConfig)) {
        throw new Error('window.bebopConfig is not an object');
    }

    bebopSettings = validate.createBebopSettings(window.bebopConfig);

    if (bebopSettings.gpt.loadTag()) {
        GPTHandler.loadGoogletag(window);
    }

    gptHandler = new GPTHandler(window.googletag, bebopSettings);
    bebop = new Bebop(gptHandler, bebopSettings);

    runQueue(window, bebop);
}

function runQueue(window, bebop) {
    var callback;

    util.enforceType(window.bebopQueue, 'array');

    while (window.bebopQueue.length > 0) {
        callback = window.bebopQueue.shift();
        util.enforceType(callback, 'function');
        callback(bebop);
    }

    window.bebopQueue = {
        push: function (callback) {
            util.enforceType(callback, 'function');
            callback(bebop);
        }
    };
}

module.exports = init;
