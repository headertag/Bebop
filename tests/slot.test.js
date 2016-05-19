'use strct';

/**
 * Slot class test suite
 * =============================================================================
 */

/**
 * General usage from src/squib.js
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

var generalViewPortConfig = {
    viewPortSizes: {
        getViewPortWidth: function () { return 600; },
        'huge': 1200,
        'large': 800,
        'medium': 600, // Chosen viewport due to being the largest value below or equal to getViewPortWidth
        'small': 400,
        'tiny': 0
    }
},
    slotConfigGeneral = {
        gptDivId: "dfp-ad-lazyload",
        adUnitPath: "/62650033/desktop-uk",
        targeting: {
            "pos": "right3"
        },
        lazyload: true,
        defineOnDisplay: true,
        viewPortSizes: {
            large: [ [300, 250], [300, 252] ],
            small: [ [300, 50], [320, 50], [300, 100] ]
        }
    },
    slotConfigInterstitial = {
        gptDivId: "dfp-ad-interstitial",
        adUnitPath: "/62650033/desktop-uk",
        interstitial: true,
        targeting: {
            "pos": ['interstitial']
        },
        viewPortSizes: ['large']
    };

describe('Slot Test Suite', function () {

    var gptHandler, mockGPT, generalBebopSettings;

    beforeEach(function () {
        mockGPT = new MockGoogletag();
        generalBebopSettings = validate.createBebopSettings(generalViewPortConfig);
        gptHandler = new GPTHandler(mockGPT, generalBebopSettings);
        spyOn(mockGPT, "defineSlot");
        spyOn(mockGPT, "defineInterstitialSlot");
    });

    it('Slot instantiation with valid information should work correctly', function () {
        var slotSettings = validate.createSlotSettings(slotConfigGeneral),
            slot = new Slot(mockGPT, slotSettings, generalBebopSettings.viewPort);
        expect(slot).toBeDefined();
    });

    it('Missing parameter: gpthandler, should throw', function () {
        pending("Figure out if this is a cause for concern");
        var slotSettings = validate.createSlotSettings(slotConfigGeneral);
        expect(function () {
            new Slot(undefined, slotSettings, generalBebopSettings.viewPort);
        }).toThrow();
    });

    it('Missing parameter: slotConfig, should throw', function () {
        expect(function () {
            new Slot(mockGPT, undefined, generalBebopSettings.viewPort);
        }).toThrow();
    });

    it('Missing parameter: viewPortCfg, should throw', function () {
        var slotSettings = validate.createSlotSettings(slotConfigGeneral);
        expect(function () {
            new Slot(mockGPT, slotSettings);
        }).toThrow();
    });

    describe('Non-interstitial slots', function () {

        it('GPT slot is defined when available size matches up with view port width', function () {
            var slotConfig = {
                gptDivId: "dfp-ad-lazyload",
                adUnitPath: "/62650033/desktop-uk",
                targeting: {
                    "pos": "right3"
                },
                lazyload: true,
                defineOnDisplay: false,
                viewPortSizes: {
                    medium: [ [300, 250], [300, 252] ], // Important piece for this test
                    small: [ [300, 50], [320, 50], [300, 100] ]
                }
            },
                slotSettings = validate.createSlotSettings(slotConfig),
                slot = new Slot(mockGPT, slotSettings, generalBebopSettings.viewPort);
            expect(slot).toBeDefined();
            expect(mockGPT.defineSlot).toHaveBeenCalled();
        });

        it('GPT slot is not defined when defineOnDisplay is true', function () {
            var slotConfig = {
                    gptDivId: "dfp-ad-lazyload",
                    adUnitPath: "/62650033/desktop-uk",
                    targeting: {
                        "pos": "right3"
                    },
                    lazyload: true,
                    defineOnDisplay: true, // Important piece for this test
                    viewPortSizes: {
                        medium: [ [300, 250], [300, 252] ],
                        small: [ [300, 50], [320, 50], [300, 100] ]
                    }
                },
                slotSettings = validate.createSlotSettings(slotConfig),
                slot = new Slot(mockGPT, slotSettings, generalBebopSettings.viewPort);
            expect(slot).toBeDefined();
            expect(mockGPT.defineSlot).not.toHaveBeenCalled();
        });

        it('GPT slot is not defined when no sizes are available for the view port width (1)', function () {
            var slotConfig = {
                    gptDivId: "dfp-ad-lazyload",
                    adUnitPath: "/62650033/desktop-uk",
                    targeting: {
                        "pos": "right3"
                    },
                    lazyload: true,
                    defineOnDisplay: false,
                    viewPortSizes: {
                        medium: [], // Important piece for this test
                        small: [ [300, 50], [320, 50], [300, 100] ]
                    }
                },
                slotSettings = validate.createSlotSettings(slotConfig),
                slot = new Slot(mockGPT, slotSettings, generalBebopSettings.viewPort);
            expect(slot).toBeDefined();
            expect(mockGPT.defineSlot).not.toHaveBeenCalled();
        });

        it('GPT slot is not defined when no sizes are available for the view port width (2)', function () {
            var slotConfig = {
                    gptDivId: "dfp-ad-lazyload",
                    adUnitPath: "/62650033/desktop-uk",
                    targeting: {
                        "pos": "right3"
                    },
                    lazyload: true,
                    defineOnDisplay: false,
                    viewPortSizes: {
                        large: [ [300, 250], [300, 252] ], // Important piece for this test
                        small: [ [300, 50], [320, 50], [300, 100] ]
                    }
                },
                slotSettings = validate.createSlotSettings(slotConfig),
                slot = new Slot(mockGPT, slotSettings, generalBebopSettings.viewPort);
            expect(slot).toBeDefined();
            expect(mockGPT.defineSlot).not.toHaveBeenCalled();
        });
    });

    describe('Interstitial slots', function () {

        it('GPT slot is defined when available size matches up with view port width', function () {
            var slotConfig = {
                gptDivId: "dfp-ad-interstitial",
                adUnitPath: "/62650033/desktop-uk",
                interstitial: true,
                targeting: {
                    "pos": ['interstitial']
                },
                viewPortSizes: ['medium'] // Important piece for this test
            },
                slotSettings = validate.createSlotSettings(slotConfig),
                slot = new Slot(mockGPT, slotSettings, generalBebopSettings.viewPort);
            expect(slot).toBeDefined();
            expect(mockGPT.defineInterstitialSlot).toHaveBeenCalled();
        });

        it('GPT slot is not defined when available size does not match up with view port width (1)', function () {
            var slotConfig = {
                gptDivId: "dfp-ad-interstitial",
                adUnitPath: "/62650033/desktop-uk",
                interstitial: true,
                targeting: {
                    "pos": ['interstitial']
                },
                viewPortSizes: ['small'] // Important piece for this test
            },
                slotSettings = validate.createSlotSettings(slotConfig),
                slot = new Slot(mockGPT, slotSettings, generalBebopSettings.viewPort);
            expect(slot).toBeDefined();
            expect(mockGPT.defineInterstitialSlot).not.toHaveBeenCalled();
        });

        it('GPT slot is not defined when available size does not match up with view port width (2)', function () {
            var slotConfig = {
                gptDivId: "dfp-ad-interstitial",
                adUnitPath: "/62650033/desktop-uk",
                interstitial: true,
                targeting: {
                    "pos": ['interstitial']
                },
                viewPortSizes: ['large'] // Important piece for this test
            },
                slotSettings = validate.createSlotSettings(slotConfig),
                slot = new Slot(mockGPT, slotSettings, generalBebopSettings.viewPort);
            expect(slot).toBeDefined();
            expect(mockGPT.defineInterstitialSlot).not.toHaveBeenCalled();
        });

    });

});
