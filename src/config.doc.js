/**
 * @module public/config
 */

/**
 * The window.bebopConfig object must exist in global scope before Bebop itself is loaded
 *
 * @typedef {Object} BebopConfig
 *
 * @property {HeadertagConfig?} headertag - If present in the configuration this informs Bebop to pass slot objects to headertag before calling display.
 * @property {GPTConfig?} gpt - This optional parameter informs Bebop of the page's googletag configuration.
 * @property {ViewPortConfig} viewPort - This configuration object informs Bebop what slots are active under the present view port size.
 *
 * @example
 * <script type="text/javascript">
 * window.bebopConfig = {
 *      headertag: {
 *          enabled: true,
 *          reference: function () {
 *              return window.headertag;
 *          }
 *      },
 *      gpt: {
 *          disableInitalLoad: true,
 *          loadTag: false
 *      },
 *      viewPort: {
 *          getViewPortWidth: function () {
 *              return window.document.documentElement.clientWidth;
 *          },
 *          'large'     : 768,
 *          'small'    : 0
 *      }
 * };
 * </script>
 * <script async type="text/javascript" src="//yourdomain/path/bebop.js"></script>
 */

/**
 * @typedef {Object} HeadertagConfig
 *
 * @property {boolean} [enabled=true] true if headertag is enabled, false otherwise
 * @property {function} reference A function that returns a reference to headertag
 *
 * @example
 * headertag: {
 *      enabled: true,
 *      reference: function () {
 *          return window.headertag;
 *      }
 * }
 */

/**
 * @typedef {Object} GPTConfig
 *
 * @property {boolean} [disableInitalLoad=false] true if the page calls googletag.pubads().disableInitalLoad()
 * @property {boolean} [loadTag=false] true if you wish Bebop to load googletag.
 *
 * @example
 * gpt: {
 *      disableInitalLoad: true,
 *      loadTag: false
 * }
 */

/**
 * The ViewPortConfig object is used to determine what sizes to apply to slots {@link SlotConfig}.
 * This feature is very handy if the publisher wishes to use the same divs across
 * multiple screen sizes.
 *
 * Only one size category is required.
 *
 * @typedef {Object} ViewPortConfig
 *
 * @property {function} getViewPortWidth - A function that returns the view port width
 * @property {number?} huge - If the view port width is >= this value, the huge category will be active
 * @property {number?} large - If the view port width is >= this value, the large category will be active
 * @property {number?} medium - If the view port width is >= this value, the medium category will be active
 * @property {number?} small - If the view port width is >= this value, the small category will be active
 * @property {number?} tiny - If the view port width is >= this value, the tiny category will be active
 *
 * @example
 * // An example where all size categories are defined
 * viewPort: {
 *      getViewPortWidth: function () {
 *          return window.document.documentElement.clientWidth;
 *      },
 *      'huge': 1200
 *      'large': 800,
 *      'medium': 600,
 *      'small': 400,
 *      'tiny': 0
 * }
 * // An example where only one size category is defined
 * viewPort: {
 *      getViewPortWidth: function () {
 *          return window.document.documentElement.clientWidth;
 *      },
 *      medium: 0
 * }
 */

/**
 * SlotConfig object are what is passed to bebop.defineSlot and bebop.defineSlots
 *
 * @typedef SlotConfig
 *
 * @property {AdUnitPath} adUnitPath - Full path of the ad unit with the network code and unit name.
 * @property {GPTDivId} gptDivId - The ID of a div that is used to render a creative.
 * @property {boolean} [interstitial=false] - True if the slot is an out of page slot.
 * @property {boolean} [laztload=false] - True if the slot is to be lazyloaded.
 * @property {boolean} [defineOnDisplay=false] - True if the define call should be delayed until the slot is to be displayed.
 * @property {TargetingMap?} targeting - Key value pairs of targeting that is applied to the slot.
 * @property {(SizeCategoryMap|InterstitalViewPortSizes)} viewPortSizes - If the slot is interstitial you must use the {@link InterstitalViewPortSizes}
 *
 * @example
 * window.bebopQueue.push(function (bebop) {
 *      var slot = bebop.defineSlot({
 *          gptDivId: "dfp-ad-leaderboard",
 *          adUnitPath: dfpNetworkID,
 *          targeting: {
 *              "pos": "top"
 *          },
 *          viewPortSizes: {
 *              large: [ [728, 90], [970, 66], [970, 90], [970, 250] ],
 *              small: [ [320, 50], [300, 50], [300, 100] ]
 *          }
 *      });
 *      if (slot.isActive()) {
 *          bebop.display(slot);
 *      }
 * });
 *
 * window.bebopQueue.push(function (bebop) {
 *      var slots = squib.defineSlots([
 *          {
 *              gptDivId: "dfp-ad-lazyload",
 *              adUnitPath: dfpNetworkID,
 *              targeting: {
 *                  "pos": "right3"
 *              },
 *              lazyload: true,
 *              defineOnDisplay: true,
 *              viewPortSizes: {
 *                  large: [ [300, 250], [300, 252] ],
 *                  small: [ [300, 50], [320, 50], [300, 100] ]
 *              }
 *          }, {
 *              gptDivId: "dfp-ad-interstitial",
 *              adUnitPath: dfpNetworkID,
 *              interstitial: true,
 *              targeting: {
 *                  "pos": ['interstitial']
 *              },
 *              viewPortSizes: ['large']
 *          }
 *      ]);
 *
 *      slots.forEach(function (slot) {
 *          if (slot.isActive() && !slot.isLazyLoad()) {
 *              bebop.display(slot);
 *          }
 *      });
 * });
 */
