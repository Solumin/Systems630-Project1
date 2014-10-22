import gLong = require("../lib/gLong");
import NIError = require('./notimplementederror');

class Py_Int {
    constructor(public value: gLong) {}

    static fromInt(n: number): Py_Int {
        return new Py_Int(gLong.fromInt(n));
    }

    static ZERO = Py_Int.fromInt(0);

    add(other: any): any {
        if (other instanceof Py_Int)
            return this.value.add(other.value);
        else
            return NIError;
    }
}
export = Py_Int;
