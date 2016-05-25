'use strict';

var settings = require('./../src/settings');
var MockGoogletag = require('./mockgoogletag');

describe('settings Test Suite', function () {
    // These values were determined by toggling device mode in Chrome Dev Tools, and get the value for
    // window.document.documentElement.clientWidth from the Console
    var DESKTOP_WIDTH = 1903,
        MOBILE_WIDTH = 358,
        TABLET_WIDTH = 769; // We may want a test for when the WIDTH exactly matches the 'large' viewport
                            // as defined in standardsettings.viewPortSizes below

    // We can simulate changing the viewPortSize by modifying this variable
    var clientWidth = DESKTOP_WIDTH;

    // This is equivalent to the window.settings object used in the top level squib_config.js
    var standardBebopConfig = {
        // Maybe I shoud just move each of these into their respective suites?
        headertag: {
            enabled: true,
            reference: function () {
                // A mock object for now, instead of creating an instance of HeaderTag
                // Though I suspect we may need some headertag functions later..
                return new MockGoogletag();
            }
        },
        gpt: {
            disableInitalLoad: true,
            loadTag: true
        },
        viewPortSizes: {
            //Mock width, since we're not actually running this in a browser
            getViewPortWidth: function () { return clientWidth },
            'large'     : 768, // Will we ever want to tweak this value?
            'medium'    : 0
        }
    };

    describe('HeadertagSettings Tests', function () {

        it('No parameters', function () {
            var htSettings = new settings.HeadertagSettings();
            expect(htSettings.enabled()).toBe(false);
            expect(htSettings.reference()).toBe(undefined);
        });

        it('Parameters are of wrong type', function () {
            var htSettings = new settings.HeadertagSettings("false", "reference");
            expect(function () { htSettings.enabled(); }).toThrow();
            expect(function () { htSettings.reference(); }).toThrow();
        });

        it('Passing in enabled as false', function () {
            var htSettings = new settings.HeadertagSettings(false);
            expect(htSettings.enabled()).toBe(false);
            expect(htSettings.reference()).toBe(undefined);
        });

        it('Enabled with no reference', function () {
            var htSettings = new settings.HeadertagSettings(true);
            expect(function () { htSettings.enabled() }).toThrow();
            expect(function () { htSettings.reference() }).toThrow();
        });

        it('Passing in reference', function () {
            var htSettings = new settings.HeadertagSettings(undefined, function () { return { obj: true }; });
            expect(htSettings.enabled()).toBe(false);
            expect(htSettings.reference()).toEqual({ obj: true });
        });

        it('Passing in both parameters', function () {
            var htSettings = new settings.HeadertagSettings(true, function () { return "String"; });
            expect(htSettings.enabled()).toBe(true);
            expect(htSettings.reference()).toBe("String");
        });

    });

    describe('GPTSettings Tests', function () {

        it('No parameters', function () {
            var gptSettings = new settings.GPTSettings();
            expect(gptSettings.disableInitalLoad()).toBe(false);
            expect(gptSettings.loadTag()).toBe(false);
        });

        it('Parameters are of wrong type', function () {
            var gptSettings = new settings.GPTSettings("true", "true");
            expect(function () { gptSettings.disableInitalLoad() }).toThrow();
            expect(function () { gptSettings.loadTag() }).toThrow();
        });

        it('Passing in disableInitalLoad', function () {
            var gptSettings = new settings.GPTSettings(true);
            expect(gptSettings.disableInitalLoad()).toBe(true);
            expect(gptSettings.loadTag()).toBe(false);
        });

        it('Passing in loadTag', function () {
            var gptSettings = new settings.GPTSettings(undefined, true);
            expect(gptSettings.disableInitalLoad()).toBe(false);
            expect(gptSettings.loadTag()).toBe(true);
        });

        it('Passing in both parameters as false', function () {
            var gptSettings = new settings.GPTSettings(false, false);
            expect(gptSettings.disableInitalLoad()).toBe(false);
            expect(gptSettings.loadTag()).toBe(false);
        });

        it('Passing in both parameters as true', function () {
            var gptSettings = new settings.GPTSettings(true, true);
            expect(gptSettings.disableInitalLoad()).toBe(true);
            expect(gptSettings.loadTag()).toBe(true);
        });

    });

    describe('ViewPortSettings Tests', function () {

        it('No parameters', function () {
            var vpSettings = new settings.ViewPortSettings();
            expect(function () { vpSettings.viewCatagories() }).toThrow();
            expect(function () { vpSettings.viewCategory() }).toThrow();
            expect(function () { vpSettings.viewPortSize() }).toThrow();
        });

        it('Parameter is of wrong type', function () {
            var vpSettings = new settings.ViewPortSettings([
                {getViewPortWidth: function () { return 320 }},
                {'large' : 768},
                {'medium' : 0}
            ]);
            expect(function () { vpSettings.viewCatagories() }).toThrow();
            expect(function () { vpSettings.viewCategory() }).toThrow();
            expect(function () { vpSettings.viewPortSize() }).toThrow();
        });

        it('Passing in no sizes', function () {
            var vpSettings = new settings.ViewPortSettings({
                getViewPortWidth: function () { return 768 }
            });
            expect(function () { vpSettings.viewCatagories() }).toThrow();
            expect(function () { vpSettings.viewCategory() }).toThrow();
            expect(function () { vpSettings.viewPortSize() }).toThrow();
        });

        it('Passing in no getViewPortWidth function', function () {
            var vpSettings = new settings.ViewPortSettings({
                'large' : 768,
                'medium' : 0
            });
            expect(function () { vpSettings.viewCatagories() }).toThrow();
            expect(function () { vpSettings.viewCategory() }).toThrow();
            expect(function () { vpSettings.viewPortSize() }).toThrow();
        });

        it('viewCatagories: all valid categories', function () {
            var vpSettings = new settings.ViewPortSettings({
                'huge': 1200,
                'large' : 800,
                'medium' : 600,
                'small': 400,
                'tiny': 0,
                getViewPortWidth: function () { return 320 }
            });
            expect(vpSettings.viewCatagories()).toEqual({
                'huge': 1200,
                'large' : 800,
                'medium' : 600,
                'small': 400,
                'tiny': 0
            });
        });

        it('viewCatagories: invalid categories', function () {
            var vpSettings = new settings.ViewPortSettings({
                'gigantic': 1200,
                'grand' : 800,
                'moderate' : 600,
                'little': 400,
                'teensy': 0,
                getViewPortWidth: function () { return 320 }
            });
            expect(function () { vpSettings.viewCatagories() }).toThrow();
            expect(function () { vpSettings.viewCategory() }).toThrow();
            expect(function () { vpSettings.viewPortSize() }).toThrow();
        });

        it('viewCatagories: mix of valid and invalid categories', function () {
            var vpSettings = new settings.ViewPortSettings({
                'gigantic': 1200,
                'large' : 800,
                'moderate' : 600,
                'small': 400,
                'teensy': 0,
                getViewPortWidth: function () { return 320 }
            });
            expect(vpSettings.viewCatagories()).toEqual({
                'large' : 800,
                'small': 400
            });
        });

        it('viewCategory + viewPortSize: getViewPortWidth is less than all defined category sizes', function () {
            var vpSettings = new settings.ViewPortSettings({
                'huge': 1200,
                'large' : 800,
                'medium' : 600,
                'small': 400,
                'tiny': 200,
                getViewPortWidth: function () { return 199 }
            });
            // Always return a category by returning the smallest category in this case
            expect(vpSettings.viewCategory()).toBe('tiny');
            expect(vpSettings.viewPortSize()).toBe(199);
        });

        it('viewCategory + viewPortSize: getViewPortWidth is less than a defined category size', function () {
            var vpSettings = new settings.ViewPortSettings({
                'huge': 1200,
                'large' : 800,
                'medium' : 600,
                'small': 400,
                'tiny': 200,
                getViewPortWidth: function () { return 399 }
            });
            expect(vpSettings.viewCategory()).toBe('tiny');
            expect(vpSettings.viewPortSize()).toBe(399);
        });

        it('viewCategory + viewPortSize: getViewPortWidth is equal to a defined category size', function () {
            var vpSettings = new settings.ViewPortSettings({
                'huge': 1200,
                'large' : 800,
                'medium' : 600,
                'small': 400,
                'tiny': 200,
                getViewPortWidth: function () { return 400 }
            });
            expect(vpSettings.viewCategory()).toBe('small');
            expect(vpSettings.viewPortSize()).toBe(400);
        });

        it('viewCategory + viewPortSize: getViewPortWidth is equal to multiple defined category sizes', function () {
            var vpSettings = new settings.ViewPortSettings({
                'huge': 1200,
                'large' : 800,
                'medium' : 600,
                'small': 600,
                'tiny': 200,
                getViewPortWidth: function () { return 600 }
            });
            expect(vpSettings.viewCatagories()).toEqual({
                'huge': 1200,
                'large' : 800,
                'medium' : 600,
                'small': 600,
                'tiny': 200
            });
            expect(vpSettings.viewCategory()).toBe('medium');
            expect(vpSettings.viewPortSize()).toBe(600);
        });

        it('viewCategory + viewPortSize: getViewPortWidth is larger than a defined category size', function () {
            var vpSettings = new settings.ViewPortSettings({
                'huge': 1200,
                'large' : 800,
                'medium' : 600,
                'small': 400,
                'tiny': 200,
                getViewPortWidth: function () { return 401 }
            });
            expect(vpSettings.viewCategory()).toBe('small');
            expect(vpSettings.viewPortSize()).toBe(401);
        });

        it('viewCategory + viewPortSize: getViewPortWidth is larger than all defined category sizes', function () {
            var vpSettings = new settings.ViewPortSettings({
                'huge': 1200,
                'large' : 800,
                'medium' : 600,
                'small': 400,
                'tiny': 200,
                getViewPortWidth: function () { return 1201 }
            });
            expect(vpSettings.viewCategory()).toBe('huge');
            expect(vpSettings.viewPortSize()).toBe(1201);
        });

    });

    describe('SlotSettings Tests', function () {

        // The next few function all fill the purpose of returning a
        // config with the missing value being filled in by the parameter
        function gptDivIdTestSetup(divIDValue) {
            return {
                gptDivId: divIDValue,
                adUnitPath: "/62650033/desktop-uk",
                targeting: {"key": "value"},
                lazyload: true,
                defineOnDisplay: true,
                viewPortSizes: {
                    medium: [ [300, 250] ]
                }
            };
        }

        function adUnitPathTestSetup(adUnitPathValue) {
            return {
                gptDivId: "dfp-ad-lazyload",
                adUnitPath: adUnitPathValue,
                targeting: {"key": "value"},
                lazyload: true,
                defineOnDisplay: true,
                viewPortSizes: {
                    medium: [ [300, 250] ]
                }
            };
        }

        function targetingTestSetup(targetingValue) {
            return {
                gptDivId: "dfp-ad-lazyload",
                adUnitPath: "/62650033/desktop-uk",
                targeting: targetingValue,
                lazyload: true,
                defineOnDisplay: true,
                viewPortSizes: {
                    medium: [ [300, 250] ]
                }
            };
        }

        function lazyloadTestSetup(lazyloadValue) {
            return {
                gptDivId: "dfp-ad-lazyload",
                adUnitPath: "/62650033/desktop-uk",
                targeting: {"key": "value"},
                lazyload: lazyloadValue,
                defineOnDisplay: true,
                viewPortSizes: {
                    medium: [ [300, 250] ]
                }
            };
        }

        function defineOnDisplayTestSetup(defineOnDisplayValue) {
            return {
                gptDivId: "dfp-ad-lazyload",
                adUnitPath: "/62650033/desktop-uk",
                targeting: {"key": "value"},
                lazyload: true,
                defineOnDisplay: defineOnDisplayValue,
                viewPortSizes: {
                    medium: [ [300, 250] ]
                }
            };
        }

        function viewPortSizesTestSetup(interstitialValue, viewPortSizesValue) {
            return {
                gptDivId: "dfp-ad-lazyload",
                adUnitPath: "/62650033/desktop-uk",
                targeting: {"key": "value"},
                lazyload: true,
                defineOnDisplay: true,
                interstitial: interstitialValue,
                viewPortSizes: viewPortSizesValue
            };
        }

        it('gptDivID: undefined', function () {
            var slotConfig = gptDivIdTestSetup(undefined);
            expect(function () { new settings.createSlotSettings(slotConfig); }).toThrow();
        });

        it('gptDivID: empty', function () {
            var slotConfig = gptDivIdTestSetup('');
            expect(function () { new settings.createSlotSettings(slotConfig); }).toThrow();
        });

        it('gptDivID: non-empty', function () {
            var slotConfig = gptDivIdTestSetup('dfp-ad-lazyload'),
                slotSettings = new settings.SlotSettings(slotConfig);
            expect(slotSettings.gptDivId()).toEqual('dfp-ad-lazyload');
        });

        it('adUnitPath: undefined', function () {
            var slotConfig = adUnitPathTestSetup(undefined);
            expect(function () { new settings.createSlotSettings(slotConfig); }).toThrow();
        });

        it('adUnitPath: empty', function () {
            var slotConfig = adUnitPathTestSetup(''),
                slotSettings = new settings.SlotSettings(slotConfig);
            expect(slotSettings.adUnitPath()).toEqual('');
        });

        it('adUnitPath: non-empty', function () {
            var slotConfig = adUnitPathTestSetup('/62650033/desktop-uk'),
                slotSettings = new settings.SlotSettings(slotConfig);
            expect(slotSettings.adUnitPath()).toEqual('/62650033/desktop-uk');
        });

        it('targeting: undefined', function () {
            var slotConfig = targetingTestSetup(undefined),
                slotSettings = new settings.SlotSettings(slotConfig);
            expect(slotSettings.targeting()).toEqual(undefined);
        });

        it('targeting: empty', function () {
            var slotConfig = targetingTestSetup({}),
                slotSettings = new settings.SlotSettings(slotConfig);
            expect(slotSettings.targeting()).toEqual({});
        });

        it('setTargeting: value as a boolean', function () {
            var slotConfig = targetingTestSetup({"key": true});
            expect(function () { new settings.createSlotSettings(slotConfig); }).toThrow();
        });

        it('targeting: value as a number', function () {
            var slotConfig = targetingTestSetup({"key": 777});
            expect(function () { new settings.createSlotSettings(slotConfig); }).not.toThrow();
        });

        it('targeting: value as an object', function () {
            var slotConfig = targetingTestSetup({"key": {"value": true}});
            expect(function () { new settings.createSlotSettings(slotConfig); }).toThrow();
        });

        it('targeting: value as an array of strings, numbers', function () {
            var slotConfig = targetingTestSetup({"key": ["value", 777]});
            expect(function () { new settings.createSlotSettings(slotConfig); }).not.toThrow();
        });

        it('targeting: value as an array of strings, objects', function () {
            var slotConfig = targetingTestSetup({"key": ["value", {"valuethesecond": true}]});
            expect(function () { new settings.createSlotSettings(slotConfig); }).toThrow();
        });

        it('targeting: value as an array of arrays', function () {
            var slotConfig = targetingTestSetup({"key": ["value", ["second"]]});
            expect(function () { new settings.createSlotSettings(slotConfig); }).toThrow();
        });

        it('targeting: value as a string', function () {
            var slotConfig = targetingTestSetup({"key": "value"});
            expect(function () { new settings.createSlotSettings(slotConfig); }).not.toThrow();
        });

        it('targeting: value as an array of strings', function () {
            var slotConfig = targetingTestSetup({"key": ["value", "second"]});
            expect(function () { new settings.createSlotSettings(slotConfig); }).not.toThrow();
        });

        it('lazyload: undefined', function () {
            var slotConfig = lazyloadTestSetup(undefined),
                slotSettings = new settings.SlotSettings(slotConfig);
            expect(slotSettings.lazyload()).toEqual(false);
        });

        it('lazyload: true', function () {
            var slotConfig = lazyloadTestSetup(true),
                slotSettings = new settings.SlotSettings(slotConfig);
            expect(slotSettings.lazyload()).toEqual(true);
        });

        it('lazyload: false', function () {
            var slotConfig = lazyloadTestSetup(false),
                slotSettings = new settings.SlotSettings(slotConfig);
            expect(slotSettings.lazyload()).toEqual(false);
        });

        it('defineOnDisplay: undefined', function () {
            var slotConfig = defineOnDisplayTestSetup(undefined),
                slotSettings = new settings.SlotSettings(slotConfig);
            expect(slotSettings.defineOnDisplay()).toEqual(false);
        });

        it('defineOnDisplay: true', function () {
            var slotConfig = defineOnDisplayTestSetup(true),
                slotSettings = new settings.SlotSettings(slotConfig);
            expect(slotSettings.defineOnDisplay()).toEqual(true);
        });

        it('defineOnDisplay: false', function () {
            var slotConfig = defineOnDisplayTestSetup(false),
                slotSettings = new settings.SlotSettings(slotConfig);
            expect(slotSettings.defineOnDisplay()).toEqual(false);
        });

        it('viewPortSizes (interstitial): undefined', function () {
            var slotConfig = viewPortSizesTestSetup(true, undefined);
            expect(function () { new settings.createSlotSettings(slotConfig); }).toThrow();
        });

        it('viewPortSizes (interstitial): empty array', function () {
            var slotConfig = viewPortSizesTestSetup(true, []);
            expect(function () { new settings.createSlotSettings(slotConfig); }).toThrow();
        });

        it('viewPortSizes (interstitial): one incorrect size', function () {
            var slotConfig = viewPortSizesTestSetup(true, ['gigantic']);
            expect(function () { new settings.createSlotSettings(slotConfig); }).toThrow();
        });

        it('viewPortSizes (interstitial): many incorrect sizes', function () {
            var slotConfig = viewPortSizesTestSetup(true, ['teensy', 'gigantic']);
            expect(function () { new settings.createSlotSettings(slotConfig); }).toThrow();
        });

        it('viewPortSizes (interstitial): one valid size', function () {
            var slotConfig = viewPortSizesTestSetup(true, ['small']),
                slotSettings = new settings.SlotSettings(slotConfig);
            expect(slotSettings.sizeCatagories()).toEqual(['small']);
        });

        it('viewPortSizes (interstitial): many valid sizes', function () {
            var slotConfig = viewPortSizesTestSetup(true, ['tiny', 'small', 'medium', 'large', 'huge']),
                slotSettings = new settings.SlotSettings(slotConfig);
            expect(slotSettings.sizeCatagories()).toEqual(['tiny', 'small', 'medium', 'large', 'huge']);
        });

        it('viewPortSizes (interstitial): mix of valid and invalid sizes', function () {
            var slotConfig = viewPortSizesTestSetup(true, ['teensy', 'small', 'moderate', 'large', 'gigantic']),
                slotSettings = new settings.SlotSettings(slotConfig);
            expect(slotSettings.sizeCatagories()).toEqual(['small', 'large']);
        });

        it('viewPortSizes (non-interstitial): undefined', function () {
            var slotConfig = viewPortSizesTestSetup(false, undefined);
            expect(function () { new settings.createSlotSettings(slotConfig); }).toThrow();
        });

        it('viewPortSizes (non-interstitial): empty array', function () {
            var slotConfig = viewPortSizesTestSetup(false, []);
            expect(function () { new settings.createSlotSettings(slotConfig); }).toThrow();
        });

        it('viewPortSizes (non-interstitial): one incorrect size', function () {
            var slotConfig = viewPortSizesTestSetup(false, { gigantic: [ [300, 1050] ] });
            expect(function () { new settings.createSlotSettings(slotConfig); }).toThrow();
        });

        it('viewPortSizes (non-interstitial): many incorrect sizes', function () {
            var slotConfig = viewPortSizesTestSetup(false, {
                teensy: [ [300, 50] ],
                gigantic: [ [300, 1050] ]
            });
            expect(function () { new settings.createSlotSettings(slotConfig); }).toThrow();
        });

        it('viewPortSizes (non-interstitial): one valid size', function () {
            var slotConfig = viewPortSizesTestSetup(false, { medium: [ [300, 250] ] }),
                slotSettings = new settings.SlotSettings(slotConfig);
            expect(slotSettings.viewPortSizes('small')).toEqual([]);
            expect(slotSettings.viewPortSizes('medium')).toEqual([ [300, 250] ]);
        });

        it('viewPortSizes (non-interstitial): many valid sizes, multiple width-height values for a given size', function () {
            var slotConfig = viewPortSizesTestSetup(false, {
                tiny: [ [300, 50] ],
                small: [ [300, 50], [320, 50] ],
                medium: [ [300, 250] ],
                large: [],
                huge: [ [300, 1050] ]
            }),
                slotSettings = new settings.SlotSettings(slotConfig);
            expect(slotSettings.viewPortSizes('tiny')).toEqual([ [300, 50] ]);
            expect(slotSettings.viewPortSizes('small')).toEqual([ [300, 50], [320, 50] ]);
            expect(slotSettings.viewPortSizes('medium')).toEqual([ [300, 250] ]);
            expect(slotSettings.viewPortSizes('large')).toEqual([]);
            expect(slotSettings.viewPortSizes('huge')).toEqual([ [300, 1050] ]);
        });

        it('viewPortSizes (non-interstitial): mix of valid and invalid sizes', function () {
            var slotConfig = viewPortSizesTestSetup(false, {
                    teensy: [ [300, 50] ],
                    small: [ [300, 50], [320, 50] ],
                    moderate: [ [300, 250] ],
                    large: [],
                    gigantic: [ [300, 1050] ]
                }),
                slotSettings = new settings.SlotSettings(slotConfig);
            // Invalid size categories should have been dropped during SlotSettings creation
            expect(slotSettings.viewPortSizes('teensy')).toEqual([]);
            expect(slotSettings.viewPortSizes('small')).toEqual([ [300, 50], [320, 50] ]);
            expect(slotSettings.viewPortSizes('moderate')).toEqual([]);
            expect(slotSettings.viewPortSizes('large')).toEqual([]);
            expect(slotSettings.viewPortSizes('gigantic')).toEqual([]);
        });

    });

    describe('BebopConfig Tests', function () {
        it('Passing similar params as in validation.createSquib', function () {
            // Can I re-use the config objects created above?
            var finalConfig = new settings.BebopSettings(
                new settings.HeadertagSettings(),
                new settings.GPTSettings(),
                new settings.ViewPortSettings(standardBebopConfig.viewPortSizes)
            ),
                errors = finalConfig.errors();
            expect(errors.length).toEqual(0);
        });
    });
});
