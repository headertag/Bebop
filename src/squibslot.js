'use strict';

var util = require('./util'),
    type = require('./type'),
    log = require('./log').log;

function SquibSlot(gptHandler, slotConfig, squibConfig) {

    var self = this;

    this.private = {};
    this.private.gpt = gptHandler;
    this.private.cfg = slotConfig;
    this.private.squibCfg = squibConfig;
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
            this.private.squibCfg.viewPort.viewCatagory() +
            ' for slot with id: ' + this.getGPTDivId()
        );
    }
    //? }
}

SquibSlot.prototype.setTargeting = function (key, value) {
    this.private.gpt.q(function (gpt) {
        gpt.setSlotTargeting(this.gptSlot, key, value);
    });
};

SquibSlot.prototype.defineSlot = function () {
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
    util.foreachProp(this.getTargeting(), this.setTargeting, this);
};

SquibSlot.prototype.isDefined = function () {
    return type.isObj(this.private.gptSlot);
};

SquibSlot.prototype.getAdUnitPath = function () {
    return this.private.cfg.adUnitPath();
};

SquibSlot.prototype.getCatagories = function () {
    return this.private.cfg.sizeCatagories();
};

SquibSlot.prototype.getSizes = function () {
    var catagory;
    if (this.isInterstitial()) {
        return [];
    }
    catagory = this.private.squibCfg.viewPort.viewCatagory();
    return this.private.cfg.viewPortSizes(catagory) || [];
};

SquibSlot.prototype.getGPTDivId = function () {
    return this.private.cfg.gptDivId();
};

SquibSlot.prototype.isLazyLoad = function () {
    return this.private.cfg.lazyload();
};

SquibSlot.prototype.isInterstitial = function () {
    return this.private.cfg.interstitial();
};

SquibSlot.prototype.defineOnDisplay = function () {
    return this.private.cfg.defineOnDisplay();
}

SquibSlot.prototype.isActive = function () {
    var catagory = this.private.squibCfg.viewPort.viewCatagory();
    return (
        (this.isInterstitial() && util.inArray(catagory, this.getCatagories())) ||
        (this.getSizes().length > 0)
    );
};

SquibSlot.prototype.getTargeting = function (key, value) {
    return this.private.cfg.targeting();
};

SquibSlot.prototype.getGPTSlot = function () {
    return this.private.gptSlot;
};

SquibSlot.prototype.setTargeting = function (key, value) {
    var self = this;
    this.private.gpt.q(function (gpt) {
        gpt.setSlotTargeting(self.getGPTSlot(), key, value);
    });
};

module.exports = SquibSlot;
