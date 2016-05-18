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

    var htSettings,
        gptSettings,
        vpsSettings;

    // I've started by creating nested suites for each of the exposed functions
    describe('HeadertagSettings Tests', function () {
        it('No params', function () {
            htSettings = new settings.HeadertagSettings();
        });

        it('Passing similar params as in validation.createSquib', function () {
            htSettings = new settings.HeadertagSettings(standardBebopConfig.headertag.enabled, standardBebopConfig.headertag.reference);
        });
    });

    describe('GPTSettings Tests', function () {
        it('No params', function () {
            gptSettings = new settings.GPTSettings();
        });

        it('Passing similar params as in validation.createSquib', function () {
            gptSettings = new settings.GPTSettings(standardBebopConfig.gpt.disableInitalLoad, standardBebopConfig.gpt.loadTag);
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
            var finalConfig = new settings.BebopSettings(htSettings, gptSettings, vpsSettings),
            errors = finalConfig.errors();
            expect(errors.length).toEqual(0);
        });
    });
});
