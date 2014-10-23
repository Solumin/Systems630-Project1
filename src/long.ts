///<reference path="../lib/node.d.ts" />
///<reference path="../lib/decimal.d.ts" />

import NIError = require('./notimplementederror');

class Py_Long {
    value: Decimal;

    constructor(value: Decimal) {}

    static fromInt(n: number) {
        var d = Decimal(n);
        return new Py_Long(d);
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
}
export = Py_Long;
