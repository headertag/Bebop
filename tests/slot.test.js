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
var Slot = require('./../src/slot');

var bebopConfig = {
    viewPortSizes: {
        getViewPortWidth: function () { return 500; },
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
            'tiny'      :   [ [200, 50] ]
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

describe('Slot Test Suite', function () {

    var gptHandler, mockGPT, bebopSettings;

    beforeEach(function () {
        mockGPT = new MockGoogletag();
        bebopSettings = validate.createBebopSettings(bebopConfig);
        gptHandler = new GPTHandler(mockGPT, bebopSettings);

    });

    it('Slot instantiation with valid information should work correctly', function () {
        var slotSettings = validate.createSlotSettings(slots[0]),
            slot = new Slot(mochGPT, slotSettings, bebopSettings.viewPort);
        expect(slot).toBeDefined();
    });

    it('Missing gpthandler should throw', function () {
        var slotSettings = validate.createSlotSettings(slots[0]);
        expect(function () {
            new Slot(undefined, slotSettings, bebopSettings.viewPort);
        }).toThrow();
    });

    it('Missing slotConfig should throw', function () {
        var slotSettings = validate.createSlotSettings(slots[0]);
        expect(function () {
            new Slot(mockGPT, undefined, bebopSettings.viewPort);
        }).toThrow();
    });

    it('Missing viewPortCfg should throw', function () {
        var slotSettings = validate.createSlotSettings(slots[0]);
        expect(function () {
            new Slot(mockGPT, slotSettings);
        }).toThrow();
    });
});
