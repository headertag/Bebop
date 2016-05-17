'use strict';

var util = require('./util'),
    log = require('./log').log,
    type = require('./type');

function GPTHandler(googletag, config) {
    this.googletag = googletag;
    this.config = config;
}

GPTHandler.prototype.q = function (callback) {
    var self = this, tag;

    //? if (ASSERT_TYPE)
    util.enforceType(callback, 'function');

    if (this.config.headertag.enabled()) {
        tag = this.config.headertag.reference();
        // if (DEBUG) {
        if (type.isUndef(tag)) {
            log.warn('Headertag Reference is undefined, will call googletag instead');
        }
        // }
    }

    tag = tag || this.tag();

    this.tag().cmd.push(function () {
        try {
            callback(self, tag);
        }
        catch (error) {
            //? if (DEBUG) {
            if (error.stack) {
                log.error(error.stack);
            }
            //? }
            throw error;
        }
    });
};

GPTHandler.prototype.tag = function () {
    return this.googletag;
};

GPTHandler.prototype.display = function (divId) {
    this.q(function (self, tag) {
        if (self.config.gpt.disableInitalLoad()) {
            self.tag().display(divId);
        }
        else {
            tag.display(divId);
        }
    });
};

GPTHandler.prototype.refresh = function (opt_slots, opt_options) {
    if (!type.isNull(opt_slots)) {
        opt_slots = type.isArray(opt_slots) ? opt_slots : [opt_slots];
    }
    this.q(function (_, tag) {
        tag.pubads().refresh(opt_slots, opt_options);
    });
};

GPTHandler.prototype.defineSlot = function (adUnitPath, sizes, gptDivId, register) {
    this.q(function (self) {
        var gptSlot = self.tag().defineSlot(adUnitPath, sizes, gptDivId);
        self.registerSlot(gptSlot, register);
    });
};

GPTHandler.prototype.defineInterstitialSlot = function (adUnitPath, gptDivId, register) {
    this.q(function (self) {
        var gptSlot = self.tag().defineOutOfPageSlot(adUnitPath, gptDivId);
        self.registerSlot(gptSlot, register);
    });
};

GPTHandler.prototype.registerSlot = function (gptSlot, register) {
    if (type.isNull(gptSlot)) {
        throw new Error('Could not create slot: ' + gptSlot);
    }
    gptSlot.addService(this.tag().pubads());
    register(gptSlot);
};

GPTHandler.prototype.setSlotTargeting = function (gptSlot, key, value) {
    this.q(function () {
        gptSlot.setTargeting(key, value);
    });
};

GPTHandler.prototype.clearSlotTargeting = function (gptSlot) {
    this.q(function () {
        gptSlot.clearTargeting();
    });
};

GPTHandler.prototype.setTargets = function (key, value) {
    this.q(function (self) {
        self.tag().pubads().setTargeting(key, value);
    });
};

GPTHandler.loadGoogletag = function (window) {
    var gTag = window.document.createElement('script'),
        src = '//www.googletagservices.com/tag/js/gpt.js',
        node;
    gTag.async = true;
    gTag.type = 'text/javascript';
    gTag.src = window.document.location.protocol + src;
    node = window.document.getElementsByTagName("script")[0];
    node.parentNode.insertBefore(gTag, node);
};

module.exports = GPTHandler;
