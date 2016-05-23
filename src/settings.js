'use strict';

//? include("./macros.ms");

/**
 * @module private/settings
 *
 * @requires public/errors
 * @requires private/type
 * @requires private/util
 * @requires private/validation
 */

var type = require('./type'),
    util = require('./util'),
    validation = require('./validation'),
    errors = require('./errors');

function invalidStateError(errors) {
    //? ASSERT_TYPE('errors', "['array', 'string']");

    var msg;

    if (type.isArray(errors)) {
        msg = errors.join('\n');
    }
    else {
        msg = errors;
    }

    throw new errors.InvalidStateError(msg);
}

function errorCheck(errors) {
    if (errors.length > 0) {
        invalidStateError(errors);
    }
}

/**
 * HeadertagSettings is not part of the public Bebop API.
 *
 * @class
 *
 * @param {boolean} [enabled=false] - True if headertag is enabled, false otherwise.
 * @param {Object?} reference - A reference to the global headertag object.
 */
function HeadertagSettings(enabled, reference) {
    var errors = [], msg = '';

    switch (type.getType(enabled)) {
        case 'undefined':
            enabled = false;
            break;
        case 'boolean': break;
        default:
            msg = 'headertag.enabled Option: type: boolean, default false';
            errors.push(msg);
    }

    switch (type.getType(reference)) {
        case 'function': break;
        case 'undefined':
            reference = function () {
                errorCheck(errors);
            };
            /* falls through */
        default:
            if (enabled) {
                msg = 'headertag.reference Option: type: function, default none';
                errors.push(msg);
            }
    }

    /**
     * @return {Array.<string>} An array of errors or a 0 length array when no errors have occurred.
     */
    this.errors = function () {
        return errors;
    };

    /**
     * @return {boolean} True if headertag is enabled, false otherwise.
     * @throws If the {@link HeadertagConfig} object is invalid.
     */
    this.enabled = function () {
        errorCheck(errors);
        return enabled;
    };

    /**
     * @return {Headertag} A reference to the global headertag object.
     * @throws If the {@link HeadertagConfig} object is invalid.
     */
    this.reference = function () {
        errorCheck(errors);
        return reference();
    };
}

/**
 * GPTSettings is not part of the public Bebop API.
 *
 * @class
 * @param {boolean} [disableInitalLoad=false] - True if the page's GPT Setup disables the initial load.
 * @param {boolean} [loadTag=false] - True if Bebop is to load {@link Googletag}.
 */
function GPTSettings(disableInitalLoad, loadTag) {
    var errors = [], msg = '';

    switch (type.getType(disableInitalLoad)) {
        case 'undefined':
            disableInitalLoad = false;
            break;
        case 'boolean': break;
        default:
            msg = 'gpt.disableInitalLoad Option: type: boolean, default: false';
            errors.push(msg);
    }

    switch (type.getType(loadTag)) {
        case 'undefined':
            loadTag = false;
            break;
        case 'boolean': break;
        default:
            msg = 'gpt.loadTag Option: type: boolean, default: true';
            errors.push(msg);
    }

    /**
     * @return {Array.<string>} An array of errors or a 0 length array when no errors have occurred.
     */
    this.errors = function () {
        return errors;
    };

    /**
     * @return {boolean} True if the page's GPT Setup disables the initial load.
     * @throws If the {@link GPTConfig} object is invalid
     */
    this.disableInitalLoad = function () {
        errorCheck(errors);
        return disableInitalLoad;
    };

    /**
     * @return {boolean} True if Bebop is to load {@link Googletag}.
     * @throws If the {@link GPTConfig} object is invalid
     */
    this.loadTag = function () {
        errorCheck(errors);
        return loadTag;
    };
}

/**
 * ViewPortSettings is not part of the public Bebop API.
 *
 * @class
 * @param {ViewPortConfig} vpsConfig
 */
function ViewPortSettings(vpsConfig) {
    var viewCatagories = {'huge': 0, 'large': 0, 'medium': 0, 'small': 0, 'tiny': 0},
        getViewPortWidth,
        errors = [],
        msg = '';

    if (!type.isObj(vpsConfig)) {
        msg = 'viewPortSizes is required configuration';
        errors.push(msg);
        vpsConfig = {};
    }

    getViewPortWidth = vpsConfig.getViewPortWidth;

    if (!type.isFunc(getViewPortWidth)) {
        msg = 'viewPortSizes.getViewPortWidth Option: type: function, required: true';
        errors.push(msg);
    }

    if (typeof viewCatagories !== 'undefined') {

        util.foreachProp(viewCatagories, function (size) {
            if (type.isInt(vpsConfig[size])) {
                viewCatagories[size] = vpsConfig[size];
            }
            else {
                delete viewCatagories[size];
            }
        });
    } else {
        msg = 'viewCatagories undefined';
        errors.push(msg);
    }

    if (util.isEmptyObject(viewCatagories)) {
        msg = 'At lease one size option is required';
        errors.push(msg);
    }

    /**
     * @return {Array.<string>} An array of errors or a 0 length array when no errors have occurred.
     */
    this.errors = function () {
        return errors;
    };

    /**
     * Finds the active size category.
     *
     * @return {string} The active size category.
     * @throws If the {@link ViewPortConfig} object is invalid.
     */
    this.viewCategory = function () {
        var width, sizeCategory;

        errorCheck(errors);

        width = this.viewPortSize();
        sizeCategory = util.foreachProp(viewCatagories, function (category, size) {
            if (width >= size) {
                return category;
            }
        });

        if (type.isUndef(sizeCategory)) {
            return null;
        }
        return sizeCategory;
    };

    /**
     * @return {ViewPortConfig}
     * @throws If the {@link ViewPortConfig} object is invalid
     */
    this.viewCatagories = function () {
        errorCheck(errors);
        return viewCatagories;
    };

    /**
     * @return {number} The view
     * @throws If the {@link ViewPortConfig} object is invalid
     */
    this.viewPortSize = function () {
        errorCheck(errors);
        return getViewPortWidth();
    };
}

/**
 * BebopSettings is not part of the public Bebop API.
 *
 * @class
 * @param {HeadertagSettings} headertagSettings
 * @param {GPTSettings} gptSettings
 * @param {ViewPortSettings} viewPortSettings
 */
function BebopSettings(headertagSettings, gptSettings, viewPortSettings) {
    //? ASSERT_TYPE('headertagSettings', "'object'");
    //? ASSERT_TYPE('gptSettings', "'object'");
    //? ASSERT_TYPE('viewPortSettings', "'object'");

    var errors = [];

    /** @param */
    this.headertag = headertagSettings;
    /** @param */
    this.gpt = gptSettings;
    /** @param */
    this.viewPort = viewPortSettings;

    errors = errors.concat(
        this.headertag.errors(),
        this.gpt.errors(),
        this.viewPort.errors()
    );

    /**
     * Reports on all errors from headertagSettings, gptSettings and viewPortSettings.
     *
     * @return {Array.<string>} An array of errors or a 0 length array when no errors have occurred.
     */
    this.errors = function () {
        return errors;
    };
}

/**
 * SlotSettings is not part of the public Bebop API
 *
 * @class
 *
 * @param {SlotConfig} slotConfig
 */
function SlotSettings(slotConfig) {

    var viewPortSizes = ['huge', 'large', 'medium', 'small', 'tiny'],
        isValidViewPortSizes = false,
        errors = [],
        warnings = [];

    if (!type.isObj(slotConfig)) {
        errors.push('Slot Configuration is undefined or invalid');
    }

    if (!validation.isValidAdUnitPath(slotConfig.adUnitPath)) {
        errors.push('Ad Unit Path is not defined or is invalid');
    }

    if (!type.isStr(slotConfig.gptDivId) || slotConfig.gptDivId === '') {
        errors.push('GPT Div Id is not defined or is invalid');
    }

    if (type.isObj(slotConfig.targeting)) {
        util.foreachProp(slotConfig.targeting, function (key, value) {
            validation.isValidTargetingKey(key, errors);
            validation.isValidTargetingValue(value, errors);
        });
    }
    else {
        warnings.push('No targeting parameters were passed with the SlotConfig object');
    }

    if (!type.isBool(slotConfig.lazyload)) {
        slotConfig.lazyload = false;
        warnings.push('No lazyload parameter was passed, using default false');
    }

    if (!type.isBool(slotConfig.interstitial)) {
        slotConfig.interstitial = false;
        warnings.push('No interstitial parameter was passed, using default false');
    }

    if (!type.isBool(slotConfig.defineOnDisplay)) {
        slotConfig.defineOnDisplay = false;
        warnings.push('No defineOnDisplay parameter was passed, using default false');
    }

    if (!type.isUndef(slotConfig.viewPortSizes)) {

        if (slotConfig.interstitial) {
            if (!type.isArray(slotConfig.viewPortSizes)) {
                errors.push('viewPortSizes must be an array of categories for interstitial slots');
            }
            else {
                isValidViewPortSizes = false;
                util.foreach(viewPortSizes, function (category) {
                    if (util.inArray(category, slotConfig.viewPortSizes)) {
                        isValidViewPortSizes = true;
                    }
                    else {
                        warnings.push('Slot is not configured for size category ' + category);
                    }
                });

                if (!isValidViewPortSizes) {
                    errors.push('At lease one size category is require in viewPortSizes');
                }
            }
        }

        if (!slotConfig.interstitial) {
            if (!type.isObj(slotConfig.viewPortSizes)) {
                errors.push('viewPortSizes must be an object mapping size categories to slot dimensions');
            }
            else {
                isValidViewPortSizes = false;
                util.foreachProp(slotConfig.viewPortSizes, function (category, sizes) {

                    if (util.inArray(category, viewPortSizes)) {
                        isValidViewPortSizes = true;
                    }
                    else {
                        warnings.push('Slot viewPortSizes contains unknown size category ' + category);
                    }

                    if (!validation.isMultiSizeArray(sizes) && !validation.isSingleSizeArray(sizes)) {
                        errors.push('Slot sizes is not a SingleSize or MultiSize array');
                    }
                });

                if (!isValidViewPortSizes) {
                    errors.push('At lease one size category is require in viewPortSizes');
                }
            }
        }
    }
    else {
        errors.push('viewPort configuration is not defined.');
    }

    /**
     * @return {Array.<string>} An array of errors or a 0 length array when no errors have occurred.
     */
    this.errors = function () {
        return errors;
    };

    /**
     * @return {Array.<string>} An array of warnings or a 0 length array when no warnings have occurred.
     */
    this.warnings = function () {
        return warnings;
    };

    /**
     * @return {AdUnitPath}
     * @throws If the {@link SlotConfig} object is invalid.
     */
    this.adUnitPath = function adUnitPath() {
        errorCheck(errors);
        return slotConfig.adUnitPath;
    };

    /**
     * @return {(SingleSize|MultiSize)} The slot sizes from `category` {@link SizeCategoryMap}
     * @throws If the {@link SlotConfig} object is invalid.
     */
    this.viewPortSizes = function viewPortSizes(category) {
        errorCheck(errors);
        return slotConfig.viewPortSizes[category] || [];
    };

    /**
     * @return {SizeCategoryMap}
     * @throws If the {@link SlotConfig} object is invalid.
     */
    this.sizeCatagories = function sizeCatagories() {
        errorCheck(errors);
        return slotConfig.viewPortSizes;
    };

    /**
     * @return {GPTDivId}
     * @throws If the {@link SlotConfig} object is invalid.
     */
    this.gptDivId = function gptDivId() {
        errorCheck(errors);
        return slotConfig.gptDivId;
    };

    /**
     * @return {boolean}
     * @throws If the {@link SlotConfig} object is invalid.
     */
    this.lazyload = function lazyload() {
        errorCheck(errors);
        return slotConfig.lazyload;
    };

    /**
     * @return {boolean}
     * @throws If the {@link SlotConfig} object is invalid.
     */
    this.interstitial = function interstitial() {
        errorCheck(errors);
        return slotConfig.interstitial;
    };

    /**
     * @return {boolean}
     * @throws If the {@link SlotConfig} object is invalid.
     */
    this.defineOnDisplay = function defineOnDisplay() {
        errorCheck(errors);
        return slotConfig.defineOnDisplay;
    };

    /**
     * @return {TatgetingMap}
     * @throws If the {@link SlotConfig} object is invalid.
     */
    this.targeting = function targeting() {
        errorCheck(errors);
        return slotConfig.targeting;
    };
}

/**
 * @param {BebopConfig} bebopConfig
 * @return {BebopSettings}
 * @throws If the {@link BebopConfig} object is not valid.
 */
function createBebopSettings(bebopConfig) {
    var htConfig = bebopConfig.headertag,
        gptConfig = bebopConfig.gpt,
        vpConfig = bebopConfig.viewPort,
        htSettings,
        gptSettings,
        vpSettigns,
        bebopSettings,
        errors;

    if (type.isObj(htConfig)) {
        htSettings = new HeadertagSettings(htConfig.enabled, htConfig.reference);
    }
    else {
        htSettings = new HeadertagSettings();
    }

    if (type.isObj(gptConfig)) {
        gptSettings = new GPTSettings(gptConfig.disableInitalLoad, gptConfig.loadTag);
    }
    else {
        gptSettings = new GPTSettings();
    }

    vpSettigns = new ViewPortSettings(vpConfig);

    bebopSettings = new BebopSettings(htSettings, gptSettings, vpSettigns);

    errors = bebopSettings.errors();
    if (errors.length > 0) {
        //? if (DEBUG_ERROR) {
        util.foreach(errors, function (error) {
            //? LOG_ERROR('error');
        });
        //? }

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

    var slotSettings = new SlotSettings(slotConfig),
        errors = slotSettings.errors();

    //? if (DEBUG_WARN) {
    util.foreach(slotSettings.warnings(), function (warning) {
        // so that the warnings don't show up when running the tests.
        //? LOG_WARN('warning');
    });
    //? }

    if (errors.length > 0) {
        //? if (DEBUG_ERROR) {
        util.foreach(errors, function (error) {
            //? LOG_ERROR('error');
        });
        //? }

        util.invalidStateError(errors);
    }

    return slotSettings;
}

module.exports = {
    HeadertagSettings: HeadertagSettings,
    GPTSettings: GPTSettings,
    ViewPortSettings: ViewPortSettings,
    BebopSettings: BebopSettings,
    SlotSettings: SlotSettings,
    createBebopSettings: createBebopSettings,
    createSlotSettings: createSlotSettings
};
