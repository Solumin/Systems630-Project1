///<reference path="../lib/node.d.ts" />
///<reference path="../lib/decimal.d.ts" />

import NIError = require('./notimplementederror');
import Py_Int = require('./integer');

class Py_Long {
    constructor(public value: Decimal) {}

    static fromInt(n: number) {
        var d = Decimal(n);
        return new Py_Long(d);
    }

    static fromPy_Int(n: Py_Int): Py_Long {
        return Py_Long.fromString(n.toString());
    }

    static fromString(s: string) {
        var d = Decimal(s);
        return new Py_Long(d);
    }

    add(other: any): any {
        if (other instanceof Py_Long)
            return new Py_Long(this.value.plus(other.value));
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
export = Py_Long;
