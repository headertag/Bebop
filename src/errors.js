'use strict';

/**
 * @module public/errors
 */

/**
 * @class
 * @extends Error
 *
 * @param {string} msg - A message describing the error
 */
function InvaildStateError(msg) {
    Error.apply(this, msg);
}

InvaildStateError.prototype = Error.prototype;
InvaildStateError.prototype.contructor = InvaildStateError;

/**
 * @class
 * @extends Error
 *
 * @param {string} msg - A message describing the error
 */
function TypeMismatchError(msg) {
    Error.apply(this, msg);
}

InvaildStateError.prototype = Error.prototype;
InvaildStateError.prototype.contructor = InvaildStateError;

module.exports = {
    InvaildStateError: InvaildStateError,
    TypeMismatchError: TypeMismatchError
};
