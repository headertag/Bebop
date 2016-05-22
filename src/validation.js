'use strict';

/**
 * @module private/validation
 *
 * @requires private/type
 * @requires private/util
 */

var util = require('./util'),
    type = require('./type'),
    errors = require('./errors');

/**
 * @param {any} test - The value to be tested.
 * @param {(string|Array.<string>)} types - A list of types to check.
 *
 * @throws If `test`'s type is not in `types`
 *
 * @example
 * validation.enforceType(true, 'boolean')
 * validation.enforceType(null, ['object', 'array']) // throws an Error
 */
function enforceType(test, types) {
    var msg, strTypes;
    if (!type.isOneOf(test, types)) {
        strTypes = type.isArray(types) ? types.join(', ') : types;
        msg = 'Expcted types: [' + strTypes + '] got: ' + type.getType(test);
        throw new errors.TypeMismatchError(msg);
    }
}

/**
 * For now this function just tests if `test` is a string,
 * better validation is required.
 *
 * @param {string} test - The string to be tested.
 *
 * @return {boolean} True if `adUnitPath` is a valid {@link AdUnitPath}
 */
function isValidAdUnitPath(test) {
    return type.isStr(test);
}

/**
 * Better validation is required.
 *
 * @param {(string|number)} test - The targeting key to be tested.
 * @param {Array.<string>} errors - if `test` is invalid an error message will be pushed to the array.
 *
 * @return {boolean} True if `test` is a valid targeting key.
 */
function isValidTargetingKey(test, errors) {
    if (!type.isStr(test)) {
        errors.push('targeting key ' + test + ' is not a string');
        return false;
    }
    return true;
}

/**
 * Better validation is required.
 *
 * @param {(string|number|Array<string|number>)} value - The targeting value to be tested.
 * @param {Array.<string>} errors - if `value` is invalid an error message will be pushed to the array.
 *
 * @return {boolean} True if `value` is a valid targeting key.
 */
function isValidTargetingValue(test, errors) {
    var msg = 'value: ' + test + ' is not a string or an array of strings',
        isValid = true;

    if (!type.isOneOf(test, ['string', 'number', 'array'])) {
        errors.push(msg);
        isValid = false;
    }

    if (type.isArray(test)) {
        isValid = util.foreach(test, function (target) {
            if (!type.isOneOf(target, ['string', 'number'])) {
                return false;
            }
        });

        if (isValid === false) {
            errors.push(msg);
        }
    }

    return isValid !== false;
}

/**
 * @param {*} test - The value to test.
 * @return {boolean} True if `test` is a {@link SingleSizeArray}
 */
function isSingleSizeArray(test) {
    if (!type.isArray(test) || test.length !== 2) {
        return false;
    }
    return type.isInt(test[0]) && type.isInt(test[1]);
}

/**
 * @param {*} test - The value to test.
 * @return {boolean} True if `test` is a {@link MultiSizeArray}
 */
function isMultiSizeArray(test) {
    var isValid;
    if (!type.isArray(test)) {
        return false;
    }
    isValid = util.foreach(test, function (element) {
        if (!isSingleSizeArray(element)) {
            return false;
        }
    });
    return isValid !== false;
}

module.exports = {
    enforceType: enforceType,
    isValidAdUnitPath: isValidAdUnitPath,
    isValidTargetingKey: isValidTargetingKey,
    isValidTargetingValue: isValidTargetingValue,
    isSingleSizeArray: isSingleSizeArray,
    isMultiSizeArray: isMultiSizeArray
};
