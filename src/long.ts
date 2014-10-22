///<reference path="../lib/node.d.ts" />
var Decimal = require('../lib/decimal');
import NIError = require('./notimplementederror');

class Py_Long {

    constructor(public value: Decimal) {}

    static fromInt(n: number) {
        var d = new Decimal(n);
        return new Py_Long(d);
    }

    static ZERO = Py_Long.fromInt(0);

    add(other: any): any {
        if (other instanceof Py_Long)
            return this.add(other.value);
        else
            return NIError;
    }
}
export = Py_Long;
