'use strict';

/**
 * @module private/settings
 */

var type = require('./type'),
    util = require('./util');

function errorCheck(errors) {
    if (errors.length > 0) {
        util.invalidStateError(errors);
    }
}

/**
 * HeadertagSettings is not part of the public Bebop API.
 *
 * @class
 * @param {boolean} [enabled=false] - True if headertag is enabled, false otherwise.
 * @param {Object?} reference - A reference to the global headertag object.
 */
function HeadertagSettings(enabled, reference) {
    //Enabled :bool, default false;  reference: function
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
                util.invalidStateError(errors);
            };
            /* falls through */
        default:
            if (enabled) {
                msg = 'headertag.reference Option: type: function, default none';
                errors.push(msg);
            }
    }

    /**
     * @return {Array.<string>} An array of errors or a 0 length array when no errors have occured.
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
 * @param {boolean} [disableInitalLoad=false] - True if the page's GPT Setup disables the inital load.
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
     * @return {Array.<string>} An array of errors or a 0 length array when no errors have occured.
     */
    this.errors = function () {
        return errors;
    };

    /**
     * @return {boolean} True if the page's GPT Setup disables the inital load.
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
    var viewCatagories = {'huge': 0, 'large': 0, 'medium': 0, 'small': 0, 'mini': 0},
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
     * @return {Array.<string>} An array of errors or a 0 length array when no errors have occured.
     */
    this.errors = function () {
        return errors;
    };

    /**
     * Finds the active size catagory.
     *
     * @return {string} The active size catagory
     * @throws If the {@link ViewPortConfig} object is invalid
     */
    this.viewCatagory = function () {
        var width, sizeCatagory;

        errorCheck(errors);

        width = this.viewPortSize();
        sizeCatagory = util.foreachProp(viewCatagories, function (catagory, size) {
            if (width >= size) {
                return catagory;
            }
        });

        if (type.isUndef(sizeCatagory)) {
            return null;
        }
        return sizeCatagory;
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
     * @return {Array.<string>} An array of erros or a 0 length array when no errors have occured.
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
 *
 */
function SlotSettings(slotConfig) {

}

module.exports = {
    HeadertagSettings: HeadertagSettings,
    GPTSettings: GPTSettings,
    ViewPortSettings: ViewPortSettings,
    BebopSettings: BebopSettings
};
