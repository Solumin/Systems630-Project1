/// <reference path="../lib/node.d.ts" />
// An Unmarshaller takes a .pyc file (as a string of binarys, e.g. "\xXX") and
// converts into a Python code object.
var fs = require('fs');
var gLong = require("../lib/gLong");
// TODO: Write declaration file for decimal.js
var Decimal = require('../lib/decimal');
// Null is an empty value. Mostly used in the interpreter for dictionaries.
// Python has a single null object called "None".
var NullSingleton = (function () {
    function NullSingleton() {
        if (NullSingleton._instance) {
            throw new Error("Null is already instantiated. Use get() instead.");
        }
        NullSingleton._instance = this;
    }
    NullSingleton.get = function () {
        if (NullSingleton._instance == null) {
            NullSingleton._instance = new NullSingleton();
            return NullSingleton._instance;
        }
    };
    NullSingleton.prototype.toString = function () {
        return "None";
    };
    return NullSingleton;
})();
var None = NullSingleton.get();
var Py_CodeObject = (function () {
    // Args are in marshal order
    function Py_CodeObject(argcount, nlocals, stacksize, flags, code, consts, names, varnames, freevars, cellvars, filename, name, firstlineno, lnotab) {
        this.argcount = argcount;
        this.cellvars = cellvars;
        this.code = code;
        this.consts = consts;
        this.filename = filename;
        this.firstlineno = firstlineno;
        this.flags = flags;
        this.freevars = freevars;
        this.lnotab = lnotab;
        this.name = name;
        this.names = names;
        this.nlocals = nlocals;
        this.stacksize = stacksize;
        this.varnames = varnames;
    }
    return Py_CodeObject;
})();
var Complex64 = (function () {
    function Complex64(r, j) {
        this.real = r;
        this.imag = j;
    }
    return Complex64;
})();
var Unmarshaller = (function () {
    function Unmarshaller(inputFilePath) {
        // Initialize values
        this.internedStrs = [];
        // For testing purposes, this is synchronous
        // TODO: Replace with BrowserFS call
        this.input = fs.readFileSync(inputFilePath);
        this.magicNumber = this.input.readUInt16LE(0);
        if (this.magicNumber != Unmarshaller.PYTHON_2_7_8_MAGIC) {
            throw new Error("Unsupported Python version.");
        }
        // Python marshals the date in seconds -- see time.localtime in the
        // Python stdlib.
        // Javascript takes the date in milliseconds. Thus, 1000*time.
        this.date = new Date(1000 * this.input.readUInt32LE(4));
        // We read the first 8 bytes to get the magic number and the date
        this.index = 8;
    }
    // Processes the input string
    Unmarshaller.prototype.value = function () {
        if (this.output == null) {
            this.output = this.unmarshal();
        }
        return this.output;
    };
    // Reads a single character (1 byte, as string) from the input
    Unmarshaller.prototype.readChar = function () {
        var c = this.input.toString('ascii', this.index, this.index + 1);
        this.index += 1;
        return c;
    };
    // Reads a single byte from the input
    // (Equivalent to readChar().charCodeAt(0))
    Unmarshaller.prototype.readByte = function () {
        var b = this.input.readUInt8(this.index);
        this.index += 1;
        return b;
    };
    // Read an unsigned short (used for grokking longs)
    Unmarshaller.prototype.readUInt16 = function () {
        var s = this.input.readUInt16LE(this.index);
        this.index += 2;
        return s;
    };
    // // Reads a 4-byte integer from the input
    Unmarshaller.prototype.readInt32 = function () {
        var i = this.input.readInt32LE(this.index);
        this.index += 4;
        return i;
    };
    // Reads a 64 bit integer
    Unmarshaller.prototype.readInt64 = function () {
        var low = this.readInt32();
        var high = this.readInt32();
        return gLong.fromBits(low, high);
    };
    // Reads a 64-bit floating-pount number
    // WARNING: Javascript only supports double-precision floats.
    // Any numbers greater than 2**52 will be approximate at best
    // Refer to IEEE 754 for more detail.
    Unmarshaller.prototype.readFloat64 = function () {
        var f = this.input.readDoubleLE(this.index);
        this.index += 8;
        return f;
    };
    Unmarshaller.prototype.readString = function (length, encoding) {
        if (encoding === void 0) { encoding = "ascii"; }
        var s = this.input.toString("ascii", this.index, this.index + length);
        this.index += length;
        return s;
    };
    Unmarshaller.prototype.readUnicodeString = function (length) {
        return this.readString(length, "utf8");
    };
    // Unmarshals the input string
    Unmarshaller.prototype.unmarshal = function () {
        var unit = this.readChar();
        var res;
        switch (unit) {
            case "N":
                res = None;
                break;
            case "F":
                res = false;
                break;
            case "S":
                throw new Error("StopIteration is pending investigation");
            case "T":
                res = true;
                break;
            case ".":
                throw new Error("Ellipsis is not yet implemented");
                break;
            case "g":
                res = this.readFloat64();
                break;
            case "i":
                res = this.readInt32();
                break;
            case "I":
                res = this.readInt64();
                break;
            case "l":
                // Stored as a 32-bit integer of length, then $length 16-bit
                // digits.
                var length = this.readInt32();
                res = new Decimal(0);
                if (length != 0) {
                    var shift = new Decimal(15);
                    for (var i = 0; i < Math.abs(length); i++) {
                        var digit = new Decimal(this.readUInt16());
                        res = res.plus(digit.times(Decimal.pow(2, shift.times(i))));
                    }
                }
                if (length < 0) {
                    res = res.times(-1);
                }
                break;
            case "y":
                res = new Complex64(this.readFloat64(), this.readFloat64());
                break;
            case "R":
                var index = this.readInt32();
                res = this.internedStrs[index];
                break;
            case "s":
                var length = this.readInt32();
                res = this.readString(length);
                break;
            case "t":
                var length = this.readInt32();
                res = this.readString(length);
                this.internedStrs.push(res);
                break;
            case "u":
                var length = this.readInt32();
                res = this.readUnicodeString(length);
                break;
            case "(":
            case "[":
                var length = this.readInt32();
                res = [];
                for (var x = 0; x < length; x++) {
                    res.push(this.unmarshal());
                }
                break;
            case "c":
                var argc = this.readInt32();
                var nlocals = this.readInt32();
                var stacksize = this.readInt32();
                var flags = this.readInt32();
                var codestr = this.unmarshal();
                var consts = this.unmarshal();
                var names = this.unmarshal();
                var varnames = this.unmarshal();
                var freevars = this.unmarshal();
                var cellvars = this.unmarshal();
                var filename = this.unmarshal();
                var name = this.unmarshal();
                var firstlineno = this.readInt32();
                var lnotab = this.unmarshal();
                res = new Py_CodeObject(argc, nlocals, stacksize, flags, codestr, consts, names, varnames, freevars, cellvars, filename, name, firstlineno, lnotab);
                break;
            default:
                console.log("Unsupported marshal format: " + unit + " @" + this.index);
                throw new Error("Unsupported marshal format: " + unit);
        }
        return res;
    };
    Unmarshaller.PYTHON_2_7_8_MAGIC = 0xf303;
    return Unmarshaller;
})();
var u = new Unmarshaller("../examples_pyc/5code.pyc");
var code = u.value();
console.log(code);
code.consts.forEach(function (element, index, array) {
    console.log("\t" + index + ": " + element);
});
