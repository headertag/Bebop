'use strict';

/**
 * @module public/slot
 */

var util = require('./util'),
    type = require('./type'),
    log = require('./log').log;

/**
 * This Constructor is not part of the public Bebop API.
 * To create a new Slot Object see {@link Bebop#defineSlot} or {@link Bebop#defineSlots}
 * The Slot#private object is private and can change at any time.
 *
 * @class Slot
 *
 * @param {GPTHandler} gptHandler
 * @param {Object} slotConfig
 * @param {ViewPortConfig} viewPortCfg
 */
function Slot(gptHandler, slotConfig, viewPortCfg) {

    var self = this;

    /**
     * @private
     */
    this.private = {};
    this.private.gpt = gptHandler;
    this.private.cfg = slotConfig;
    this.private.viewPortCfg = viewPortCfg;
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
            this.private.viewPortCfg.viewCatagory() +
            ' for slot with id: ' + this.getGPTDivId()
        );
    }
    //? }
}

/**
 * Creates the underlying {@link GPTSlot}. This method can be used to create both interstitial and regular slots.
 * Upon creation of the slot [targeting]{@link Slot#getTargeting} will be applied to the slot.
 */
Slot.prototype.defineSlot = function () {
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
 * @return {boolean} true if the underlining {@link GPTSlot} is defined, false otherwise.
 */
Slot.prototype.isDefined = function () {
    return type.isObj(this.private.gptSlot);
};

/**
 * @return {AdUnitPath} - The ad unit path
 */
Slot.prototype.getAdUnitPath = function () {
    return this.private.cfg.adUnitPath();
};

/**
 * @return {SizeCatagoryMap} All catagories and sizes.
 */
Slot.prototype.getCatagories = function () {
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
Slot.prototype.getSizes = function () {
    var catagory;
    if (this.isInterstitial()) {
        return [];
    }
    catagory = this.private.viewPortCfg.viewCatagory();
    return this.private.cfg.viewPortSizes(catagory) || [];
};

/**
 * @return {GPTDivId} Returns the div id the slot is assosiated with.
 */
Slot.prototype.getGPTDivId = function () {
    return this.private.cfg.gptDivId();
};

/**
 * @return {boolean} true if the slot is lazyloaded, false otherwise.
 */
Slot.prototype.isLazyLoad = function () {
    return this.private.cfg.lazyload();
};

/**
 * @return {boolean} true is the slot is an interstitial (Out Of Page) slot, false otherwise.
 */
Slot.prototype.isInterstitial = function () {
    return this.private.cfg.interstitial();
};

/**
 * @return {boolean} true if the define call should be delayed until the slot is to be displayed.
 */
Slot.prototype.defineOnDisplay = function () {
    return this.private.cfg.defineOnDisplay();
};

/**
 * A slot is active if the slot is configued for use in the current page mode.
 *
 * @return {boolean} True if the slot is active, false otherwise.
 */
Slot.prototype.isActive = function () {
    var catagory = this.private.viewPortCfg.viewCatagory();
    return (
        (this.isInterstitial() && util.inArray(catagory, this.getCatagories())) ||
        (this.getSizes().length > 0)
    );
};

/**
 * @return {GPTSlot} The underlying googletag slot.
 */
Slot.prototype.getGPTSlot = function () {
    return this.private.gptSlot;
};

/**
 * Returns all targeting that is applied to the underlying {@link GPTSlot}
 * if the slot is defined. If the slot has not yet been defined returns all
 * targeting that will be applied to the slot.
 *
 * @return {TargetingMap}
 */
Slot.prototype.getTargeting = function () {
    if (this.isDefined()) {
        return this.private.gptSlot.getTargetingMap();
    }
    return this.private.targetingMap;
};

/**
 * Applies targeting to the underlying {@link GPTSlot}. If the slot is not yet defined
 * the targeting will be applied to the slot when it is defined.
 *
 * @param {string} key Targeting parameter key.
 * @param {(string|Array.<(string|number)>)} value Targeting parameter value or list of values.
 *
 */
Slot.prototype.setTargeting = function (key, value) {
    var self = this;
    util.enforceType(key, 'string');
    util.enforceType(value, ['string', 'number', 'array']);
    this.private.targetingMap[key] = value;
    if (this.isDefined()) {
        this.private.gpt.q(function (gpt) {
            gpt.setSlotTargeting(self.getGPTSlot(), key, value);
        });
    }
};

/**
 * If key is a string clearTargeting will remove the targeting
 * from the underlying {@link GPTSlot}. If key is not passed all targeting
 * from the GPTSlot will be cleared.
 *
 * If the {@link GPTSlot} is not yet defined the targeting will not be applied to
 * the slot.
 *
 * @param {string?} key - The targeting to be removed from the slot.
 */
Slot.prototype.clearTargeting = function (key) {
    var that = this;

    util.enforceType(key, ['string', 'undefined']);

    if (type.isUndef(key)) {
        this.private.targetingMap = {};
    }
    else if (util.hasProp(this.private.targetingMap, key)) {
        delete this.private.targetingMap[key];
    }
    else {
        //if? (DEBUG)
        log.warn('Slot wight GPT Div Id' + this.getGPTDivId() + ' does not have a targeting key = ' + key);

        return;
    }

    if (this.isDefined()) {
        this.private.gpt.q(function (gpt) {
            gpt.clearSlotTargeting(that.private.gptSlot);
            util.foreachProp(that.private.targetingMap, that.setTargeting, that);
        });
    }
};

module.exports = Slot;
