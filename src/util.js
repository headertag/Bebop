'use strict';

/**
 * Depends on type
 *
 * type module.
 * @module util
 */

var type = require('./type');

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

function isEmptyObject(obj) {
    var prop;
    //? if (ASSERT_TYPE)
    enforceType(obj, 'object');

    for (prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            return false;
        }
    }
    return true;
}

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
