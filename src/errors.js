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
    this.name = 'InvaildStateError';
    this.message = msg;
    this.stack = (new Error()).stack;
    this.toString = function toString() {
        return this.message;
    };
}

InvaildStateError.prototype = Object.create(Error.prototype);
InvaildStateError.prototype.contructor = InvaildStateError;

/**
 * @class
 * @extends Error
 *
 * @param {string} msg - A message describing the error
 */
function TypeMismatchError(msg) {
    this.name = 'TypeMismatchError';
    this.message = msg;
    this.stack = (new Error()).stack;
    this.toString = function toString() {
        return this.message;
    };
}

InvaildStateError.prototype = Object.create(Error.prototype);
InvaildStateError.prototype.contructor = TypeMismatchError;

module.exports = {
    InvaildStateError: InvaildStateError,
    TypeMismatchError: TypeMismatchError
};
