'use strict';

/**
 * @module public/bebop
 */

// CLASSES
var Slot = require('./slot'),
// MODULES
    validator = require('./validation'),
    log = require('./log').log,
    type = require('./type'),
    util = require('./util');

/**
 * This Constructor is not part of the public Bebop API.
 * To obtain a reference to a Bebop object you must use the
 * window.bebopQueue object.
 *
 * @class Bebop
 *
 * @param {GPTHandler} gptHandler
 * @param {BebopSettings} bebopSettings
 *
 * @example
 * window.bebopQueue.push(function (bebop) {
 *    // use bebop.
 * });
 */
function Bebop(gptHandler, bebopSettings) {

    /**
     * @property {Object} private
     *
     * The private object is private and can change at any time.
     * It should not be referenced outside of the class definition.
     */
    this.private = {};
    this.private.settings = bebopSettings;
    this.private.gpt = gptHandler;
    this.private.slots = {};
}

/**
 * @param {Array.<SlotConfig>} slotsConfig
 * @return {Array.<Slot>}
 * @throws if slotsConfig is not an array of valid {@link SlotConfig} objects.
 */
Bebop.prototype.defineSlots = function (slotsConfig) {
    var squibSlots = [];
    util.enforceType(slotsConfig, 'array');
    util.foreach(slotsConfig, function (slotConfig) {
        var squibSlot = this.defineSlot(slotConfig);
        squibSlots.push(squibSlot);
    }, this);
    return squibSlots;
};

/**
 * @param {SlotConfig} slotConfig
 * @return {Slot}
 * @throws if slotConfig is not a valid {@link SlotConfig} object
 */
Bebop.prototype.defineSlot = function (slotConfig) {
    var slotSettings = validator.createSlotSettings(slotConfig),
        slot = new Slot(this.private.gpt, slotSettings, this.private.settings.viewPort);
    this.private.slots[slot.getGPTDivId()] = slot;
    return slot;
};

/**
 *
 * @param {Array.<Slot>?} slots - The slots to refresh. Array is optional; all slots will be refreshed if it is unspecified.
 * @param {Object?} options - Configuration options associated with this refresh call.
 */
Bebop.prototype.refresh = function (slots, options) {
    // handles the case where only options is passed
    if (type.isObj(slots) && type.isUndef(options)) {
        options = slots;
        slots = [];
    }

    // handles the case where nothing was passed
    if (type.isUndef(slots)) {
        slots = null;
    }

    // using the q here ensures that the slots are defined
    this.private.gpt.q(function (gptHandler) {
        var gptSlots;
        if (type.isNull(slots)) {
            gptHandler.refresh(null, options);
        }
        else {
            gptSlots = [];
            util.foreach(slots, function (slot) {
                gptSlots.push(slot.getGPTSlot());
            });
            gptHandler.refresh(gptSlots, options);
        }
    });
};

/**
 * If the slot is not already defined, display will take care
 * of defining the slot.
 *
 * @param {Slot} slot - The Slot object to display
 */
Bebop.prototype.display = function (slots) {

    util.enforceType(slots, ['array', 'object']);
    slots = type.isArray(slots) ? slots : [slots];

    // using the q here ensures that the slots are defined
    this.private.gpt.q(function (gptHander) {
        util.foreach(slots, function (slot) {

            if (!slot.isActive()) {
                //? if (DEBUG)
                log.warn('Tringing to display non active Slot with GPT Div Id: ' + slot.getGPTDivId());

                return;
            }

            if (!slot.isDefined()) {
                slot.defineSlot();
            }

            gptHander.display(slot.getGPTDivId());
        });
    });
};

/**
 * Applies page level targeting.
 *
 * @param {TargetingMap} pageTargets - Targeting parameters.
 */
Bebop.prototype.setPageTargets = function (pageTargets) {
    util.enforceType(pageTargets, 'object');
    util.foreachProp(pageTargets, this.private.gpt.setPageTargeting, this.private.gpt);
};

/**
 * @return {Array.<Slot>} All slots registered with Bebop.
 */
Bebop.prototype.getSlots = function () {
    return this.private.slots;
};

module.exports = Bebop;
