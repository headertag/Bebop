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
 * A function to be called for each element in an array.
 *
 * @callback foreachCallback
 * @param {*} value The value of the entry being iterated over.
 * @param {number} index the ordinal position in the array
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
 * Key value pairs of targeting that is applied to the underlining {@link GPTSlot}
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
 * An array of {@link SingleSize}
 * @typedef {Array.<SingleSize>} MultipleSize
 */

/**
 * @callback GPTCallback
 * @param {GPTHandler} self - A reference to the GPTHandler object
 * @param {Object} tag - If headertag is enabled tag will be a reference to headertag, else it will reference {@link Googletag}
 */

/**
 * A SizeCategoryMap represents the sizes of a slot for 1 or more categories
 *
 * @typedef {Object} SizeCategoryMap
 * @property {(SingleSize|MultipleSize)} huge - The size(s) to be applied to this slot.
 * @property {(SingleSize|MultipleSize)} large - The size(s) to be applied to this slot.
 * @property {(SingleSize|MultipleSize)} medium - The size(s) to be applied to this slot.
 * @property {(SingleSize|MultipleSize)} small - The size(s) to be applied to this slot.
 * @property {(SingleSize|MultipleSize)} tiny - The size(s) to be applied to this slot.
 *
 * @example
 * {
 *      'huge'      :   [ [970, 250], [728, 90] ],
 *      'large'     :   [728, 90],
 *      'medium'    :   [320, 90],
 *      'small'     :   [300, 50],
 *      'tiny'      :   [200, 50]
 * }
 */

/**
 * @typedef {Array.<string>} InterstitalViewPortSizes
 * @example
 * // This array must contain 1 or more of the following sizes
 * viewPortSizes: ['huge', 'large', 'medium', 'small', 'tiny']
 */
