'use strict';

var squibConfig = require('./../src/squibconfig');
var MockGoogletag = require('./mockgoogletag');

describe('SquibConfig Test Suite', function () {
	// These values were determined by toggling device mode in Chrome Dev Tools, and get the value for 
	// window.document.documentElement.clientWidth from the Console
	var DESKTOP_WIDTH = 1903,
		MOBILE_WIDTH = 358,
		TABLET_WIDTH = 769; // We may want a test for when the WIDTH exactly matches the 'large' viewport
							// as defined in standardSquibConfig.viewPortSizes below

	// We can simulate changing the viewPortSize by modifying this variable 
	var clientWidth = DESKTOP_WIDTH;

	// This is equivalent to the window.squibConfig object used in the top level squib_config.js
	var standardSquibConfig = {
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
			getViewPortSize: function () { return clientWidth },
 			'large'     : 768, // Will we ever want to tweak this value?
			'medium'    : 0
		}
	};

	var htCfgObj,
		gptCfgObj,
		vpCfgObj;

	// I've started by creating nested suites for each of the exposed functions
	describe('HeaderTagConfig Tests', function () {
		it('No params', function () {
			htCfgObj = new squibConfig.HeadertagConfig();
		});

		it('Passing similar params as in validation.createSquib', function () {
			htCfgObj = new squibConfig.HeadertagConfig(standardSquibConfig.headertag.enabled, standardSquibConfig.headertag.reference);
		});
	});

	describe('GPTConfig Tests', function () {
		it('No params', function () {
			gptCfgObj = new squibConfig.GPTConfig();
		});

		it('Passing similar params as in validation.createSquib', function () {
			gptCfgObj = new squibConfig.GPTConfig(standardSquibConfig.gpt.disableInitalLoad, standardSquibConfig.gpt.loadTag);
		});
	});

	describe('ViewPortConfig Tests', function () {
		it('Passing similar params as in validation.createSquib', function () {
			vpCfgObj = new squibConfig.ViewPortConfig(standardSquibConfig.viewPortSizes);
		});
	});

	describe('SquibConfig Tests', function () {
		it('Passing similar params as in validation.createSquib', function () {
			// Can I re-use the config objects created above?
			var finalConfig = new squibConfig.SquibConfig(htCfgObj, gptCfgObj, vpCfgObj),
				errors = finalConfig.errors();

			expect(errors.length).toEqual(0);
		});
	});
});