'use strict';

//? include("./macros.ms");

/**
 * The util module is not a part of the public API
 *
 * @module private/util
 *
 * @requires private/type
 */

var type = require('./type');

/**
 * @param {Object} object The object to check.
 * @return {boolean} true if object is empty, false otherwise
 */
function isEmptyObject(object) {
    //? ASSERT_TYPE('object', "'object'");

    var prop;

    for (prop in object) {
        if (object.hasOwnProperty(prop)) {
            return false;
        }
    }
    return true;
}

/**
 * @param {Object} object The Object to check.
 * @param {(string|number)} property The property to look for.
 * @param {boolean} [checkParents=false] If true check the parent object, if false only check object.
 *
 * @return {boolean} true if the Object contains the property
 */
function hasProp(object, property, checkParents) {

    // object properties can be initialized with numbers
    // like {Infinity:1}, {0:1} and even {1.1:1}, negative literals are not allowed

    //? ASSERT_TYPE('object', "'object'");
    //? ASSERT_TYPE('property', "['string', 'number']");
    //? ASSERT_TYPE('checkParents', "['boolean', 'undefined']");

    checkParents = type.isBool(checkParents) ? checkParents : false;

    if (checkParents) {
        return !type.isUndef(object[property]);
    }
    return object.hasOwnProperty(property);
}

/**
 * Iterates over each key and value in an object
 *
 * The callback may return any value besides undefined, if this happens
 * foreachProp will stop iterating over the object and return that value
 *
 * @param {Object} object
 * @param {foreachPropCallback} callback This function will be called for key value pair in the object.
 * @param {Object?} [thisArg=window] Value to use as this when executing callback. Default value is the Window object.
 * @param {boolean} [checkParents=false] If true iterate over parent object properties, if
 * false only iterate over properties in object.
 *
 * @example
 * var sizeCategory = util.foreachProp(viewCatagories, function (category, size) {
 *     if (768 >= size) {
 *         return category;
 *     }
 * });
 */
function foreachProp(object, callback, thisArg, checkParents) {
    //? ASSERT_TYPE('object', "'object'");
    //? ASSERT_TYPE('callback', "'function'");
    //? ASSERT_TYPE('thisArg', "['object', 'null', 'undefined']");
    //? ASSERT_TYPE('checkParents', "['boolean', 'undefined']");

    var prop, ret;

    checkParents = type.isBool(checkParents) ? checkParents : false;

    for (prop in object) {
        if (checkParents || hasProp(object, prop)) {
            ret = callback.call(thisArg, prop, object[prop], object);
            if (!type.isUndef(ret)) {
                return ret;
            }
        }
    }
}

/**
 * Iterates over each entry in an array
 *
 * The callback may return any value besides undefined, if this happens
 * for each will stop iterating over the array and return that value.
 *
 * @param {Array.<*>} array
 * @param {foreachCallback} callback This function will be called for each element of the array.
 * @param {Object} [thisArg=window] Value to use as this when executing callback. Default value is the Window object.
 *
 * @example
 * var inArray = util.foreach(array, function (element, i) {
 *     if (42 === element) {
 *         return true;
 *     }
 * });
 */
function foreach(array, callback, thisArg) {
    //? ASSERT_TYPE('array', "'array'");
    //? ASSERT_TYPE('callback', "'function'");
    //? ASSERT_TYPE('thisArg', "['object', 'undefined']");

    var i, len, ret;

    for (i = 0, len = array.length; i < len; i++) {
        ret = callback.call(thisArg, array[i], i);
        if (!type.isUndef(ret)) {
            return ret;
        }
    }
}

/**
 * Returns true if needle is in haystack. All equality comparisons are done with ===
 *
 * @param {*} needle The value to search for.
 * @param {Array.<*>} haystack The array to search in.
 * @return {boolean} true if needle is in haystack, false otherwise
 */
function inArray(needle, haystack) {
    //? ASSERT_TYPE('haystack', "'array'");

    var ret;

    if (type.isFunc(haystack.indexOf) && !type.isUndef(needle)) {
        return haystack.indexOf(needle) > -1;
    }

    ret = foreach(haystack, function (e) {
        if (e === needle) {
            return true;
        }
    });

    return ret === true;
}

module.exports = {
    isEmptyObject: isEmptyObject,
    hasProp: hasProp,
    foreachProp: foreachProp,
    foreach: foreach,
    inArray: inArray
};
