import NIError = require('./notimplementederror');
import Py_Int = require('./integer');
import Py_Long = require('./long');

class Py_Float {
    isFloat: boolean = true;
    constructor(public value: number) {}

    static fromPy_Int(n: Py_Int): Py_Float {
        return new Py_Float(n.toNumber());
    }

    static fromPy_Long(n: Py_Long): Py_Float {
        return new Py_Float(n.toNumber());
    }

    private mathOp(other: any, op: (a: Py_Float, b: Py_Float) => any): any {
        if (other.isInt)
            return op(this, Py_Float.fromPy_Int(other));
        else if (other.isLong)
            return op(this, Py_Float.fromPy_Long(other));
        else if (other.isFloat)
            return op(this, other);
        else
            return NIError;
    }

    // Reverse math ops will occur iff a `op` b => a doesn't implement op for
    // type b. For longs, this should occur for a: Py_Int, b: Py_Float
    // Therefore, these should do c: Py_Float = Py_Float(a), c `op` b
    private revMathOp(other: any, op: (a: Py_Float, b: Py_Float) => any): any {
        if (other.isInt)
            return op(Py_Float.fromPy_Int(other), this);
        if (other.isLong)
            return op(Py_Float.fromPy_Long(other), this);
        else if (other.isFloat)
            return op(other, this);
        else
            return NIError;
    }

    add(other: any): any {
        return this.mathOp(other, function(a, b) {
            return new Py_Float(a.value + b.value);
        });
    }

    sub(other: any): any {
        return this.mathOp(other, function(a, b) {
            return new Py_Float(a.value - b.value);
        });
    }

    mult(other: any): any {
        return this.mathOp(other, function(a, b) {
            return new Py_Float(a.value * b.value);
        });
    }

    floordiv(other: any): any {
        return this.mathOp(other, function(a, b) {
            if (b.value == 0)
                throw new Error("Division by 0");
            return new Py_Float(Math.floor(a.value / b.value));
        });
    }

    div(other: any): any {
        return this.truediv(other);
    }

    truediv(other: any): any {
        return this.mathOp(other, function(a, b) {
            if (b.value == 0)
                throw new Error("Division by 0");
            return new Py_Float(a.value / b.value);
        });
    }

    mod(other: any): any {
        return this.mathOp(other, function(a, b) {
            if (b.value == 0)
                throw new Error("Modulo by 0");
            // return new Py_Float(a.value % b.value);
            return a.sub(b.mult(a.floordiv(b)));
        });
    }

    divmod(other: any): any {
        return this.mathOp(other, function(a, b) {
            return new Py_Float(Math.floor(a.value / b.value) % b.value);
        });
    }

    pow(other: any): any {
        return this.mathOp(other, function(a, b) {
            return new Py_Float(Math.pow(a.value, b.value));
        });
    }

    // lshift(other: any): any {
    //     return NIError
    // }

    // rshift(other: any): any {
    //     return NIError
    // }

    // and(other: any): any {
    //    return NIError
    // }

    // xor(other: any): any {
    //    return NIError
    // }

    // or(other: any): any {
    //    return NIError
    // }

    radd(other: any): any {
        return this.revMathOp(other, function(a, b) {
            return new Py_Float(a.value + (b.value));
        });
    }

    rsub(other: any): any {
        return this.revMathOp(other, function(a, b) {
            return new Py_Float(a.value - (b.value));
        });
    }

    rmult(other: any): any {
        return this.revMathOp(other, function(a, b) {
            return new Py_Float(a.value * (b.value));
        });
    }

    rfloordiv(other: any): any {
        return this.revMathOp(other, function(a, b) {
            if (b.value == 0)
                throw new Error("Division by 0");
            return new Py_Float(Math.floor(a.value / b.value));
        });
    }

    rdiv(other: any): any {
        return this.rtruediv(other);
    }

    rtruediv(other: any): any {
        return this.revMathOp(other, function(a, b) {
            if (b.value == 0)
                throw new Error("Division by 0");
            return new Py_Float(a.value / (b.value));
        });
    }

    rmod(other: any): any {
        return this.revMathOp(other, function(a, b) {
            if (b.value == 0)
                throw new Error("Modulo by 0");
            return new Py_Float(a.value % (b.value));
        });
    }

    rdivmod(other: any): any {
        return this.revMathOp(other, function(a, b) {
            return new Py_Float(Math.floor(a.value / b.value) % b.value);
        });
    }

    rpow(other: any): any {
        return this.revMathOp(other, function(a, b) {
            return new Py_Float(Math.pow(a.value,b.value));
        });
    }

    // rlshift(other: any): any {
    //     return NIError
    // }

    // rrshift(other: any): any {
    //     return NIError
    // }

    // rand(other: any): any {
    //    return NIError
    // }

    // rxor(other: any): any {
    //    return NIError
    // }

    // ror(other: any): any {
    //    return NIError
    // }

    neg(): Py_Float {
        return this.mult(new Py_Float(-1));
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
    // invert(): any {
    //     return NIError
    // }

    // Rich comparison ops
    private cmpOp(other: any, op: (a: Py_Float, b: Py_Float) => any): any {
        if (other.isInt)
            return op(this, Py_Float.fromPy_Int(other));
        else if (other.isLong)
            return op(this, Py_Float.fromPy_Long(other));
        else if (other.isFloat)
            return op(this, other);
        else
            return NIError;
    }

    lt(other): boolean {
        return this.cmpOp(other, function(a, b) { return a.value < b.value; });
    }

    le(other): boolean {
        return this.cmpOp(other, function(a, b) { return a.value <= b.value; });
    }

    eq(other): boolean {
        return this.cmpOp(other, function(a, b) { return a.value == b.value; });
    }

    ne(other): boolean {
        return this.cmpOp(other, function(a, b) { return a.value != b.value; });
    }

    gt(other): boolean {
        return this.cmpOp(other, function(a, b) { return a.value > b.value; });
    }

    ge(other): boolean {
        return this.cmpOp(other, function(a, b) { return a.value >= b.value; });
    }

    toNumber(): number {
        return this.value;
    }

    toString(): string {
        return this.value.toString();
    }
}
export = Py_Float;
