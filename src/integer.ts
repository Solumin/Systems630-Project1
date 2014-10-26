import gLong = require("../lib/gLong");
import NIError = require('./notimplementederror');
import Py_Float = require('./float');

class Py_Int {
    isInt: boolean = true;
    constructor(public value: gLong) {}

    static fromInt(n: number): Py_Int {
        return new Py_Int(gLong.fromInt(n));
    }

    private mathOp(other: any, op: (a: gLong, b: gLong) => any): any {
        if (other.isInt)
            return new Py_Int(op(this.value, other.value));
        else
            return NIError;
    }

    // Reverse math ops will occur iff a `op` b => a doesn't implement op for
    // type b. For Ints, this rarely happens.
    private revMathOp(other: any, op: (a: gLong, b: gLong) => any): any {
        if (other.isInt)
            return new Py_Int(op(other.value, this.value));
        else
            return NIError;
    }

    add(other: any): any {
        return this.mathOp(other, function(a, b) { return a.add(b); });
    }

    sub(other: any): any {
        return this.mathOp(other, function(a, b) { return a.subtract(b); });
    }

    mult(other: any): any {
        return this.mathOp(other, function(a, b) { return a.multiply(b); });
    }

    floordiv(other: any): any {
        return this.mathOp(other, function(a, b) { return a.div(b); });
    }

    div(other: any): any {
        return this.truediv(other);
    }

    truediv(other: any): any {
        return this.mathOp(other, function(a, b) {
            return Py_Float.fromPy_Int(new Py_Int(a.div(b)));
        });
    }

    mod(other: any): any {
        return this.mathOp(other, function(a, b) { return a.modulo(b); });
    }

    divmod(other: any): any {
        return this.mathOp(other, function(a, b) {
            return a.div(b).modulo(b);
       });
    }

    pow(other: any): any {
        return this.mathOp(other, function(a, b) {
            var res = a;
            var x = gLong.ONE;
            for (x; x.lessThan(b); x = x.add(gLong.ONE)) {
                res = res.multiply(a);
            }
            return res;
        });
    }

    lshift(other: any): any {
        return this.mathOp(other, function(a, b) {
            return a.shiftLeft(b.toNumber());
        });
    }

    rshift(other: any): any {
        return this.mathOp(other, function(a, b) {
            return a.shiftRight(b.toNumber());
        });
    }

    and(other: any): any {
        return this.mathOp(other, function(a, b) { return a.and(b); });
    }

    xor(other: any): any {
        return this.mathOp(other, function(a, b) { return a.xor(b); });
    }

    or(other: any): any {
        return this.mathOp(other, function(a, b) { return a.or(b); });
    }

    // Reverse ops
    radd(other: any): any {
        return this.mathOp(other, function(a, b) { return a.add(b); });
    }

    rsub(other: any): any {
        return this.mathOp(other, function(a, b) { return a.subtract(b); });
    }

    rmult(other: any): any {
        return this.mathOp(other, function(a, b) { return a.multiply(b); });
    }

    rfloordiv(other: any): any {
        return this.mathOp(other, function(a, b) { return a.div(b); });
    }

    rdiv(other: any): any {
        return this.floordiv(other);
    }

    rtruediv(other: any): any {
        return this.mathOp(other, function(a, b) {
            return Py_Float.fromPy_Int(new Py_Int(a.div(b)));
        });
    }

    rmod(other: any): any {
        return this.mathOp(other, function(a, b) { return a.modulo(b); });
    }

    rdivmod(other: any): any {
        return this.mathOp(other, function(a, b) {
            return a.div(b).modulo(b);
       });
    }

    rpow(other: any): any {
        return this.mathOp(other, function(a, b) {
            var res = a;
            var x = gLong.ONE;
            for (x; x.lessThan(b); x = x.add(gLong.ONE)) {
                res = res.multiply(a);
            }
            return res;
        });
    }

    rlshift(other: any): any {
        return this.mathOp(other, function(a, b) {
            return a.shiftLeft(b.toNumber());
        });
    }

    rrshift(other: any): any {
        return this.mathOp(other, function(a, b) {
            return a.shiftRight(b.toNumber());
        });
    }

    rand(other: any): any {
        return this.mathOp(other, function(a, b) { return a.and(b); });
    }

    rxor(other: any): any {
        return this.mathOp(other, function(a, b) { return a.xor(b); });
    }

    ror(other: any): any {
        return this.mathOp(other, function(a, b) { return a.or(b); });
    }

    neg(): Py_Int {
        return this.mult(Py_Int.fromInt(-1));
    }

    pos(): Py_Int {
        return this
    }

    abs(): Py_Int {
        if (this.value.isNegative())
            return this.neg();
        else
            return this;
    }

    invert(): Py_Int {
        return new Py_Int(this.value.not());
    }

    // Rich comparison ops
    private cmpOp(other: any, op: (a: gLong, b: gLong) => any): any {
        if (other.isInt)
            return op(this.value, other.value);
        else
            return NIError;
    }

    lt(other): boolean {
        return this.cmpOp(other, function(a, b) { return a.lessThan(b); });
    }

    le(other): boolean {
        return this.cmpOp(other, function(a, b) {
            return a.lessThanOrEqual(b);
        });
    }

    eq(other): boolean {
        return this.cmpOp(other, function(a, b) { return a.equals(b); });
    }

    ne(other): boolean {
        return this.cmpOp(other, function(a, b) { return a.notEquals(b); });
    }

    gt(other): boolean {
        return this.cmpOp(other, function(a, b) {
            return a.greaterThan(b);
        });
    }

    ge(other): boolean {
        return this.cmpOp(other, function(a, b) {
            return a.greaterThanOrEqual(b);
        });
    }

    toString(): string {
        return this.value.toString();
    }

    toNumber(): number {
        return this.value.toNumber();
    }
}
export = Py_Int;
