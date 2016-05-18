'use strict';

/**
 * The util module is not a part of the public API
 *
 * @module util
 */

var type = require('./type');

/**
 * @param {any} test The value to be tested
 * @param {(string|Array.<string>)} types A list of types to check.
 *
 * @throws If test's type is not in types
 *
 * @example
 * util.enforceType(true, 'boolean')
 * util.enforceType(null, ['object', 'array']) // throws an Error
 */
function enforceType(test, types) {
    var testType = type.getType(test), msg, i, len;

    types = type.isArray(types) ? types : [types];

    if (type.isFunc(types.indexOf) && types.indexOf(testType) > -1) {
        return;
    }

    for (i = 0, len = types.length; i < len; i++) {
        if (testType === types[i]) {
            return;
        }
    }

    msg = 'Expcted types: [' + types.join(', ') + '] got: ' + testType;
    throw new Error(msg);
}

/**
 * @param {Object} object The object to check.
 * @return {boolean} true if object is empty, false otherwise
 */
function isEmptyObject(object) {
    var prop;
    //? if (ASSERT_TYPE)
    enforceType(object, 'object');

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
    //? if (ASSERT_TYPE) {
    enforceType(object, 'object');
    // object properties can be initalized with numbers
    // like {Infinity:1}, {0:1} and even {1.1:1}, negitive leterals are not allowed
    enforceType(property, ['string', 'number']);
    enforceType(checkParents, ['boolean', 'undefined']);
    //? }

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
 * var sizeCatagory = util.foreachProp(viewCatagories, function (catagory, size) {
 *     if (768 >= size) {
 *         return catagory;
 *     }
 * });
 */
function foreachProp(object, callback, thisArg, checkParents) {
    var prop, ret;
    //? if (ASSERT_TYPE) {
    enforceType(object, 'object');
    enforceType(callback, 'function');
    enforceType(thisArg, ['object', 'null', 'undefined']);
    enforceType(checkParents, ['boolean', 'undefined']);
    //? }
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
 * foreach will stop iterating over the array and return that value.
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
    var i, len, ret;
    //? if (ASSERT_TYPE) {
    enforceType(array, 'array');
    enforceType(callback, 'function');
    enforceType(thisArg, ['object', 'undefined']);
    //? }
    for (i = 0, len = array.length; i < len; i++) {
        ret = callback.call(thisArg, array[i], i);
        if (!type.isUndef(ret)) {
            return ret;
        }
    }
}

/**
 * Returns trus if needle is in haystack. All equality comparisons are done with ===
 *
 * @param {*} needle The value to search for.
 * @param {Array.<*>} haystack The array to search in.
 * @return {boolean} true if needle is in heystack, false otherwise
 */
function inArray(needle, heystack) {
    var ret;

    //? if (ASSERT_TYPE)
    enforceType(heystack, 'array');

    if (type.isFunc(heystack.indexOf) && !type.isUndef(needle)) {
        return heystack.indexOf(needle) > -1;
    }

    ret = foreach(heystack, function (e) {
        if (e === needle) {
            return true;
        }
    });
    return ret === true;
}

/**
 * @private
 */
function invalidStateError(errors) {
    var msg;
    //? if (ASSERT_TYPE)
    enforceType(errors, ['array', 'string']);
    if (type.isArray(errors)) {
        msg = errors.join('\n');
    }
    else {
        msg = errors;
    }
    throw new Error(msg);
}

module.exports = {
    enforceType: enforceType,
    isEmptyObject: isEmptyObject,
    hasProp: hasProp,
    foreachProp: foreachProp,
    foreach: foreach,
    inArray: inArray,
    invalidStateError: invalidStateError
};
