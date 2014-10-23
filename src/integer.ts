import gLong = require("../lib/gLong");
import NIError = require('./notimplementederror');

class Py_Int {
    constructor(public value: gLong) {}

    static fromInt(n: number): Py_Int {
        return new Py_Int(gLong.fromInt(n));
    }

    add(other: any): any {
        if (other instanceof Py_Int)
            return new Py_Int(this.value.add(other.value));
        else
            return NIError;
    }

    mult(other: any): any {
        if (other instanceof Py_Int)
            return new Py_Int(this.value.multiply(other.value));
        else
            return NIError;
    }

    toString(): string {
        return this.value.toString();
    }

    toNumber(): number {
        return this.value.toNumber();
    }
}
export = Py_Int;
