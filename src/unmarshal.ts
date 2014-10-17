// An Unmarshaller takes a .pyc file (as a string of binarys, e.g. "\xXX") and
// converts into a Python code object.
import fs = require('fs');
import gLong = require("../lib/gLong");
// TODO: Write declaration file for decimal.js
import Decimal = require('../lib/decimal.js');

// Null is an empty value. Mostly used in the interpreter for dictionaries.
// Python has a single null object called "None".
class NullSingleton {
    private static _instance: NullSingleton;

    constructor() {
        if(NullSingleton._instance) {
            throw new Error("Null is already instantiated. Use get() instead.");
        }
        NullSingleton._instance = this;
    }

    public static get(): NullSingleton {
        if(NullSingleton._instance == null) {
            NullSingleton._instance = new NullSingleton();
            return NullSingleton._instance;
        }
    }

    toString(): string {
        return "None";
    }
}
var None = NullSingleton.get();

class Py_CodeObject {
    argcount: number;
    cellvars: string[];
    code: string;
    consts: any[];
    filename: string;
    firstlineno: number;
    flags: number;
    freevars: string[];
    lnotab: string;
    name: string;
    names: string[];
    nlocals: number;
    stacksize: number;
    varnames: string[];

    // Args are in marshal order
    constructor(argcount: number,
                nlocals: number,
                stacksize: number,
                flags: number,
                code: string,
                consts: any[],
                names: string[],
                varnames: string[],
                freevars: string[],
                cellvars: string[],
                filename: string,
                name: string,
                firstlineno: number,
                lnotab: string) {
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
}

class Complex64 {
    real: number;
    imag: number;

    constructor(r: number, j: number) {
        this.real = r;
        this.imag = j;
    }
}

class Unmarshaller {
    // How far we are into the buffer
    index: number;
    // The input from reading the file
    input: Buffer;
    // A "magic number" at the beginning of the pyc file.
    // Somehow related to the Python version.
    magicNumber: number;
    public static PYTHON_2_7_8_MAGIC: number = 0xf303;
    // Date of compilation
    date: Date;
    // The list of "interalized" strings
    internedStrs: string[];
    // The output of unmarshalling the .pyc file
    output;

    constructor(inputFilePath: string) {
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
    value() {
        if (this.output == null) {
            this.output = this.unmarshal();
        }
        return this.output;
    }

    // Reads a single character (1 byte, as string) from the input
    readChar(): string {
        var c = this.input.toString('ascii', this.index, this.index+1);
        this.index += 1;
        return c;
    }

    // Reads a single byte from the input
    // (Equivalent to readChar().charCodeAt(0))
    readByte(): number {
        var b = this.input.readUInt8(this.index);
        this.index += 1;
        return b;
    }

    // Read an unsigned short (used for grokking longs)
    readUInt16(): number {
        var s = this.input.readUInt16LE(this.index);
        this.index += 2;
        return s;
    }

    // // Reads a 4-byte integer from the input
    readInt32(): number {
        var i = this.input.readInt32LE(this.index);
        this.index += 4;
        return i;
    }

    // Reads a 64 bit integer
    readInt64(): gLong {
        var low = this.readInt32();
        var high = this.readInt32();
        return gLong.fromBits(low, high);
    }

    // Reads a 64-bit floating-pount number
    // WARNING: Javascript only supports double-precision floats.
    // Any numbers greater than 2**52 will be approximate at best
    // Refer to IEEE 754 for more detail.
    readFloat64(): number {
        var f = this.input.readDoubleLE(this.index);
        this.index += 8;
        return f;
    }

    readString(length: number, encoding = "ascii"): string {
        var s = this.input.toString("ascii", this.index, this.index+length);
        this.index += length;
        return s;
    }

    readUnicodeString(length: number): string {
        return this.readString(length, "utf8");
    }

    // Unmarshals the input string
    unmarshal() {
        var unit = this.readChar();
        var res: any;
        switch (unit) {
            // Constants
            case "N": // None
                res = None;
                break;
            case "F": // False
                res = false;
                break;
            case "S": // StopIteration Exception (TODO: double check this)
                throw new Error("StopIteration is pending investigation");
            case "T": // True
                res = true;
                break;
            case ".": // Ellipsis object (TODO: double check this)
                throw new Error("Ellipsis is not yet implemented");
                break;
            // Numbers
            case "g": // double-precision floating-point number
                res = this.readFloat64();
                break;
            case "i": // 32-bit integer (signed)
                res = this.readInt32();
                break;
            case "I": // 64-bit integer (signed)
                res = this.readInt64();
                break;
            case "l": // arbitrary precision integer
                // Stored as a 32-bit integer of length, then $length 16-bit
                // digits.
                var length = this.readInt32();
                res = new Decimal(0);
                if (length != 0) {
                    var shift = new Decimal(15);
                    for(var i = 0; i < Math.abs(length); i++) {
                        var digit = new Decimal(this.readUInt16());
                        res = res.plus(digit.times(
                                    Decimal.pow(2, shift.times(i))));
                    }
                }
                if (length < 0) {
                    res = res.times(-1);
                }
                break;
            case "y": // complex number
                res = new Complex64(this.readFloat64(), this.readFloat64());
                break;
            // Strings
            case "R": // Reference to interned string
                var index = this.readInt32();
                res = this.internedStrs[index];
                break;
            case "s": // plain string. length (int 32) + bytes
                var length = this.readInt32();
                res = this.readString(length);
                break;
            case "t": // interned string, stored in an array
                var length = this.readInt32();
                res = this.readString(length);
                this.internedStrs.push(res);
                break;
            case "u": // utf-8 string
                var length = this.readInt32();
                res = this.readUnicodeString(length);
                break;
            // Collections
            case "(": // tuple
            case "[": // list
                var length = this.readInt32();
                res = [];
                for (var x = 0; x < length; x++) {
                    res.push(this.unmarshal());
                }
                break;
            // Code Objects:
            case "c":
                var argc = this.readInt32();
                var nlocals = this.readInt32();
                var stacksize = this.readInt32();
                var flags = this.readInt32();
                var codestr: string = this.unmarshal();
                var consts: string[] = this.unmarshal();
                var names: string[] = this.unmarshal();
                var varnames: string[] = this.unmarshal();
                var freevars: string[] = this.unmarshal();
                var cellvars: string[] = this.unmarshal();
                var filename: string = this.unmarshal();
                var name: string = this.unmarshal();
                var firstlineno = this.readInt32();
                var lnotab: string = this.unmarshal();
                res = new Py_CodeObject(
                    argc, nlocals, stacksize, flags, codestr, consts,
                    names, varnames, freevars, cellvars, filename,
                    name, firstlineno, lnotab);
                break;

            default:
                console.log("Unsupported marshal format: " + unit + " @" +
                        this.index);
                throw new Error("Unsupported marshal format: " + unit)
        }
        return res;
    }
}

var u = new Unmarshaller("../examples/simpleadd.pyc");
var code: Py_CodeObject = u.value();
console.log(code);
code.consts.forEach(function(element, index, array) {
    console.log("\t" + index + ": " + element);
});
