'use strict';

/**
 * The type module is not part of the Bebop public API
 * @module private/type
 */

/**
 * @param {any} test The value to be tested.
 *
 * @return {boolean} true if test is an array, false otherwise.
 */
function isArray(test) {
    if (typeof Array.isArray === 'function') {
        return Array.isArray(test);
    }
    return Object.prototype.toString.call(test) === '[object Array]';
}

/**
 * Returns the string value of the type.
 * If test is null, "null" is returned
 * If test is an array, "array" is returned
 * If test is NaN, "NaN" is returned
 *
 * @function getType
 *
 * @return {string} The lower case name of the type.
 */
function type(test) {
    var theType;
    if (test === null) {
        return 'null';
    }
    theType = typeof test;
    switch (theType) {
        case 'object':
            return isArray(test) ? 'array' : 'object';
        case 'number':
            return isNaN(test) ? 'NaN' : 'number';
    }
    return theType;
}

/**
 * @param {any} test The value to be tested.
 *
 * @return {boolean} true if test is a, false otherwise.
 */
function isObj(test) {
    return type(test) === 'object';
}

/**
 * @param {any} test The value to be tested.
 *
 * @return {boolean} true if test is a string, false otherwise.
 */
function isStr(test) {
    return type(test) === 'string';
}

/**
 * @param {any} test The value to be tested.
 *
 * @return {boolean} true if test is a number, false otherwise.
 */
function isNum(test) {
    return type(test) === 'number';
}

/**
 * @param {any} test The value to be tested.
 *
 * @return {boolean} true if test is an Integer, false otherwise.
 */
function isInt(test) {
    return isNum(test) && (test | 0) === test;
}

/**
 * @param {any} test The value to be tested.
 *
 * @return {boolean} true if test is a float
 */
function isFloat(test) {
    return isNum(test) && ((test | 0) !== test) &&
            // test for Infinities as they are not floats
            (((+test) + 1) !== test);
}

/**
 * Returns true if test is a number or a numeric string.
 *
 * @example
 * type.isNumeric("-0x1") -> false
 * type.isNumeric(-0x1) -> true
 * type.isNumeric(1e1) -> true
 * type.isNumeric("-011e1") -> true
 *
 * @param {any} test The value to be tested.
 *
 * @return {boolean} true if test is numeric, false otherwise.
 */
function isNumeric(test) {
    if (isNum(test)) {
        return true;
    }
    if (isStr(test)) {
        return type(+test) === 'number';
    }
    return false;
}

/**
 * @param {any} test The value to be tested.
 *
 * @return {boolean} true if test is a function, false otherwise.
 */
function isFunc(test) {
    return type(test) === 'function';
}

/**
 * @param {any} test The value to be tested.
 *
 * @return {boolean} true if test is a boolean, false otherwise.
 */
function isBool(test) {
    return type(test) === 'boolean';
}

/**
 * @param {any} test The value to be tested.
 *
 * @return {boolean} true if test is undefined, false otherwise.
 */
function isUndef(test) {
    return type(test) === 'undefined';
}

// just for completeness
/**
 * @param {any} test The value to be tested.
 *
 * @return {boolean} true if test is null, false otherwise.
 */
function isNull(test) {
    return test === null;
}

/**
 * @param {any} test - The value to be tested
 * @param {(string|Array.<string>)} types - A list of types to check.
 *
 * @return {boolean}
 */
function isOneOf(test, types) {
    var testType = type(test), i, len;

    types = isArray(types) ? types : [types];

    if (isFunc(types.indexOf) && types.indexOf(testType) > -1) {
        return true;
    }

    for (i = 0, len = types.length; i < len; i++) {
        if (testType === types[i]) {
            return true;
        }
    }
    return false;
}

module.exports = {
    isArray: isArray,
    isObj: isObj,
    isStr: isStr,
    isNum: isNum,
    isInt: isInt,
    isFloat: isFloat,
    isNumeric: isNumeric,
    isFunc: isFunc,
    isBool: isBool,
    isUndef: isUndef,
    isNull: isNull,
    isOneOf: isOneOf,
    getType: type
};
