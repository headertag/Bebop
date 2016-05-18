/**
 * A function to be called for each entry in an Object.
 *
 * @callback foreachPropCallback
 * @param {string} prop The property name of the entry being iterated over.
 * @param {*} value The value of the entry being iterated over.
 * @param {Object} object A reference to the object being iterated over.
 *
 * @return {(*|undefined)}
 */

/**
 * A function to be called for each elemnt in an annya.
 *
 * @callback foreachCallback
 * @param {*} value The value of the entry being iterated over.
 * @param {number} index the oridinal position in the array
 *
 * @return {(*|undefined)}
 */

/**
 * A GPTSlot is any slot that has been created by calling
 * googletag.defineSlot or googletag.defineOutOfPageSlot
 *
 * @typedef {Object} GPTSlot
 */

/**
 * A key value pairs of targeting the is applyed to the underlining
 * GPTSLot
 *
 * @typedef {Object} TargetingMap
 */

/**
 * @typedef {Object} Googletag
 */

/**
 * The ID of a div that is used to render a creative.
 * @typedef {string} GPTDivId
 */

/**
 * Full path of the ad unit with the network code and unit name
 * @typedef {string} AdUnitPath
 */

/**
 * Array of two numbers representing [width, height].
 * @typedef {Array.<number>} SingleSize
 */

/**
 * Array of two numbers representing [width, height].
 * @typedef {Array.<number>} SingleSize
 */

/**
 * An array of {@link SingleSize}
 * @typedef {Array.<SingleSize>} MultipleSize
 */

/**
 * @callback GPTCallback
 * @param {GPTHandler} self - A refernce to the GPTHandler object
 * @param {Object} tag - If headertag is enabled tag will be a reference to headertag, else it will reference {@link Googletag}
 */
