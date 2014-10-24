import NIError = require('./notimplementederror');
import Py_Int = require('./integer');
import Py_Long = require('./long');

class Py_Float {
    constructor(public value: number) {}

    static fromPy_Int(n: Py_Int): Py_Float {
        return new Py_Float(n.toNumber());
    }

    static fromPy_Long(n: Py_Long): Py_Float {
        return new Py_Float(n.toNumber());
    }

    private mathOp(other: any, op: (a: number, b: number) => any): any {
        if (other instanceof Py_Int)
            return op(this.value, Py_Float.fromPy_Int(other).value);
        else if (other instanceof Py_Long)
            return op(this.value, Py_Float.fromPy_Long(other).value);
        else if (other instanceof Py_Float)
            return op(this.value, other.value);
        else
            return NIError;
    }

    // Reverse math ops will occur iff a `op` b => a doesn't implement op for
    // type b. For longs, this should occur for a: Py_Int, b: Py_Float
    // Therefore, these should do c: Py_Float = Py_Float(a), c `op` b
    private revMathOp(other: any, op: (a: number, b: number) => any): any {
        if (other instanceof Py_Int)
            return op(Py_Float.fromPy_Int(other).value, this.value);
        if (other instanceof Py_Long)
            return op(Py_Float.fromPy_Long(other).value, this.value);
        else if (other instanceof Py_Float)
            return op(other.value, this.value);
        else
            return NIError;
    }

    add(other: any): any {
        return this.mathOp(other, function(a, b) { return a + b; });
    }

    sub(other: any): any {
        return this.mathOp(other, function(a, b) { return a - b; });
    }

    mult(other: any): any {
        return this.mathOp(other, function(a, b) { return a * b; });
    }

    floordiv(other: any): any {
        return this.mathOp(other, function(a, b) { return Math.floor(a / b); });
    }

    div(other: any): any {
        return this.floordiv(other);
    }

    truediv(other: any): any {
        return this.mathOp(other, function(a, b) { return a / b; });
    }

    mod(other: any): any {
        return this.mathOp(other, function(a, b) { return a % b; });
    }

    divmod(other: any): any {
        return this.mathOp(other, function(a, b) {
            return (a / b) % b;
        });
    }

    pow(other: any): any {
        return this.mathOp(other, function(a, b) { return Math.pow(a,b); });
    }

    lshift(other: any): any {
        return NIError
        // return this.mathOp(other, function(a, b) {
        //     return a.times(Decimal.pow(2, b));
        // ; });
    }

    rshift(other: any): any {
        return NIError
        // return this.mathOp(other, function(a, b) {
        //     return a.divToInt(Decimal.pow(2, b));
        // ; });
    }

    and(other: any): any {
       return this.mathOp(other, function(a, b) { return a & b; });
    }

    xor(other: any): any {
       return this.mathOp(other, function(a, b) { return a ^ b; });
    }

    or(other: any): any {
       return this.mathOp(other, function(a, b) { return a | b; });
    }

    radd(other: any): any {
        return this.mathOp(other, function(a, b) { return a + b; });
    }

    rsub(other: any): any {
        return this.mathOp(other, function(a, b) { return a - b; });
    }

    rmult(other: any): any {
        return this.mathOp(other, function(a, b) { return a * b; });
    }

    rfloordiv(other: any): any {
        return this.mathOp(other, function(a, b) { return Math.floor(a / b); });
    }

    rdiv(other: any): any {
        return this.floordiv(other);
    }

    rtruediv(other: any): any {
        return this.mathOp(other, function(a, b) { return a / b; });
    }

    rmod(other: any): any {
        return this.mathOp(other, function(a, b) { return a % b; });
    }

    rdivmod(other: any): any {
        return this.mathOp(other, function(a, b) {
            return (a / b) % b;
        });
    }

    rpow(other: any): any {
        return this.mathOp(other, function(a, b) { return Math.pow(a,b); });
    }

    rlshift(other: any): any {
        return NIError
        // return this.mathOp(other, function(a, b) {
        //     return a.times(Decimal.pow(2, b));
        // ; });
    }

    rrshift(other: any): any {
        return NIError
        // return this.mathOp(other, function(a, b) {
        //     return a.divToInt(Decimal.pow(2, b));
        // ; });
    }

    rand(other: any): any {
       return this.mathOp(other, function(a, b) { return a & b; });
    }

    rxor(other: any): any {
       return this.mathOp(other, function(a, b) { return a ^ b; });
    }

    ror(other: any): any {
       return this.mathOp(other, function(a, b) { return a | b; });
    }

    neg(): Py_Float {
        return this.mult(-1);
    }

    pos(): Py_Float {
        return this
    }

    abs(): Py_Float {
        if (this.value < 0)
            return this.neg();
        else
            return this;
    }

    // This isn't implemented for floats in Python, apparently?
    invert(): any {
        return NIError
    }

    toString(): string {
        return this.value.toString();
    }
}
export = Py_Float;
