'use strct';

/**
 * GPTHandler class test suite
 * =============================================================================
 */
var GPTHandler = require('./../src/gpthandler');
var settings = require('./../src/settings');
var MockGoogletag = require('./mockgoogletag');

var bebopConfig = {
    viewPort: {
        getViewPortWidth: function () { return 500; },
        'large'     : 500,
        'medium'    : 0
    }
};

describe('GPTHandler Test Suite', function () {

    var gptHandler, mockGPT, config;

    beforeEach(function () {
        mochGPT = new MockGoogletag(),
        config = settings.createBebopSettings(bebopConfig);
        gptHandler = new GPTHandler(mochGPT, config);

        //spyOn(mochGPT, 'defineSlot');
        //spyOn(mochGPT, 'defineSlot');
        //spyOn(mochGPT, 'pubads');
        //spyOn(mochGPT, 'addService');
        //spyOn(mochGPT, 'runQueue');

    });

    it('gptHandler.defineSlot should call mochGPT.defineSlot', function () {
        function register(slot) {
            expect(slot).toBe(mochGPT);
        }
        gptHandler.defineSlot('test', [1,1], 'test', register);
        mochGPT.runQueue();
    });
});
