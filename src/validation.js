'use strict';

/**
 * @module private/validation
 */

// Classes
var squibConfig = require('./squibconfig'),
    HeadertagConfig = squibConfig.HeadertagConfig,
    GPTConfig = squibConfig.GPTConfig,
    ViewPortConfig = squibConfig.ViewPortConfig,
    SquibConfig = squibConfig.SquibConfig,
// Modules
    type = require('./type'),
    util = require('./util'),
    log = require('./log').log;

function createSquibConfig(jsonSquibConfig) {
    var ht = jsonSquibConfig.headertag,
        gpt = jsonSquibConfig.gpt,
        vps = jsonSquibConfig.viewPortSizes,
        htCfgObj,
        gptCfgObj,
        vpCfgObj,
        squibConfig,
        errors;

    if (type.isObj(ht)) {
        htCfgObj = new HeadertagConfig(ht.enabled, ht.reference);
    }
    else {
        htCfgObj = new HeadertagConfig();
    }

    if (type.isObj(gpt)) {
        gptCfgObj = new GPTConfig(gpt.disableInitalLoad, gpt.loadTag);
    }
    else {
        gptCfgObj = new GPTConfig();
    }

    vpCfgObj = new ViewPortConfig(vps);

    squibConfig = new SquibConfig(htCfgObj, gptCfgObj, vpCfgObj);

    errors = squibConfig.errors();
    if (errors.length > 0) {
        util.foreach(errors, log.error);
        util.invalidStateError(errors);
    }
    return squibConfig;
}

function createSlotConfig(jsonSlotConfig) {
    // TODO
    /*
    AD-Unit-Path format : /[0-9]* /.*
    GPTDivId format : ""
    OPT:  targeting, format :  Object, {key:value,key:value,.....}  value format : string/stringable
    lazyload: Optional, defaults to false.  Boolean value
    viewPortSizes: Object  : Format {large:[[width,height],[width,height],[width,height]],medium:[],small[]} // needs AT LEAST one key

                         OR IFF interstitial==true, format is ['key1','key2','key3'.....] from above objects key types (such as large,small etc.

    Validates configuration matches above described format, and if not, throws an exception.
    */

    var viewPortSizes = ['huge', 'large', 'medium', 'small', 'tiny'],
        isValidViewPortSizes = false,
        errors = [],
        warnings = [];

    if (!type.isObj(jsonSlotConfig)) {
        errors.push('Slot Configuration is undefined or invalid');
    }

    if (!type.isStr(jsonSlotConfig.adUnitPath) || !util.isValidAdUnitPath(jsonSlotConfig.adUnitPath)) {
        errors.push('Ad Unit Path is not defined or is invalid');
    }

    if (!type.isStr(jsonSlotConfig.gptDivId) || jsonSlotConfig.gptDivId === '') {
        errors.push('GPT Div Id is not defined or is invalid');
    }

    if (type.isObj(jsonSlotConfig.targeting)) {
        util.foreachProp(jsonSlotConfig.targeting, function (key, value) {
            util.validateTargetingKey(key, errors);
            util.validateTargetingValue(value, errors);
        });
    }
    else {
        warnings.push('No targeting parameters were passed with the slot definition object');
    }

    if (!type.isBool(jsonSlotConfig.lazyload)) {
        jsonSlotConfig.lazyload = false;
    }
    else {
        warnings.push('No lazyload parameter was passed, using default false');
    }

    if (!type.isBool(jsonSlotConfig.interstitial)) {
        jsonSlotConfig.interstitial = false;
    }
    else {
        warnings.push('No interstitial parameter was passed, using default false');
    }

    if (!type.isBool(jsonSlotConfig.defineOnDisplay)) {
        jsonSlotConfig.defineOnDisplay = false;
    }
    else {
        warnings.push('No defineOnDisplay parameter was passed, using default false');
    }

    if (!type.isUndef(jsonSlotConfig.viewPortSizes)) {

        if (jsonSlotConfig.interstitial) {
            if (!type.isArray(jsonSlotConfig.viewPortSizes)) {
                errors.push('viewPortSizes must be an array of catagories for interstitial slots');
            }
            else {
                isValidViewPortSizes = false;
                util.foreach(viewPortSizes, function (catagory) {
                    if (util.inArray(catagory, jsonSlotConfig.viewPortSizes)) {
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

        if (!jsonSlotConfig.interstitial) {
            if (!type.isObj(jsonSlotConfig.viewPortSizes)) {
                errors.push('viewPortSizes must be an object mapping size catagories to slot dimensions');
            }
            else {
                isValidViewPortSizes = false;
                util.foreachProp(jsonSlotConfig.viewPortSizes, function (catagory, sizes) {
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

    if (errors.length > 0) {
        util.foreach(errors, log.error);
    }

    //? if (DEBUG)
    util.foreach(warnings, log.warn);




    return {
        adUnitPath: function () {
            return jsonSlotConfig.adUnitPath;
        },
        viewPortSizes: function (catagory) {
            return jsonSlotConfig.viewPortSizes[catagory] || [];
        },
        sizeCatagories: function () {
            return jsonSlotConfig.viewPortSizes;
        },
        gptDivId: function () {
            return jsonSlotConfig.gptDivId;
        },
        lazyload: function () {
            return jsonSlotConfig.lazyload;
        },
        interstitial: function () {
            return jsonSlotConfig.interstitial;
        },
        defineOnDisplay: function () {
            return jsonSlotConfig.defineOnDisplay;
        },
        targeting: function () {
            return jsonSlotConfig.targeting;
        }
    };
}

module.exports = {
    createSquibConfig: createSquibConfig,
    createSlotConfig: createSlotConfig
};
