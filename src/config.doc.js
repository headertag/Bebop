/**
 * @module config
 */

/**
 * The window.bebopConfig object must exist in global scope before Bebop itself is loaded
 *
 * @typedef {Object} BebopConfig
 *
 * @property {HeadertagConfig?} headertag - If present in the configuration this informs Bebop to pass slot objects to headertag before calling display.
 * @property {GPTConfig?} gpt - This optioanl parameter informs Bebop of the page's googletag configuration.
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
 *          'medium'    : 0
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
 * Only one size catagory is required
 *
 * @typedef {Object} ViewPortConfig
 *
 * @property {function} getViewPortWidth - A function that returns the view port width
 * @property {number?} huge - If the view port width is >= this value, the huge catagory will be active
 * @property {number?} large - If the view port width is >= this value, the large catagory will be active
 * @property {number?} medium - If the view port width is >= this value, the medium catagory will be active
 * @property {number?} small - If the view port width is >= this value, the small catagory will be active
 * @property {number?} tiny - If the view port width is >= this value, the tiny catagory will be active
 *
 * @example
 * // An example where all size catagories are defined
 * viewPort: {
 *      getViewPortWidth: funtion () {
 *          return window.document.documentElement.clientWidth;
 *      },
 *      huge: 1200
 *      large: 800,
 *      medium: 600,
 *      small: 400,
 *      tiny: 0
 * }
 * // An example where only one size catagory is defined
 * viewPort: {
 *      getViewPortWidth: function () {
 *          return window.document.documentElement.clientWidth;
 *      },
 *      medium: 0
 * }
 */
