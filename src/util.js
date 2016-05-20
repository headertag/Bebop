'use strict';

/**
 * The util module is not a part of the public API
 *
 * @module private/util
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
    var msg, strTypes;
    if (!type.isOneOf(test, types)) {
        strTypes = type.isArray(types) ? types.join(', ') : types;
        msg = 'Expcted types: [' + strTypes + '] got: ' + type.getType(test);
        throw new Error(msg);
    }
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

function isValidAdUnitPath(adUnitPath) {
    //return new RegExp('^/\d+[/.*]+').test(adUnitPath);
    return type.isStr(adUnitPath);
}

function validateTargetingKey(key, errors) {
    // I can't find any documentation in support of these constraints
    // for now I will just go by the documentation found here:
    // https://developers.google.com/doubleclick-gpt/reference#googletag.Slot_setTargeting

    /*var keyStartChar = new RegExp(/^([0-9]).+/),
        keyPatValChar = new RegExp(/("|'|=|!|\+|#|\*|~|;|\^|\(|\)|<|>|\[|\]|,|&| )/),
        isValid = true;

    if (keyStartChar.test(key)) {
        errors.push('targeting key ' + key + ' starts with a number');
        isValid = false;
    }

    if (keyPatValChar.test(key)) {
        errors.push('targeting key ' + key + ' contains invalid characters');
        isValid = false;
    }

    if (key.length > 20) {
        errors.push('targeting key ' + key + ' exceeds max key length of 20 characters');
        isValid = false;
    }

    return isValid;*/

    if (!type.isStr(key)) {
        errors.push('targeting key ' + key + ' is not a string');
    }
}

function validateTargetingValue(value, errors) {
    // I can't find any documentation in support of these constraints
    // for now I will just go by the documentation found here:
    // https://developers.google.com/doubleclick-gpt/reference#googletag.Slot_setTargeting

    /*
    var valPat = new RegExp(/("|'|=|!|\+|#|\*|~|;|\^|\(|\)|<|>|\[|\]|&)/);


    if (!type.isOneOf(value, ['string', 'array'])) {
        value = String(value);
    }

    value = type.isArray(value) ? value : [value];

    foreach(value, function (v) {
        if (valPat.test(v)) {
            errors.push('Invalid targeting value, value has invalid characters');
        }

        if (v.length > 40) {
            errors.push('Invalid targeting value, value exceeds 40 characters');
        }
    });
    */

    var msg = 'value: ' + value + ' is not a string or an array of strings',
        isValid;

    if (!type.isOneOf(value, ['string', 'array'])) {
        errors.push(msg);
        return;
    }

    if (type.isArray(value)) {
        isValid = foreach(value, function (target) {
            if (!type.isStr(target)) {
                return false;
            }
        });

        if (isValid === false) {
            errors.push(msg);
        }
    }
}

function isSingleSizeArray(test) {
    if (!type.isArray(test) || test.length !== 2) {
        return false;
    }
    return type.isInt(test[0]) && type.isInt(test[1]);
}

function isMultiSizeArray(test) {
    var isValid;
    if (!type.isArray(test)) {
        return false;
    }
    isValid = foreach(test, function (element) {
        if (!isSingleSizeArray(element)) {
            return false;
        }
    });
    return isValid !== false;
}

module.exports = {
    enforceType: enforceType,
    isEmptyObject: isEmptyObject,
    hasProp: hasProp,
    foreachProp: foreachProp,
    foreach: foreach,
    inArray: inArray,
    invalidStateError: invalidStateError,
    isValidAdUnitPath: isValidAdUnitPath,
    isSingleSizeArray: isSingleSizeArray,
    isMultiSizeArray: isMultiSizeArray,
    validateTargetingKey: validateTargetingKey,
    validateTargetingValue: validateTargetingValue
};
