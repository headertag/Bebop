'use strict';

// classes
var GPTHandler = require('./gpthandler'),
    Bebop = require('./bebop'),
// functions
    validate = require('./validation'),
    log = require('./log').log,
    type = require('./type'),
    util = require('./util'),
// Module Level Variables
    asyncErrorMsg = 'BebopConfig has not yet been passed to Bebop, when loading both Bebop and ' +
                    'BebopConfig asynchronously window.bebopQueue.unshit(callback) must be used. ' +
                    'the callback must return the BebopConfig object';

function init(window) {


    if (type.isObj(window.bebopConfig)) {
        //? if (DEBUG)
        log.info('Loaded BebopConfig, proceeding to runQueue');

        runQueue(window, createBebop(window, window.bebopConfig));
        return;
    }

    //? if (DEBUG)
    log.warn('window.bebopConfig is not defined, checking fist callback in bebopQueue for BebopConfig');

    runQueue(window, null, true);
}

function createBebop(window, bebopConfig) {
    var bebopSettings = validate.createBebopSettings(bebopConfig),
        gptHandler;

    if (bebopSettings.gpt.loadTag()) {
        GPTHandler.loadGoogletag(window);
    }

    gptHandler = new GPTHandler(window.googletag, bebopSettings);
    return new Bebop(gptHandler, bebopSettings);
}

function runQueue(window, bebop, waitingOnConfig) {
    var callback;

    waitingOnConfig = type.isBool(waitingOnConfig) ?  waitingOnConfig : false;

    util.enforceType(window.bebopQueue, 'array');

    while (window.bebopQueue.length > 0) {

        callback = window.bebopQueue.shift();
        util.enforceType(callback, 'function');

        if (waitingOnConfig) {
            waitingOnConfig = false;
            bebop = createBebop(window, callback());
        }
        else {
            callback(bebop);
        }
    }

    window.bebopQueue = {

        push: function (callback) {
            if (waitingOnConfig) {
                throw new Error(asyncErrorMsg);
            }
            util.enforceType(callback, 'function');
            callback(bebop);
        },

        unshift: function (callback) {
            util.enforceType(callback, 'function');
            if (waitingOnConfig) {
                log.warn('config was loaded very late');
                waitingOnConfig = false;
                bebop = createBebop(window, callback());
            }
            else {
                window.bebopQueue.push(callback);
            }
        }
    };
}

module.exports = init;
