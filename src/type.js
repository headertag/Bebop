'use strict';

/**
 * type module.
 * @module type
 */

function isArray(test) {
    if (typeof Array.isArray === 'function') {
        return Array.isArray(test);
    }
    return Object.prototype.toString.call(test) === '[object Array]';
}

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

function isObj(test) {
    return type(test) === 'object';
}

function isStr(test) {
    return type(test) === 'string';
}

function isNum(test) {
    return type(test) === 'number';
}

function isInt(test) {
    return isNum(test) && (test | 0) === test;
}

function isFloat(test) {
    return isNum(test) && ((test | 0) !== test) &&
            // test for Infinities as they are not floats
            (((+test) + 1) !== test);
}

/**
 * Returns true for cases like: 1e1, 0, -0x1, "01", "0", "-Infinity"
 *
 * Limitations:
 *
 * From the Unary Plus section of:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Arithmetic_Operators
 *
 * "Negative numbers are supported (though not for hex).
 * If it cannot parse a particular value, it will evaluate to NaN."
 *
 * Examples:
 *  type.isNumeric("-0x1") -> false
 *  type.isNumeric(-0x1) -> true
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

function isFunc(test) {
    return type(test) === 'function';
}

function isBool(test) {
    return type(test) === 'boolean';
}

function isUndef(test) {
    return type(test) === 'undefined';
}

// just for completness
function isNull(test) {
    return test === null;
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
    getType: type
};
