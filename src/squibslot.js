'use strict';

var util = require('./util'),
    type = require('./type'),
    log = require('./log').log;

/**
 * A GPTSlot is any slot that has been created by calling
 * googletag.defineSlot or googletag.defineOutOfPageSlot
 *
 * @typedef {Object} GPTSlot
 */

/**
 * A key value pairs of targeting the is applyed to the underlining
 * GPTSLot
 *
 * @typedef {Object} TargetingMap
 */

/**
 * @class SquibSlot
 */
function SquibSlot(gptHandler, slotConfig, squibConfig) {

    var self = this;

    /**
     * @private
     */
    this.private = {};
    this.private.gpt = gptHandler;
    this.private.cfg = slotConfig;
    this.private.squibCfg = squibConfig;
    this.private.targetingMap = this.private.cfg.targeting();
    this.private.gptSlot = null;

    this.private.registerSlot = function () {
        return function (gptSlot) {
            self.private.gptSlot = gptSlot;
        };
    };

    this.private.defineSlot = function () {
        var adUnit = self.getAdUnitPath(),
            sizes = self.getSizes(),
            divId = self.getGPTDivId(),
            register = self.private.registerSlot();

        //? if (DEBUG)
        log('defining slot with id: ' + divId);

        self.private.gpt.defineSlot(adUnit, sizes, divId, register);
    };

    this.private.defineInterstitialSlot = function () {
        var adUnit = self.getAdUnitPath(),
            divId = self.getGPTDivId(),
            register = self.private.registerSlot();

        //? if (DEBUG)
        log('defining interstitial slot with id: ' + divId);

        self.private.gpt.defineInterstitialSlot(adUnit, divId, register);
    };

    if (this.isActive() && !this.defineOnDisplay()) {
        this.defineSlot();
    }

    //? if (DEBUG) {
    if (!this.isActive()) {
        log.warn(
            'No size configured for catagory: ' +
            this.private.squibCfg.viewPort.viewCatagory() +
            ' for slot with id: ' + this.getGPTDivId()
        );
    }
    //? }
}

/**
 * Defines the slot with googletag and applies targeting
 *
 * Works with interstitial and regular slots
 */
SquibSlot.prototype.defineSlot = function () {
    if (this.isDefined()) {
        // if (DEBUG) {
        log.warn('Slot with GPT Div Id: ' + this.getGPTDivId() + ' is already defined');
        return;
    }
    if (this.isInterstitial()) {
        this.private.defineInterstitialSlot();
    }
    else {
        this.private.defineSlot();
    }
    util.foreachProp(this.private.targetingMap, this.setTargeting, this);
};

/**
 * @return {boolean} true if the underlining googletag slot is defined, false otherwise
 */
SquibSlot.prototype.isDefined = function () {
    return type.isObj(this.private.gptSlot);
};

/**
 * @return {string} The ad unit path
 */
SquibSlot.prototype.getAdUnitPath = function () {
    return this.private.cfg.adUnitPath();
};

/**
 * Return
 *
 * @ return {Object}
 */
SquibSlot.prototype.getCatagories = function () {
    return this.private.cfg.sizeCatagories();
};

/**
 * Returns the ad sizes for the catagory the page is currently in
 *
 * Forexample if the page is in large mode, this method will
 * return the sizes for the large catagory.
 *
 * @return {Array.<Array.<number>>}
 */
SquibSlot.prototype.getSizes = function () {
    var catagory;
    if (this.isInterstitial()) {
        return [];
    }
    catagory = this.private.squibCfg.viewPort.viewCatagory();
    return this.private.cfg.viewPortSizes(catagory) || [];
};

/**
 * Returns the div id the slot is assosiated with
 *
 * @return {string}
 */
SquibSlot.prototype.getGPTDivId = function () {
    return this.private.cfg.gptDivId();
};

/**
 * @return {boolean} true if the slot is lazyloaded, false otherwise
 */
SquibSlot.prototype.isLazyLoad = function () {
    return this.private.cfg.lazyload();
};

/**
 * @return {boolean} true is the slot is an interstitial (Out Of Page), false otherwise
 */
SquibSlot.prototype.isInterstitial = function () {
    return this.private.cfg.interstitial();
};

/**
 * @return {boolean} true if the define call should be delayed untill the slot is to be displayed
 */
SquibSlot.prototype.defineOnDisplay = function () {
    return this.private.cfg.defineOnDisplay();
}

/**
 * A slot is active if the slot is configued for use in the current page mode
 *
 * @return {boolean}
 */
SquibSlot.prototype.isActive = function () {
    var catagory = this.private.squibCfg.viewPort.viewCatagory();
    return (
        (this.isInterstitial() && util.inArray(catagory, this.getCatagories())) ||
        (this.getSizes().length > 0)
    );
};

/**
 * @return {GPTSlot} The underlying googletag slot
 */
SquibSlot.prototype.getGPTSlot = function () {
    return this.private.gptSlot;
};

/**
 * Returns all targeting
 *
 * @return {TargetingMap}
 */
SquibSlot.prototype.getTargeting = function () {
    return this.private.targetingMap;
};

/**
 * Applies targeting to the underlying GPTSlot
 *
 * @param {string} key
 * @param {(string|Array.<(string|number)>)}
 *
 */
SquibSlot.prototype.setTargeting = function (key, value) {
    var self = this;
    util.enforceType(key, 'string');
    util.enforceType(value, ['string', 'number', 'array']);
    this.private.targetingMap[key] = value;
    this.private.gpt.q(function (gpt) {
        gpt.setSlotTargeting(self.getGPTSlot(), key, value);
    });
};

/**
 * If key is a string clearTargeting will remove the targeting
 * from the underlying GPTSlot. If key is not passed all targeting
 * from the GPTSlot will be cleared.
 *
 * @param {string?}
 */
SquibSlot.prototype.clearTargeting = function (key) {
    var that = this;
    util.enforceType(key, ['string', 'undefined']);
    if (type.isUndef(key)) {
        this.private.targetingMap = {};
        this.private.gpt.q(function (gpt) {
            gpt.clearSlotTargeting(that.private.gptSlot);
        });
    }
    else if (util.hasProp(this.private.targetingMap, key)) {
        delete this.private.targetingMap[key];
        this.private.gpt.q(function () {
            that.private.gptSlot.clearTargeting();
            util.foreachProp(that.private.targetingMap, that.setTargeting, that);
        });
    }
}

module.exports = SquibSlot;
