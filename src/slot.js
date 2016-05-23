'use strict';

//? include("./macros.ms");

/**
 * @module public/slot
 *
 * @requires private/util
 * @requires private/log
 * @requires private/validation
 */

var util = require('./util'),
    type = require('./type'),
    validation = require('./validation');

/**
 * This Constructor is not part of the public Bebop API.
 * To create a new Slot Object see {@link Bebop#defineSlot} or {@link Bebop#defineSlots}
 *
 * @class Slot
 *
 * @param {GPTHandler} gptHandler
 * @param {Object} slotConfig
 * @param {ViewPortConfig} viewPortCfg
 */
function Slot(gptHandler, slotConfig, viewPortCfg) {
    var self = this;

    validation.enforceType(gptHandler, 'object');
    validation.enforceType(slotConfig, 'object');
    validation.enforceType(viewPortCfg, 'object');

    /**
     * @property {Object} private
     *
     * The private object is private and can change at any time.
     * It should not be referenced outside of the class definition.
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
            util.foreachProp(self.private.targetingMap, self.setTargeting, self);
        };
    };

    this.private.defineSlot = function () {
        var adUnit = self.getAdUnitPath(),
            sizes = self.getSizes(),
            divId = self.getGPTDivId(),
            register = self.private.registerSlot();

        //? LOG("'defining slot with id: ' + divId");

        self.private.gpt.defineSlot(adUnit, sizes, divId, register);
    };

    this.private.defineInterstitialSlot = function () {
        var adUnit = self.getAdUnitPath(),
            divId = self.getGPTDivId(),
            register = self.private.registerSlot();

        //? LOG("'defining interstitial slot with id: ' + divId");

        self.private.gpt.defineInterstitialSlot(adUnit, divId, register);
    };

    if (this.isActive() && !this.defineOnDisplay()) {
        this.defineSlot();
    }

    //? LOG_WARN("'No size configured for category: ' + this.private.viewPortCfg.viewCategory() + ' for slot with id: ' + this.getGPTDivId()", "!this.isActive()");
}

/**
 * Creates the underlying {@link GPTSlot}. This method can be used to create both interstitial and regular slots.
 * Upon creation of the slot [targeting]{@link Slot#getTargeting} will be applied to the slot.
 */
Slot.prototype.defineSlot = function () {
    if (this.isDefined()) {
        //? LOG_WARN("'Slot with GPT Div Id: ' + this.getGPTDivId() + ' is already defined'");
        return;
    }

    if (this.isInterstitial()) {
        this.private.defineInterstitialSlot();
    }
    else {
        this.private.defineSlot();
    }
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
 * @return {SizeCategoryMap} All categories and sizes.
 */
Slot.prototype.getCatagories = function () {
    return this.private.cfg.sizeCatagories();
};

/**
 * Returns the ad sizes for the category the page is currently in
 *
 * For example if the page is in large mode, this method will
 * return the sizes for the large category.
 *
 * @return {Array.<Array.<number>>}
 */
Slot.prototype.getSizes = function () {
    var category;
    if (this.isInterstitial()) {
        return [];
    }
    category = this.private.viewPortCfg.viewCategory();
    return this.private.cfg.viewPortSizes(category) || [];
};

/**
 * @return {GPTDivId} Returns the div id the slot is associated with.
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
 * A slot is active if the slot is configured for use in the current page mode.
 *
 * @return {boolean} True if the slot is active, false otherwise.
 */
Slot.prototype.isActive = function () {
    var category = this.private.viewPortCfg.viewCategory();
    return (
        (this.isInterstitial() && util.inArray(category, this.getCatagories())) ||
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
    var self = this, errors = [];

    validation.isValidTargetingKey(key, errors);
    validation.isValidTargetingValue(value, errors);

    if (errors.length > 0) {
        throw new Error(errors.join("\n"));
    }

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

    validation.enforceType(key, ['string', 'undefined']);

    if (type.isUndef(key)) {
        this.private.targetingMap = {};
    }
    else if (util.hasProp(this.private.targetingMap, key)) {
        delete this.private.targetingMap[key];
    }
    else {
        //? LOG_WARN("'Slot wight GPT Div Id' + this.getGPTDivId() + ' does not have a targeting key = ' + key");
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
