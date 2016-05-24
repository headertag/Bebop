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

    var vpsSettings;

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

        it('Passing similar params as in validation.createSquib', function () {
            vpsSettings = new settings.ViewPortSettings(standardBebopConfig.viewPortSizes);
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
