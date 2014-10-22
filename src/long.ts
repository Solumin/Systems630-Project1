///<reference path="../lib/node.d.ts" />
var Decimal = require('../lib/decimal');
import NIError = require('./notimplementederror');

class Py_Long {

    constructor(public value: any) {}

    static fromInt(n: number) {
        var d = new Decimal(n);
        return new Py_Long(d);
    }

    static fromString(s: string) {
        var d = new Decimal(s);
        return new Py_Long(s);
    }

    add(other: any): any {
        if (other instanceof Py_Long)
            return new Py_Long(this.value.add(other.value));
        else
            return NIError;
    }

    toString(): string {
        return this.value.toString();
    }
}
export = Py_Long;
