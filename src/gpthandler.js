'use strict';

//? include("./macros.ms");

/**
 * @module private/gpthandler
 *
 * @requires private/type
 */

var type = require('./type');

/**
 * The GPTHandler class is not part for the public Bebop API
 *
 * @class GPTHandler
 * @param {Googletag} googletag - A reference to the global googletag object.
 * @param {BebopSettings} settings - A BebopSettings object.
 */
function GPTHandler(googletag, settings) {
    //? ASSERT_TYPE('googletag', "'object'");
    //? ASSERT_TYPE('settings', "'object'");

    this.googletag = googletag;
    this.settings = settings;
}

/**
 * Acts as a wrapper around window.googletag.cmd
 *
 * @param {GPTCallback} callback - The callback to pass to the gpt cmd queue
 */
GPTHandler.prototype.q = function (callback) {
    //? ASSERT_TYPE('callback', "'function'");

    var self = this, tag;

    if (this.settings.headertag.enabled()) {
        tag = this.settings.headertag.reference();

        if (type.isUndef(tag) || tag.apiReady !== true) {
            tag = this.tag();
            //? LOG_WARN("'Headertag Reference is undefined or the API is not ready, will call googletag instead'");
        }
    }
    else {
        tag = this.tag();
    }

    this.tag().cmd.push(function () {
        callback(self, tag);
    });
};

/**
 * @return {Googletag} A reference to the global {@link Googletag} object
 */
GPTHandler.prototype.tag = function () {
    return this.googletag;
};

/**
 * A wrapper around googletag.display
 *
 * @param {GPTDivId} divId - ID of the div element containing the ad slot.
 */
GPTHandler.prototype.display = function (divId) {
    //? ASSERT_TYPE('divId', "'string'");

    this.q(function (self, tag) {
        // this is only here as headertag 1.2.x did not have support for
        // disableInitalLoad setups, TODO: test without this check
        if (self.settings.gpt.disableInitalLoad()) {
            self.tag().display(divId);
        }
        else {
            tag.display(divId);
        }
    });
};

/**
 * A wrapper around googletag.pubads().refresh()
 *
 * @param {Array.<string>?} opt_slots - The slots to refresh. Array is optional; all slots will be refreshed if it is unspecified.
 * @param {Object?} opt_options - Configuration options associated with this refresh call.
 */
GPTHandler.prototype.refresh = function (opt_slots, opt_options) {
    //? ASSERT_TYPE('opt_slots', "['array', 'null']");
    //? ASSERT_TYPE('opt_options', "['object', 'undefined']");

    if (!type.isNull(opt_slots)) {
        opt_slots = type.isArray(opt_slots) ? opt_slots : [opt_slots];
    }
    this.q(function (_, tag) {
        tag.pubads().refresh(opt_slots, opt_options);
    });
};

/**
 * A wrapper around googletag.display
 *
 * @param {AdUnitPath} adUnitPath
 * @param {(SingleSize|MultipleSize)} sizes - Width and height of the added slot
 * @param {GPTDivId} gptDivId - ID of the div that will contain this ad unit.
 * @param {function} register - The register function will be called passing it the newly created {@link GPTSlot}
 *
 * @throws If the {@link GPTSlot} could not be created.
 */
GPTHandler.prototype.defineSlot = function (adUnitPath, sizes, gptDivId, register) {
    //? ASSERT_TYPE('adUnitPath', "'string'");
    //? ASSERT_TYPE('sizes', "'array'");
    //? ASSERT_TYPE('gptDivId', "'string'");
    //? ASSERT_TYPE('register', "'function'");

    this.q(function (self) {
        var gptSlot = self.tag().defineSlot(adUnitPath, sizes, gptDivId);
        self.registerSlot(gptSlot, register);
    });
};

/**
 * A wrapper around googletag.defineOutOfPageSlot
 *
 * @param {AdUnitPath} adUnitPath
 * @param {GPTDivId} gptDivId - ID of the div that will contain this ad unit.
 * @param {function} register - The register function will be called passing it the newly created {@link GPTSlot}
 *
 * @throws If the {@link GPTSlot} could not be created.
 */
GPTHandler.prototype.defineInterstitialSlot = function (adUnitPath, gptDivId, register) {
    //? ASSERT_TYPE('adUnitPath', "'string'");
    //? ASSERT_TYPE('gptDivId', "'string'");
    //? ASSERT_TYPE('register', "'function'");

    this.q(function (self) {
        var gptSlot = self.tag().defineOutOfPageSlot(adUnitPath, gptDivId);
        self.registerSlot(gptSlot, register);
    });
};

/**
 * Registers the slot
 */
GPTHandler.prototype.registerSlot = function (gptSlot, register) {
    //? ASSERT_TYPE('gptSlot', "['object', 'null']");
    //? ASSERT_TYPE('register', "'function'");

    if (type.isNull(gptSlot)) {
        throw new Error('Could not create slot: ' + gptSlot);
    }
    gptSlot.addService(this.tag().pubads());
    register(gptSlot);
};

/**
 * Sets a custom targeting parameter for gptSlot.
 *
 * @param {GPTSlot} gptSlot - The slot to set targeting on
 * @param {string} key - Targeting parameter key.
 * @param {(string|Array.<string>)} - Targeting parameter value or list of values.
 */
GPTHandler.prototype.setSlotTargeting = function (gptSlot, key, value) {
    //? ASSERT_TYPE('gptSlot', "'object'");
    //? ASSERT_TYPE('key', "'string'");
    //? ASSERT_TYPE('value', "['string', 'array']");

    this.q(function () {
        gptSlot.setTargeting(key, value);
    });
};

/**
 * Clears all custom slot-level targeting parameters for this slot.
 *
 * @param {GPTSlot} gptSlot - The slot to clear targeting on.
 */
GPTHandler.prototype.clearSlotTargeting = function (gptSlot) {
    //? ASSERT_TYPE('gptSlot', "'object'");

    this.q(function () {
        gptSlot.clearTargeting();
    });
};

/**
 * Wrapper around googletag.pubads().setTargeting
 * @param {string} key - Targeting parameter key.
 * @param {(string|Array.<string>)} - Targeting parameter value or list of values.
 */
GPTHandler.prototype.setPageTargeting = function (key, value) {
    //? ASSERT_TYPE('key', "'string'");
    //? ASSERT_TYPE('value', "['string', 'array']");

    this.q(function (self) {
        self.tag().pubads().setTargeting(key, value);
    });
};

/**
 * Loads {@link Googletag}
 *
 * @static
 * @param {Object} window
 */
GPTHandler.loadGoogletag = function (window) {
    //? ASSERT_TYPE('window', "'object'");

    var gTag = window.document.createElement('script'),
        protocol = 'https:' === window.document.location.protocol ? 'https:' : 'http:',
        src = protocol + '//www.googletagservices.com/tag/js/gpt.js',
        node;
    gTag.async = true;
    gTag.type = 'text/javascript';
    gTag.src = src;
    node = window.document.getElementsByTagName("script")[0];
    node.parentNode.insertBefore(gTag, node);
};

module.exports = GPTHandler;
