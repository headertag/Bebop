'use strict';

var validation = require('./../src/validation');

describe('Slot Test Suite', function () {
    /**
     * enforceType Tests
     * =============================================================================
     */
    it('validation.enforceType({}, "object") should not throw an Error)', function () {
        expect(validation.enforceType.bind(null, {}, "object")).not.toThrow();
    });

    it('validation.enforceType(function(){}, "function") should not throw an Error)', function () {
        expect(validation.enforceType.bind(null, function(){}, "function")).not.toThrow();
    });

    it('validation.enforceType(undefined, ["boolean", "undefined"]) should not throw an Error)', function () {
        var testArray = ["boolean", "undefined"],
            bound = validation.enforceType.bind(null, undefined, testArray);
        expect(bound).not.toThrow();
    });

    it('validation.enforceType([], "object") should throw an Error)', function () {
        expect(validation.enforceType.bind(null, [], "object")).toThrow();
    });

    it('validation.enforceType(null, "object") should throw an Error)', function () {
        expect(validation.enforceType.bind(null, null, "object")).toThrow();
    });

    it('validation.enforceType(undefined, "boolean") should throw an Error)', function () {
        var bound = validation.enforceType.bind(null, undefined, "boolean");
        expect(bound).toThrow();
    });
});