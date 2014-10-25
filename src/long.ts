///<reference path="../lib/decimal.d.ts" />

import NIError = require('./notimplementederror');
import Py_Int = require('./integer');
var Decimal = require('../lib/decimal');

class Py_Long {
    isLong: boolean = true;
    constructor(public value: Decimal) {}

    static fromInt(n: number) {
        var d = Decimal(n);
        return new Py_Long(d);
    }

    static fromPy_Int(n: Py_Int): Py_Long {
        return Py_Long.fromString(n.toString());
    }

    static fromString(s: string) {
        var d = new Decimal(s);
        return new Py_Long(d);
    }

    private mathOp(other: any, op: (a: Decimal, b: Decimal) => any): any {
        if (other.isInt)
            return new Py_Long(op(this.value, Py_Long.fromPy_Int(other).value));
        else if (other.isLong)
            return new Py_Long(op(this.value, other.value));
        else
            return NIError;
    }

    // Reverse math ops will occur iff a `op` b => a doesn't implement op for
    // type b. For longs, this should occur for a: Py_Int, b: Py_Long
    // Therefore, these should do c: Py_Long = Py_Long(a), c `op` b
    private revMathOp(other: any, op: (a: Decimal, b: Decimal) => any): any {
        if (other.isInt)
            return new Py_Long(op(Py_Long.fromPy_Int(other).value, this.value));
        else if (other.isLong)
            return new Py_Long(op(other.value, this.value));
        else
            return NIError;
    }

    add(other: any): any {
        return this.mathOp(other, function(a, b) { return a.plus(b); });
    }

    sub(other: any): any {
        return this.mathOp(other, function(a, b) { return a.minus(b); });
    }

    mult(other: any): any {
        return this.mathOp(other, function(a, b) { return a.times(b); });
    }

    floordiv(other: any): any {
        return this.mathOp(other, function(a, b) { return a.divToInt(b); });
    }

    div(other: any): any {
        return this.floordiv(other);
    }

    truediv(other: any): any {
        return this.mathOp(other, function(a, b) { return a.div(b); });
    }

    mod(other: any): any {
        return this.mathOp(other, function(a, b) { return a.modulo(b); });
    }

    divmod(other: any): any {
        return this.mathOp(other, function(a, b) {
            return a.divToInt(b).modulo(b);
        });
    }

    pow(other: any): any {
        return this.mathOp(other, function(a, b) { return a.toPower(b); });
    }

    lshift(other: any): any {
        return this.mathOp(other, function(a, b) {
            return a.times(Decimal.pow(2, b));
        });
    }

    rshift(other: any): any {
        return this.mathOp(other, function(a, b) {
            return a.divToInt(Decimal.pow(2, b));
        });
    }

    // And, Xor and Or require messing with the guts of Decimal
    // Totally doable, but for now, not implemented
    // Future reference: Decimal's 'c' field is number[] (array of digits)
    // res[i] = a[i] | b[i]
    // But might need to treat negative numbers differently?
    and(other: any): any {
        // if (other instanceof Py_Int)
        //     return new Py_Long(this.value.and(other.value));
        // else
            return NIError;
    }

    xor(other: any): any {
        // if (other instanceof Py_Int)
        //     return new Py_Long(this.value.xor(other.value));
        // else
            return NIError;
    }

    or(other: any): any {
        // if (other instanceof Py_Int)
        //     return new Py_Long(this.value.or(other.value));
        // else
            return NIError;
    }

    radd(other: any): any {
        return this.revMathOp(other, function(a, b) { return a.plus(b); });
    }

    rsub(other: any): any {
        return this.revMathOp(other, function(a, b) { return a.minus(b); });
    }

    rmult(other: any): any {
        return this.revMathOp(other, function(a, b) { return a.times(b); });
    }

    rfloordiv(other: any): any {
        return this.revMathOp(other, function(a, b) { return a.divToInt(b); });
    }

    rdiv(other: any): any {
        return this.floordiv(other);
    }

    rtruediv(other: any): any {
        return this.revMathOp(other, function(a, b) { return a.div(b); });
    }

    rmod(other: any): any {
        return this.revMathOp(other, function(a, b) { return a.modulo(b); });
    }

    rdivmod(other: any): any {
        return this.revMathOp(other, function(a, b) {
            return a.divToInt(b).modulo(b)
       ; });
    }

    rpow(other: any): any {
        return this.revMathOp(other, function(a, b) { return a.toPower(b); });
    }

    rlshift(other: any): any {
        return this.revMathOp(other, function(a, b) {
            return a.times(Decimal.pow(2, b));
       ; });
    }

    rrshift(other: any): any {
        return this.revMathOp(other, function(a, b) {
            return a.divToInt(Decimal.pow(2, b));
       ; });
    }

    // And, Xor and Or require messing with the guts of Decimal
    // Totally doable, but for now, not implemented
    // Future reference: Decimal's 'c' field is number[] (array of digits)
    // res[i] = a[i] | b[i]
    // But might need to treat negative numbers differently?
    rand(other: any): any {
        // if (other instanceof Py_Int)
        //     return new Py_Long(this.value.and(other.value));
        // else
            return NIError;
    }

    rxor(other: any): any {
        // if (other instanceof Py_Int)
        //     return new Py_Long(this.value.xor(other.value));
        // else
            return NIError;
    }

    ror(other: any): any {
        // if (other instanceof Py_Int)
        //     return new Py_Long(this.value.or(other.value));
        // else
            return NIError;
    }

    neg(): Py_Long {
        return this.mult(Py_Long.fromString("-1"));
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
