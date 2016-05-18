'use strict';

/**
 * @module private/validation
 */

// Classes
var settings = require('./settings'),
    HeadertagSettings = settings.HeadertagSettings,
    GPTSettings = settings.GPTSettings,
    ViewPortSettings = settings.ViewPortSettings,
    BebopSettings = settings.BebopSettings,
// Modules
    type = require('./type'),
    util = require('./util'),
    log = require('./log').log;

/**
 * @param {BebopConfig} bebopConfig
 * @return {BebopSettings}
 * @throws If the {@link BebopConfig} object is not valid.
 */
function createBebopSettings(bebopConfig) {
    var ht = bebopConfig.headertag,
        gpt = bebopConfig.gpt,
        vps = bebopConfig.viewPortSizes,
        htCfgObj,
        gptCfgObj,
        vpCfgObj,
        bebopSettings,
        errors;

    if (type.isObj(ht)) {
        htCfgObj = new HeadertagSettings(ht.enabled, ht.reference);
    }
    else {
        htCfgObj = new HeadertagSettings();
    }

    if (type.isObj(gpt)) {
        gptCfgObj = new GPTSettings(gpt.disableInitalLoad, gpt.loadTag);
    }
    else {
        gptCfgObj = new GPTSettings();
    }

    vpCfgObj = new ViewPortSettings(vps);

    bebopSettings = new BebopSettings(htCfgObj, gptCfgObj, vpCfgObj);

    errors = bebopSettings.errors();
    if (errors.length > 0) {
        util.foreach(errors, log.error);
        util.invalidStateError(errors);
    }

    return bebopSettings;
}

/**
 * @param {SlotConfig} slotConfig - The JSON slot configuration object
 * @return {SlotSettings}
 * @throws If the {@link SlotConfig} object is not valid.
 */
function createSlotSettings(slotConfig) {

    var viewPortSizes = ['huge', 'large', 'medium', 'small', 'tiny'],
        isValidViewPortSizes = false,
        errors = [],
        warnings = [];

    if (!type.isObj(slotConfig)) {
        errors.push('Slot Configuration is undefined or invalid');
    }

    if (!type.isStr(slotConfig.adUnitPath) || !util.isValidAdUnitPath(slotConfig.adUnitPath)) {
        errors.push('Ad Unit Path is not defined or is invalid');
    }

    if (!type.isStr(slotConfig.gptDivId) || slotConfig.gptDivId === '') {
        errors.push('GPT Div Id is not defined or is invalid');
    }

    if (type.isObj(slotConfig.targeting)) {
        util.foreachProp(slotConfig.targeting, function (key, value) {
            util.validateTargetingKey(key, errors);
            util.validateTargetingValue(value, errors);
        });
    }
    else {
        warnings.push('No targeting parameters were passed with the slot definition object');
    }

    if (!type.isBool(slotConfig.lazyload)) {
        slotConfig.lazyload = false;
    }
    else {
        warnings.push('No lazyload parameter was passed, using default false');
    }

    if (!type.isBool(slotConfig.interstitial)) {
        slotConfig.interstitial = false;
    }
    else {
        warnings.push('No interstitial parameter was passed, using default false');
    }

    if (!type.isBool(slotConfig.defineOnDisplay)) {
        slotConfig.defineOnDisplay = false;
    }
    else {
        warnings.push('No defineOnDisplay parameter was passed, using default false');
    }

    if (!type.isUndef(slotConfig.viewPortSizes)) {

        if (slotConfig.interstitial) {
            if (!type.isArray(slotConfig.viewPortSizes)) {
                errors.push('viewPortSizes must be an array of catagories for interstitial slots');
            }
            else {
                isValidViewPortSizes = false;
                util.foreach(viewPortSizes, function (catagory) {
                    if (util.inArray(catagory, slotConfig.viewPortSizes)) {
                        isValidViewPortSizes = true;
                    }
                    else {
                        warnings.push('Slot is not configured for size catagory ' + catagory);
                    }
                });

                if (!isValidViewPortSizes) {
                    errors.push('At lease one size catagory is require in viewPortSizes');
                }
            }
        }

        if (!slotConfig.interstitial) {
            if (!type.isObj(slotConfig.viewPortSizes)) {
                errors.push('viewPortSizes must be an object mapping size catagories to slot dimensions');
            }
            else {
                isValidViewPortSizes = false;
                util.foreachProp(slotConfig.viewPortSizes, function (catagory, sizes) {
                    if (util.inArray(catagory, viewPortSizes)) {
                        isValidViewPortSizes = true;
                    }
                    else {
                        warnings.push('Slot viewPortSizes contains unkown size catagory ' + catagory);
                    }
                });

                if (!isValidViewPortSizes) {
                    errors.push('At lease one size catagory is require in viewPortSizes');
                }
            }
        }
    }
    else {
        errors.push('viewPort configuration is not defined.');
    }

    //? if (DEBUG)
    util.foreach(warnings, log.warn);

    if (errors.length > 0) {
        util.foreach(errors, log.error);
        util.invalidStateError(errors);
    }

    return {
        adUnitPath: function () {
            return slotConfig.adUnitPath;
        },
        viewPortSizes: function (catagory) {
            return slotConfig.viewPortSizes[catagory] || [];
        },
        sizeCatagories: function () {
            return slotConfig.viewPortSizes;
        },
        gptDivId: function () {
            return slotConfig.gptDivId;
        },
        lazyload: function () {
            return slotConfig.lazyload;
        },
        interstitial: function () {
            return slotConfig.interstitial;
        },
        defineOnDisplay: function () {
            return slotConfig.defineOnDisplay;
        },
        targeting: function () {
            return slotConfig.targeting;
        }
    };
}

module.exports = {
    createBebopSettings: createBebopSettings,
    createSlotSettings: createSlotSettings
};
