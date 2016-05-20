'use strct';

/**
 * Unit tests for the type module
 * =============================================================================
 */
var type = require('./../src/type');

describe('type test suite', function () {
    /**
     * getType Tests
     * =============================================================================
     */
    it('type.getType(null) to equal "null"', function () {
        expect(type.getType(null)).toEqual('null');
    });

    it('type.getType([]) to equal "array"', function () {
        expect(type.getType([])).toEqual('array');
    });

    it('type.getType({}) to equal "object"', function () {
        expect(type.getType({})).toEqual('object');
    });

    it('type.getType(0) to equal "number"', function () {
        expect(type.getType(0)).toEqual('number');
    });

    it('type.getType(-0x1) to equal "number"', function () {
        expect(type.getType(-1)).toEqual('number');
    });

    it('type.getType(1e1) to equal "number"', function () {
        expect(type.getType(1)).toEqual('number');
    });

    it('type.getType(Infinity) to equal "number"', function () {
        expect(type.getType(Infinity)).toEqual('number');
    });

    it('type.getType(-Infinity) to equal "number"', function () {
        expect(type.getType(-Infinity)).toEqual('number');
    });

    it('type.getType(1.11e1) to equal "number"', function () {
        expect(type.getType(Math.PI)).toEqual('number');
    });

    it('type.getType(NaN) NOT to equal "number"', function () {
        expect(type.getType(NaN)).not.toEqual('number');
    });

    it('type.getType(NaN) to equal "NaN"', function () {
        expect(type.getType(NaN)).toEqual('NaN');
    });

    it('type.getType(false) to equal "boolean"', function () {
        expect(type.getType(false)).toEqual('boolean');
    });

    it('type.getType("") to equal "string"', function () {
        expect(type.getType("")).toEqual('string');
    });

    it('type.getType(function(){}) to equal "function"', function () {
        expect(type.getType(function(){})).toEqual('function');
    });

    it('type.getType(()=>{}) to equal "function"', function () {
        expect(type.getType(()=>{})).toEqual('function');
    });

    // commented out as this breaks in older versions of node, however this is a
    // valid test
    //it('type.getType(class {}) to equal "function"', function () {
    //    expect(type.getType(class {})).toEqual('function');
    //});

    it('type.getType() to equal "undefined"', function () {
        expect(type.getType()).toEqual('undefined');
    });

    /**
     * isArray Tests
     * =============================================================================
     */
    it('type.isArray([]) to be true', function () {
        expect(type.isArray([])).toBe(true);
    });

    it('type.isArray([1,2]) to be true', function () {
        expect(type.isArray([1,2])).toBe(true);
    });

    it('type.isArray({}) to be false', function () {
        expect(type.isArray({})).toBe(false);
    });

    it('type.isArray([]) to be true when Array.isArray is not a function', function () {
        var isArray = Array.isArray;
        Array.isArray = null;
        expect(type.isArray([])).toBe(true);
        Array.isArray = isArray;
    });

    it('type.isArray({}) to be false when Array.isArray is not a function', function () {
        var isArray = Array.isArray;
        Array.isArray = null;
        expect(type.isArray({})).toBe(false);
        Array.isArray = isArray;
    });

    /**
     * isObj Tests
     * =============================================================================
     */
    it('type.isObj({}) to be true', function () {
        expect(type.isObj({})).toBe(true);
    });

    it('type.isObj([]) to be false', function () {
        expect(type.isObj([])).toBe(false);
    });

    it('type.isObj(null) to be false', function () {
        expect(type.isObj(null)).toBe(false);
    });

    /**
     * isStr Tests
     * =============================================================================
     */
    it('type.isStr("") to be true', function () {
        expect(type.isStr("")).toBe(true);
    });

    /**
     * isNum Tests
     * =============================================================================
     */
    it('type.isNum(0) to be true', function () {
        expect(type.isNum(0)).toBe(true);
    });

    it('type.isNum(-0xdeadbeef) to be true', function () {
        expect(type.isNum(-0xdeadbeef)).toBe(true);
    });

    it('type.isNum(01) to be true', function () {
        expect(type.isNum(01)).toBe(true);
    });

    it('type.isNum(Infinity) to be true', function () {
        expect(type.isNum(Infinity)).toBe(true);
    });

    it('type.isNum(-Infinity) to be true', function () {
        expect(type.isNum(-Infinity)).toBe(true);
    });

    it('type.isNum(1e1) to be true', function () {
        expect(type.isNum(1e1)).toBe(true);
    });

    it('type.isNum(NaN) to be false', function () {
        expect(type.isNum(NaN)).toBe(false);
    });

    it('type.isNum("1") to be false', function () {
        expect(type.isNum("1")).toBe(false);
    });

    /**
     * isInt Tests
     * =============================================================================
     */
    it('type.isInt(0) to be true', function () {
        expect(type.isInt(0)).toBe(true);
    });

    it('type.isInt(01) to be true', function () {
        expect(type.isInt(01)).toBe(true);
    });

    it('type.isInt(-1e1) to be true', function () {
        expect(type.isInt(-1e1)).toBe(true);
    });

    it('type.isInt(0x1) to be true', function () {
        expect(type.isInt(0x1)).toBe(true);
    });

    it('type.isInt(Infinity) to be false', function () {
        expect(type.isInt(Infinity)).toBe(false);
    });

    it('type.isInt(-Infinity) to be false', function () {
        expect(type.isInt(-Infinity)).toBe(false);
    });

    it('type.isInt(1.0) to be true', function () {
        expect(type.isInt(1.0)).toBe(true); // GRRRRR
    });

    it('type.isInt(1.1) to be false', function () {
        expect(type.isInt(1.1)).toBe(false);
    });

    /**
     * isFloat Tests
     * =============================================================================
     */
    it('type.isFloat(0.1) to be true', function () {
        expect(type.isFloat(0.1)).toBe(true);
    });

    it('type.isFloat(1.11e1) to be true', function () {
        expect(type.isFloat(1.11e1)).toBe(true);
    });

    it('type.isFloat(-1.1) to be true', function () {
        expect(type.isFloat(-1.1)).toBe(true);
    });

    it('type.isFloat(Infinity) to be false', function () {
        expect(type.isFloat(Infinity)).toBe(false);
    });

    it('type.isFloat(-Infinity) to be false', function () {
        expect(type.isFloat(-Infinity)).toBe(false);
    });

    it('type.isFloat(1.0) to be false', function () {
        expect(type.isFloat(1.0)).toBe(false); // GRRRRR
    });

    it('type.isFloat(1) to be false', function () {
        expect(type.isFloat(1)).toBe(false);
    });

    /**
     * isNumeric Tests
     * =============================================================================
     */
    it('type.isNumeric(1.0) to be true', function () {
        expect(type.isNumeric(0.1)).toBe(true);
    });

    it('type.isNumeric(-1) to be true', function () {
        expect(type.isNumeric(-1)).toBe(true);
    });

    it('type.isNumeric("-1") to be true', function () {
        expect(type.isNumeric("-1")).toBe(true);
    });

    it('type.isNumeric(1.1) to be true', function () {
        expect(type.isNumeric(1.1)).toBe(true);
    });

    it('type.isNumeric("-1.1") to be true', function () {
        expect(type.isNumeric("-1.1")).toBe(true);
    });

    it('type.isNumeric(Infinity) to be true', function () {
        expect(type.isNumeric(Infinity)).toBe(true);
    });

    it('type.isNumeric("-Infinity") to be true', function () {
        expect(type.isNumeric("-Infinity")).toBe(true);
    });

    it('type.isNumeric("foo") to be false', function () {
        expect(type.isNumeric("foo")).toBe(false);
    });

    it('type.isNumeric("1e1") to be true', function () {
        expect(type.isNumeric("1e1")).toBe(true);
    });

    it('type.isNumeric("-1e1") to be true', function () {
        expect(type.isNumeric("-1e1")).toBe(true);
    });

    it('type.isNumeric("01") to be true', function () {
        expect(type.isNumeric("01")).toBe(true);
    });

    it('type.isNumeric("-01") to be true', function () {
        expect(type.isNumeric("-01")).toBe(true);
    });

    it('type.isNumeric("0x1") to be true', function () {
        expect(type.isNumeric("0x1")).toBe(true);
    });

    it('type.isNumeric("-0x1") to be false', function () {
        expect(type.isNumeric("-0x1")).toBe(false);
    });

    it('type.isNumeric(-0x1) to be true', function () {
        expect(type.isNumeric(-0x1)).toBe(true);
    });

    /**
     * isFunc Tests
     * =============================================================================
     */
    it('type.isFunc(function(){}) to be true', function () {
        expect(type.isFunc(function(){})).toBe(true);
    });

    it('type.isFunc(()=>{}) to be true', function () {
        expect(type.isFunc(()=>{})).toBe(true);
    });

    it('type.isFunc({}) to be false', function () {
        expect(type.isFunc({})).toBe(false);
    });

    /**
     * isBool Tests
     * =============================================================================
     */
    it('type.isBool(true) to be true', function () {
        expect(type.isBool(true)).toBe(true);
    });

    it('type.isBool(false) to be true', function () {
        expect(type.isBool(false)).toBe(true);
    });

    it('type.isBool(null) to be false', function () {
        expect(type.isBool(null)).toBe(false);
    });

    /**
     * isUndef Tests
     * =============================================================================
     */
    it('type.isUndef() to be true', function () {
        expect(type.isUndef()).toBe(true);
    });

    it('var foo; type.isUndef(foo); to be true', function () {
        var foo;
        expect(type.isUndef(foo)).toBe(true);
    });

    it('type.isUndef(null) to be false', function () {
        expect(type.isUndef(null)).toBe(false);
    });

    /**
     * isNull Tests
     * =============================================================================
     */
    it('type.isNull(null) to be false', function () {
        expect(type.isNull(null)).toBe(true);
    });

    it('type.isNull() to be false', function () {
        expect(type.isNull()).toBe(false);
    });

    it('var foo; type.isNull(foo); to be false', function () {
        var foo;
        expect(type.isNull(foo)).toBe(false);
    });

    it('type.isNull({}) to be false', function () {
        expect(type.isNull({})).toBe(false);
    });
});