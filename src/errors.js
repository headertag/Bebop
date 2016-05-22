'use strict';

/**
 * @module public/errors
 */

/**
 * @class
 */
function InvaildStateError(msg) {
    Error.apply(this, msg);
}

InvaildStateError.prototype = Error.prototype;
InvaildStateError.prototype.contructor = InvaildStateError;

/**
 * @class
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
