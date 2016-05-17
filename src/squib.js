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

// PRIVATE FUNCTIONS
function filterSlots(slots, gptSlots) {
    var filtered = [];

    gptSlots = type.isBool(gptSlots) ? gptSlots : true;

    util.foreach(slots, function (slot) {

        var divId = slot.getGPTDivId(),
            squibSlot = slots[divId];

        if (type.isObj(squibSlot)) {
            if (gptSlots) {
                filtered.push(squibSlot.getGPTSlot());
            }
            else {
                filtered.push(squibSlot);
            }
        }

        //? if (DEBUG) {
        if (!type.isObj(squibSlot)) {
            log.warn('Squib has no information about slot with gpt div id: ' + divId);
        }
        //? }

    });
    return filtered;
}

// PUBLIC API
function Squib(gptHandler, cfg) {
    config = cfg;
    gpt = gptHandler;
    slots = {};
}

Squib.prototype.defineSlots = function (slotsConfig) {
    var squibSlots = [];
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
        if (type.isNull(slots)) {
            gpt.refresh(null, options);
        }
        else {
            var gptSlots = [];
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
    util.foreachProp(pageTargets, gpt.setTargets, gpt);
};

module.exports = Squib;
