'use strict';

// CLASSES
var SquibSlot = require('./squibslot'),
// MODULES
    validator = require('./validation'),
    log = require('./log').log,
    type = require('./type'),
    util = require('./util'),
// PRIVATE FIELDS
    config,
    slots,
    gpt;

// PUBLIC API
/**
 * @class Squib
 */
function Squib(gptHandler, cfg) {
    config = cfg;
    gpt = gptHandler;
    slots = {};
}

/**
 * TODO doc this
 *
 * @typedef {Object} SlotJSON
 */

/**
 * @param {SlotJSON[]} slotsConfig
 * @return {SquibSlot[]}
 * @throws if slotsConfig is not an array of SlotJSON
 */
Squib.prototype.defineSlots = function (slotsConfig) {
    var squibSlots = [];
    util.enforceType(slotsConfig, 'array');
    util.foreach(slotsConfig, function (slotConfig) {
        var squibSlot = this.defineSlot(slotConfig);
        squibSlots.push(squibSlot);
    }, this);
    return squibSlots;
};

Squib.prototype.defineSlot = function (slotConfig) {
    var slotCfg = validator.createSlotConfig(slotConfig),
        squibSlot = new SquibSlot(gpt, slotCfg, config);
    slots[squibSlot.getGPTDivId()] = squibSlot;
    return squibSlot;
};

Squib.prototype.refresh = function (slots, options) {
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
    gpt.q(function () {
        var gptSlots;
        if (type.isNull(slots)) {
            gpt.refresh(null, options);
        }
        else {
            gptSlots = [];
            util.foreach(slots, function (slot) {
                gptSlots.push(slot.getGPTSlot());
            });
            gpt.refresh(gptSlots, options);
        }
    });
};

Squib.prototype.display = function (slots) {
    util.enforceType(slots, ['array', 'object']);
    slots = type.isArray(slots) ? slots : [slots];
    // using the q here ensures that the slots are defined
    gpt.q(function () {
        util.foreach(slots, function (slot) {
            if (!slot.isDefined()) {
                slot.defineSlot();
            }
            gpt.display(slot.getGPTDivId());
        });
    });
};

Squib.prototype.setPageTargets = function (pageTargets) {
    util.enforceType(pageTargets, 'object');
    util.foreachProp(pageTargets, gpt.setPageTarget, gpt);
};

module.exports = Squib;
