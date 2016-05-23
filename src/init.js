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
                    'BebopConfig asynchronously window.bebopQueue.unshift(bebopConfig) must be used. ';

function init(window) {
    var bebop;
    if (type.isObj(window.bebopConfig)) {
        //? LOG("'Loaded BebopConfig, proceeding to runQueue'");
        bebop = createBebop(window, window.bebopConfig);
        runQueue(window.bebopQueue, bebop);
        transformQueue(window, [], bebop, false);
        return;
    }

    //? LOG_WARN("'window.bebopConfig is not defined, checking fist element in bebopQueue for BebopConfig'");

    if (window.bebopQueue.length > 0 && type.isObj(window.bebopQueue[0])) {
        bebop = createBebop(window, window.bebopQueue.shift());
        runQueue(window.bebopQueue, bebop);
        transformQueue(window, [], bebop, false);
    }
    else {
        //? LOG_WARN("'window.bebopQueue is empty or BebopConfig is not the first element'");
        transformQueue(window, window.bebopQueue, null, true);
    }
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

function runQueue(queue, bebop) {
    var callback;
    while (queue.length > 0) {
        callback = queue.shift();
        validation.enforceType(callback, 'function');
        callback(bebop);
    }
}

function BebopQueue(window, queue, bebop, waitingOnConfig) {
    var self = this;

    this.push = function push(callback) {
        validation.enforceType(callback, 'function');
        if (waitingOnConfig) {
            //? LOG_WARN("'delaying execution as BebopConfig has not been passed to window.bebopQueue.unshift'");
            queue.push(callback);
        }
        else {
            callback(bebop);
        }
    };

    this.unshift = function unshift(bebopConfig) {
        if (!waitingOnConfig) {
            return;
        }
        validation.enforceType(bebopConfig, 'object');
        bebop = createBebop(window, bebopConfig);
        waitingOnConfig = false;
        //? LOG_INFO("'Received BebopConfig Executing All Callbacks in window.bebopQueue'");
        console.log(queue);
        runQueue(queue, bebop);
    };
}

function transformQueue(window, queue, bebop, waitingOnConfig) {
    window.bebopQueue = new BebopQueue(window, queue, bebop, waitingOnConfig);
}

module.exports = init;
