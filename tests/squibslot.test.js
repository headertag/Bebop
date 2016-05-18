'use strct';

/**
 * SquibSlot class test suite
 * =============================================================================
 */

/**
 * From src/squib.js
 *
 * Squib.prototype.defineSlot = function (slotConfig) {
 *     var slotCfg = validator.createSlotConfig(slotConfig),
 *         squibSlot = new SquibSlot(gpt, slotCfg, config);
 *     slots[squibSlot.getGPTDivId()] = squibSlot;
 *     return squibSlot;
 * };
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

var slots = [
    {
        'gptDivId': 'gpt-div-leaderboard',
        'adUnitPath': '/62650033/desktop-uk',
        'viewPortSizes': {
            'huge'      :   [ [970, 250] ],
            'large'     :   [ [728, 90] ],
            'medium'    :   [ [320, 90] ],
            'small'     :   [ [300, 50] ],
            'mini'      :   [ [200, 50] ]
        },
        'lazyLoad': false,
        'sticky': false,
        'targeting': {
            'type': 'leaderboard',
            'region': 'Subnav',
            'pos': 'top'
        }
    },
    {
        'gptDivId': 'gpt-div-1',
        'adUnitPath': '/62650033/desktop-uk',
        'viewPortSizes': {
            'huge'      :   [ [300, 600] ]
        },
        'targeting': {
            'inView': true,
            'inContent': false,
            'region': 'Upper 300',
            'pos': 'right1'
        }
    }
];

describe('SquibSlot Test Suite', function () {

    var gptHandler, mockGPT, squibConfig;

    beforeEach(function () {
        mochGPT = new MockGoogletag(),
        squibConfig = validate.createSquibConfig(squibConfig);
        gptHandler = new GPTHandler(mochGPT, config);

    });

    it('SquibSlot instantiation with valid information should work correctly', function () {
        var slotConfig = validator.createSlotConfig(slots),
            squibSlot;// = new SquibSlot(mochGPT, slotConfig, squibConfig);
        // Haven't determined yet what should be the check here...
        //expect(type.getType(squibSlot)).toEqual('object');
        expect(function () {
            squibSlot = new SquibSlot(mochGPT, slotConfig, squibConfig);
        }).toThrow();
    });
});
