'use strict';

function MockGoogletag() {
    this.cmd = [];
}

MockGoogletag.prototype.defineSlot = function () {
    return this;
};

MockGoogletag.prototype.defineInterstitialSlot = function () {
    return this;
};

MockGoogletag.prototype.pubads = function () {
    return this;
};

MockGoogletag.prototype.addService = function () {
    return this;
};

MockGoogletag.prototype.runQueue = function () {
    while (this.cmd.length > 0) {
        var cb = this.cmd.shift();
        cb();
    }
    this.cmd = {
        push: function (cb) {
            cb();
        }
    }
};

module.exports = MockGoogletag;
