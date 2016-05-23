'use strict';

//? include("./macros.ms");

/**
 * @module private/init
 *
 * @requires public/bebop
 * @requires private/gpthandler
 * @requires private/validation
 * @requires private/settings
 * @requires private/type
 */

var GPTHandler = require('./gpthandler'),
    Bebop = require('./bebop'),
    validation = require('./validation'),
    settings = require('./settings'),
    type = require('./type'),
// Module Level Variables
    asyncErrorMsg = 'BebopConfig has not yet been passed to Bebop, when loading both Bebop and ' +
                    'BebopConfig asynchronously window.bebopQueue.unshift(callback) must be used. ' +
                    'the callback must return the BebopConfig object';

function init(window) {

    if (type.isObj(window.bebopConfig)) {
        //? LOG("'Loaded BebopConfig, proceeding to runQueue'");
        runQueue(window, createBebop(window, window.bebopConfig));
        return;
    }

    //? LOG_WARN("'window.bebopConfig is not defined, checking fist callback in bebopQueue for BebopConfig'");

    runQueue(window, null, true);
}

function createBebop(window, bebopConfig) {
    var bebopSettings = settings.createBebopSettings(bebopConfig),
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

    validation.enforceType(window.bebopQueue, 'array');

    while (window.bebopQueue.length > 0) {

        callback = window.bebopQueue.shift();
        validation.enforceType(callback, 'function');

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
            validation.enforceType(callback, 'function');
            callback(bebop);
        },

        unshift: function (callback) {
            validation.enforceType(callback, 'function');
            if (waitingOnConfig) {
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
