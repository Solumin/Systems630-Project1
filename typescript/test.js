// An Unmarshaller takes a .pyc file (as a string of binarys, e.g. "\xXX") and
// converts into a Python code object.
var fs = require('fs');
var Unmarshaller = (function () {
    function Unmarshaller(inputFilePath) {
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
    Unmarshaller.prototype.value = function () {
        this.output = this.unmarshal();
        return this.output;
    };
    // // Reads a single character (1 byte, as string) from the input
    Unmarshaller.prototype.readChar = function () {
        var c = this.input.toString('ascii', this.index, this.index + 1);
        this.index += 1;
        return c;
    };
    // // Reads a single byte from the input
    // (Equivalent to readChar().charCodeAt(0))
    Unmarshaller.prototype.readByte = function () {
        var b = this.input.readUInt8(this.index);
        this.index += 1;
        return b;
    };
    // // Reads a 4-byte integer from the input
    Unmarshaller.prototype.readInt32 = function () {
        var i = this.input.readInt32(this.index);
        this.index += 4;
        return i;
    };
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
    // Not yet implemented.
    Unmarshaller.prototype.unmarshal = function () {
        var unit = this.readChar();
        var res;
        switch (unit) {
            case "0":
            case "F":
            case "N":
            case "S":
            case "T":
            case ".":
                break;
            case "g":
                res = this.readFloat64();
                break;
            case "i":
                res = this.readInt32();
                break;
            case "I":
            case "l":
                res = this.readInt32();
                break;
            case "y":
                break;
            case "R":
            case "s":
                var length = this.readInt32();
                res = this.readString(length);
                break;
            case "t":
            case "u":
                var length = this.readInt32();
                res = this.readUnicodeString(length);
                break;
            case "(":
            case "[":
                break;
            case "c":
                break;
        }
        return res;
    };
    return Unmarshaller;
})();
var u = new Unmarshaller("test.pyc");
