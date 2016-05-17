'use strict';

/**
 * util module test suite
 * =============================================================================
 */
var util = require('./../src/util');

function EmptyObject() {

}

function ObjectWithProp() {
    this.foo = 0;
}

describe('util test suite', function () {
    /**
     * enforceType Tests
     * =============================================================================
     */
    it('util.enforceType({}, "object") should not throw an Error)', function () {
        expect(util.enforceType.bind(null, {}, "object")).not.toThrow();
    });

    it('util.enforceType(function(){}, "function") should not throw an Error)', function () {
        expect(util.enforceType.bind(null, function(){}, "function")).not.toThrow();
    });

    it('util.enforceType(undefined, ["boolean", "undefined"]) should not throw an Error)', function () {
        var testArray = ["boolean", "undefined"],
            bound = util.enforceType.bind(null, undefined, testArray);
        expect(bound).not.toThrow();
    });

    it('util.enforceType([], "object") should throw an Error)', function () {
        expect(util.enforceType.bind(null, [], "object")).toThrow();
    });

    it('util.enforceType(null, "object") should throw an Error)', function () {
        expect(util.enforceType.bind(null, null, "object")).toThrow();
    });

    it('util.enforceType(undefined, "boolean") should throw an Error)', function () {
        var bound = util.enforceType.bind(null, undefined, "boolean");
        expect(bound).toThrow();
    });

    /**
     * isEmptyObject Tests
     * =============================================================================
     */
    it('util.isEmptyObject({}) to be true', function () {
        expect(util.isEmptyObject({})).toBe(true);
    });

    it('util.isEmptyObject({a:1}) to be false', function () {
        expect(util.isEmptyObject({a:1})).toBe(false);
    });

    it('util.isEmptyObject(new EmptyObject()) to be false', function () {
        expect(util.isEmptyObject(new EmptyObject())).toBe(true);
    });

    it('util.isEmptyObject(new ObjectWithProp()) to be false', function () {
        expect(util.isEmptyObject(new ObjectWithProp())).toBe(false);
    });

    it('util.isEmptyObject() to be false when parent has props but child does not', function () {
        var empty;
        EmptyObject.prototype = new ObjectWithProp();
        empty = new EmptyObject();
        expect(empty.foo).toEqual(0);
        expect(util.isEmptyObject(empty)).toBe(true);
    });

    /**
	 * hasProp Tests
	 * =============================================================================
	 */
    it('util.hasProp(new EmptyObject(), "hasOwnProperty") to be false', function () {
        expect(util.hasProp(new EmptyObject(), 'hasOwnProperty')).toBe(false);
    });

    it('util.hasProp(new EmptyObject(), "hasOwnProperty", true) to be true', function () {
        expect(util.hasProp(new EmptyObject(), 'hasOwnProperty', true)).toBe(true);
    });

    /**
     * foreachProp Tests
     * =============================================================================
     */



    /**
     * foreach Tests
     * =============================================================================
     */
    it('util.foreach([0,1], cb(value, i)) should loop 2 times, value & i should be 0 then 1', function () {
        var counter = 0;
        util.foreach([0,1], function (value, i) {
            expect(value === i && value === counter && i === counter).toBe(true);
            counter++;
        });
        expect(counter).toEqual(2);
    });

    it('util.foreach([0,1], cb, obj) should call cb with obj context', function () {
        var object = new ObjectWithProp();
        util.foreach([0,1], function () {
            expect(this.foo).toEqual(0);
        }, object);
    });

    it('util.foreach([0], ()=>{}, obj) should not call cb with obj context', function () {
        var object = new ObjectWithProp();
        util.foreach([0], () => expect(this.foo).toBe(undefined), object);
    });

    it('util.foreach(new Array(2), cb): returning undefined from cb should act as continue', function () {
        var counter = 0;
        util.foreach(new Array(2), function () {
            counter++;
            return undefined; // making the test explicit
        });
        expect(counter).toEqual(2);
    });

    it('util.foreach([0,1], cb): returning any type but undefined from cb should act as break returning the value', function () {
        var counter = 0,
            ret = util.foreach([0,1], function () {
                counter++;
                return null;
            });
        expect(counter).toEqual(1);
        expect(ret).toEqual(null);
    });

    it('util.foreach([0,1], cb): returning any type but undefined from cb should act as break returning the value', function () {
        var counter = 0,
            ret = util.foreach([0,1], function () {
                counter++;
                return true;
            });
        expect(counter).toEqual(1);
        expect(ret).toEqual(true);
    });

    /**
     * inArray Tests
     * =============================================================================
     */
    (function () {
        // util.inArray should pass all tests when Array.prototype.indexOf is not a function
        var indexOf = Array.prototype.indexOf;
        function precondition() {
            Array.prototype.indexOf = null;
        }
        function postcondition() {
            Array.prototype.indexOf = indexOf;
        }
        inArrayTests(precondition, postcondition);


        // util.inArray should pass all tests when Array.prototype.indexOf is a function
        inArrayTests(function () {}, function () {});
    }());
});

/**
 * inArray Test Suite
 * =============================================================================
 */
function inArrayTests(precondition, postcondition) {
    describe('inArray test', function () {

        beforeEach(precondition);
        afterEach(postcondition);

        it('util.inArray(1, [0,1]) should return true', function () {
            expect(util.inArray(1, [0,1])).toBe(true);
        });

        it('util.inArray(1, [1, 0]) should return true', function () {
            expect(util.inArray(1, [1,0])).toBe(true);
        });

        it('util.inArray(ftn, [0,ftn]) should return true', function () {
            var ftn = EmptyObject;
            expect(util.inArray(ftn, [0,ftn])).toBe(true);
        });

        it('util.inArray(ftn1, [0,ftn2]) should return false', function () {
            var ftn1 = new EmptyObject,
                ftn2 = new ObjectWithProp;
            expect(util.inArray(ftn1, [0,ftn2])).toBe(false);
        });

        it('util.inArray(obj1, [0,obj2]) should return false', function () {
            var obj1 = new EmptyObject(),
                obj2 = new ObjectWithProp();
            expect(util.inArray(obj1, [0,obj2])).toBe(false);
        });

        it('util.inArray(1, [0]) should return false', function () {
            expect(util.inArray(1, [])).toBe(false);
        });

        it('util.inArray(1, []) should return false', function () {
            expect(util.inArray(1, [])).toBe(false);
        });

        it('util.inArray("1", [1]) should return false', function () {
            expect(util.inArray("1", [1])).toBe(false);
        });

        it('util.inArray(1, ["1"]) should return false', function () {
            expect(util.inArray(1, ["1"])).toBe(false);
        });

        it('util.inArray(undefined, new Array(1)) should return true', function () {
            expect(util.inArray(undefined, new Array(1))).toBe(true);
        });
    });
};
