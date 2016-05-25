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

        // Common setup for "Targeting" tests
        function targetingTestSetup(targetingParams) {
            return {
                gptDivId: "dfp-ad-lazyload",
                adUnitPath: "/62650033/desktop-uk",
                targeting: targetingParams,
                lazyload: true,
                defineOnDisplay: true, // Makes GPT slot not get defined, which changes the way targeting is fetched
                viewPortSizes: {
                    medium: [ [300, 250] ]
                }
            };
        }

        it('targeting: no targeting', function () {
            var slotConfig1 = targetingTestSetup(undefined),
                slotSettings1 = new settings.SlotSettings(slotConfig1);
            expect(slotSettings1.targeting()).toEqual(undefined);
            var slotConfig2 = targetingTestSetup({}),
                slotSettings2 = new settings.SlotSettings(slotConfig2);
            expect(slotSettings2.targeting()).toEqual({});
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
