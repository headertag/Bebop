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
    SlotSettings = settings.SlotSettings,
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

    var slotSettings = new SlotSettings(slotConfig),
        errors = slotSettings.errors();

    //? if (DEBUG)
    util.foreach(slotSettings.warnings(), log.warn);

    if (errors.length > 0) {
        util.foreach(errors, log.error);
        util.invalidStateError(errors);
    }

    return slotSettings;
}

module.exports = {
    createBebopSettings: createBebopSettings,
    createSlotSettings: createSlotSettings
};
