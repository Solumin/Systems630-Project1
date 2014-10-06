// An Unmarshaller takes a .pyc file (as a string of binarys, e.g. "\xXX") and
// converts into a Python code object.
var Unmarshaller = (function () {
    function Unmarshaller(input) {
        this.index = 0;
        this.input = input;
    }
    // Processes the input string
    Unmarshaller.prototype.value = function () {
        this.output = this.unmarshal();
        return this.output;
    };

    // Reads a single character (1 byte, as string) from the input
    Unmarshaller.prototype.readChar = function () {
        var b = this.input[this.index];
        this.index += 1;
        return b;
    };

    // Reads a single byte from the input
    // (Equivalent to readChar().charCodeAt(0))
    Unmarshaller.prototype.readByte = function () {
        return this.readChar().charCodeAt(0);
    };

    // Reads a 4-byte integer from the input
    Unmarshaller.prototype.readInt32 = function () {
        var i0 = this.readByte();
        var i1 = this.readByte();
        var i2 = this.readByte();
        var i3 = this.readByte();
        return (i3 << 24) + (i2 << 16) + (i1 << 8) + i0;
    };

    // Reads a 64 bit integer
    // WARNING: Javascript only supports double-precision floats.
    // Any numbers greater than 2**52 will be approximate at best
    Unmarshaller.prototype.readInt64 = function () {
        var i0 = this.readInt32();
        var i1 = this.readInt32();
        return (i1 * Math.pow(2, 32)) + i0;
    };

    // Reads a 64-bit floating-pount number
    // WARNING: Javascript only supports double-precision floats.
    // Any numbers greater than 2**52 will be approximate at best
    // Refer to IEEE 754 for more detail.
    Unmarshaller.prototype.readFloat64 = function () {
        var i0 = this.readInt32();
        var i1 = this.readInt32();
        console.log(i0);
        var significand = ((i1 & 0xfffff) * Math.pow(2, 32)) + i0;
        significand = 1.0 + (significand * Math.pow(2, -52));
        var exp = ((i1 & 0x7ff00000) >> 20) - 1023;
        var sign = (i1 & 0x80000000) == 0 ? 1 : -1;
        return sign * (significand * Math.pow(2, exp));
    };

    // Unmarshals the input string
    Unmarshaller.prototype.unmarshal = function () {
        return 0;
        // return this.readInt32();
    };
    return Unmarshaller;
})();

var u = new Unmarshaller("\x00\x00\x00\x00\x00\x80\x4f\x40");

// document.body.innerHTML = "Int32: " + u.readInt32()
// document.body.innerHTML+= "</br>Int64: " + u.readInt64()
document.body.innerHTML += "</br>Float64: " + u.readFloat64();
