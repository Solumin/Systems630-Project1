///<reference path="../lib/decimal.d.ts" />

import NIError = require('./notimplementederror');
import Py_Int = require('./integer');
import Py_Float = require('./float');

class Py_Long {
    constructor(public value: Decimal) {}

    static fromInt(n: number) {
        var d = Decimal(n);
        return new Py_Long(d);
    }

    static fromPy_Int(n: Py_Long): Py_Long {
        return Py_Long.fromString(n.toString());
    }

    static fromString(s: string) {
        var d = Decimal(s);
        return new Py_Long(d);
    }

    private mathOp(other: any, op: (a: Decimal, b: Decimal) => any): any {
        if (other instanceof Py_Int)
            return op(this.value, Py_Long.fromPy_Int(other).value);
        else if (other instanceof Py_Long)
            return op(this.value, other.value);
        else
            return NIError;
    }

    add(other: any): any {
        return this.mathOp(other, function(a, b) { return a.plus(b) });
    }

    sub(other: any): any {
        if (other instanceof Py_Int)
            return this.sub(Py_Long.fromPy_Int(other));
        else if (other instanceof Py_Long)
            return new Py_Long(this.value.minus(other.value));
        else
            return NIError;
    }

    mult(other: any): any {
        if (other instanceof Py_Int)
            return this.mult(Py_Long.fromPy_Int(other));
        else if (other instanceof Py_Long)
            return new Py_Long(this.value.times(other.value));
        else
            return NIError;
    }

    floordiv(other: any): any {
        if (other instanceof Py_Int)
            return this.floordiv(Py_Long.fromPy_Int(other));
        else if (other instanceof Py_Long)
            return new Py_Long(this.value.divToInt(other.value));
        else
            return NIError;
    }

    div(other: any): any {
        return this.floordiv(other);
    }

    truediv(other: any): any {
        if (other instanceof Py_Int)
            return this.truediv(Py_Long.fromPy_Int(other));
        else if (other instanceof Py_Long)
            return new Py_Long(this.value.div(other.value));
        else
            return NIError;
    }

    mod(other: any): any {
        if (other instanceof Py_Int)
            return this.mod(Py_Long.fromPy_Int(other))
        else if (other instanceof Py_Long)
            return new Py_Long(this.value.modulo(other.value));
        else
            return NIError;
    }

    divmod(other: any): any {
        if (other instanceof Py_Int)
            return this.floordiv(other).mod(other);
        else
            return NIError;
    }

    // pow(other: any): any {
    //     if (other instanceof Py_Int) {
    //         var temp = new Py_Long(this.value);
    //         for (var x = gLong.ONE; x.lessThan(other.value); x = x.add(gLong.ONE)) {
    //             temp = temp.mult(this);
    //         }
    //         return temp;
    //     } else
    //         return NIError;
    // }

    // lshift(other: any): any {
    //     if (other instanceof Py_Int)
    //         return new Py_Long(this.value.shiftLeft(other.value));
    //     else
    //         return NIError;
    // }

    // rshift(other: any): any {
    //     if (other instanceof Py_Int)
    //         return new Py_Long(this.value.shiftRight(other.value));
    //     else
    //         return NIError;
    // }

    // and(other: any): any {
    //     if (other instanceof Py_Int)
    //         return new Py_Long(this.value.and(other.value));
    //     else
    //         return NIError;
    // }

    // xor(other: any): any {
    //     if (other instanceof Py_Int)
    //         return new Py_Long(this.value.xor(other.value));
    //     else
    //         return NIError;
    // }

    // or(other: any): any {
    //     if (other instanceof Py_Int)
    //         return new Py_Long(this.value.or(other.value));
    //     else
    //         return NIError;
    // }

    radd(other: any): any {
        if (other instanceof Py_Int)
            return other.add(this);
        else
            return NIError;
    }

    rsub(other: any): any {
        if (other instanceof Py_Int)
            return other.sub(this);
        else
            return NIError;
    }

    rmult(other: any): any {
        if (other instanceof Py_Int)
            return other.mult(this);
        else
            return NIError;
    }

    rfloordiv(other: any): any {
        if (other instanceof Py_Int)
            return other.floordiv(this);
        else
            return NIError;
    }

    rdiv(other: any): any {
        if (other instanceof Py_Int)
            return other.rdiv(this);
        else
            return NIError;
    }

    rtruediv(other: any): any {
        if (other instanceof Py_Int)
            return other.truediv(this);
        else
            return NIError;
    }

    rmod(other: any): any {
        if (other instanceof Py_Int)
            return other.mod(this);
        else
            return NIError;
    }

    rdivmod(other: any): any {
        if (other instanceof Py_Int)
            return other.divmod(this);
        else
            return NIError;
    }

    rpow(other: any): any {
        if (other instanceof Py_Int)
            return other.pow(this);
        else
            return NIError;
    }

    rlshift(other: any): any {
        if (other instanceof Py_Int)
            return other.lshift(this);
        else
            return NIError;
    }

    rrshift(other: any): any {
        if (other instanceof Py_Int)
            return other.rshift(this);
        else
            return NIError;
    }

    rand(other: any): any {
        if (other instanceof Py_Int)
            return other.and(this);
        else
            return NIError;
    }

    rxor(other: any): any {
        if (other instanceof Py_Int)
            return other.xor(this);
        else
            return NIError;
    }

    ror(other: any): any {
        if (other instanceof Py_Int)
            return other.or(this);
        else
            return NIError;
    }

    neg(): Py_Long {
        return this.mult(-1);
    }

    pos(): Py_Long {
        return this
    }

    abs(): Py_Long {
        if (this.value.isNegative())
            return this.neg();
        else
            return this;
    }

    // ~x = (-x) - 1 for integers, emulate it w/ long
    invert(): Py_Long {
        return this.neg().sub(1);
    }

    toString(): string {
        return this.value.toString();
    }

    toNumber(): number {
        return this.value.toNumber();
    }
}
export = Py_Long;
