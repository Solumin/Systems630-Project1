// An Unmarshaller takes a .pyc file (as a string of binarys, e.g. "\xXX") and
// converts into a Python code object.
var fs = require('fs');

class Unmarshaller {
    // How far we are into the buffer
    index: number;
    // The input from reading the file
    input: Buffer;
    // A "magic number" at the beginning of the pyc file.
    // Somehow related to the Python version.
    // TODO: Use to check if invalid/old/new .pyc file?
    magicNumber: number;
    // Date of compilation
    date: Date;
    // The output of unmarshalling the .pyc file
    output;

    constructor(inputFilePath: string) {
        // We read the first 8 bytes to get the magic number and the date
        this.index = 8;
        // For testing purposes, this is synchronous
        // TODO: Replace with BrowserFS call
        this.input = fs.readFileSync(inputFilePath);
        this.magicNumber = this.input.readUInt16LE(0);
        // Python marshals the date in seconds -- see time.localtime in the
        // Python stdlib.
        // Javascript takes the date in milliseconds. Thus, 1000*time.
        this.date = new Date(1000 * this.input.readUInt32LE(4));
    }

    // Processes the input string
    value(): string {
        this.output = this.unmarshal();
        return this.output;
    }

    // // Reads a single character (1 byte, as string) from the input
    readChar(): string {
        var c = this.input.toString('ascii', this.index,this.index+1);
        this.index += 1;
        return c;
    }

    // // Reads a single byte from the input
    // (Equivalent to readChar().charCodeAt(0))
    readByte(): number {
        var b = this.input.readUInt8(this.index);
        this.index += 1;
        return b;
    }

    // // Reads a 4-byte integer from the input
    readInt32(): number {
        var i = this.input.readInt32(this.index);
        this.index += 4;
        return i;
    }

    // Reads a 64 bit integer
    // TODO: Check out gLong library (see Doppio's typescript implementation)
    // readInt64(): number {
    //     var i0 = this.readInt32();
    //     var i1 = this.readInt32();
    //     return (i1 * Math.pow(2, 32)) + i0;
    // }

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
    // Not yet implemented.
    unmarshal() {
        var unit = this.readChar();
        var res;
        switch (unit) {
            // Constants
            case "0": // Null
            case "F": // False
            case "N": // None
            case "S": // StopIteration Exception (TODO: double check this)
            case "T": // True
            case ".": // Ellipsis object (TODO: double check this)
                break;
            // Numbers
            // case "f": // "old" marshal-format float
            case "g": // double-precision floating-point number
                res = this.readFloat64();
                break;
            case "i": // 32-bit integer (signed)
                res = this.readInt32();
                break;
            case "I": // 64-bit integer (signed)
            case "l": // 32-bit long (unsigned integer?)
                res = this.readInt32();
                break;
            // case "x": // "old" marshal-format complex
            case "y": // complex number
                break;
            // Strings
            case "R": // Reference to interned string
            case "s": // plain string. length (int 32) + bytes
                var length = this.readInt32();
                res = this.readString(length);
                break;
            case "t": // interned string, stored in an array
            case "u": // utf-8 string
                var length = this.readInt32();
                res = this.readUnicodeString(length);
                break;
            // Collections
            case "(": // tuple
            case "[": // list
                // Now built-in classes, not types:
            // case "{": dictionary
            // case "<": set
            // case ">": frozenset
                break;                
            // Code Objects:
            case "c":
                break;
        }
        return res;
    }
}

var u = new Unmarshaller("test.pyc")
