'use strct';

/**
 * GPTHandler class test suite
 * =============================================================================
 */
var GPTHandler = require('./../src/gpthandler');
var validate = require('./../src/validation');
var MockGoogletag = require('./mockgoogletag');

var squibConfig = {
    viewPortSizes: {
        getViewPortSize: function () { return 500; },
        'large'     : 500,
        'medium'    : 0
    }
};

describe('GPTHandler Test Suite', function () {

    var gptHandler, mochGPT, config;

    beforeEach(function () {
        mochGPT = new MockGoogletag(),
        config = validate.createSquibConfig(squibConfig);
        gptHandler = new GPTHandler(mochGPT, config);

        //spyOn(mochGPT, 'defineSlot')
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
