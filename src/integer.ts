import gLong = require("../lib/gLong");
import NIError = require('./notimplementederror');
import Py_Float = require('./float');

class Py_Int {
    isInt: boolean = true;
    constructor(public value: gLong) {}

    static fromInt(n: number): Py_Int {
        return new Py_Int(gLong.fromInt(n));
    }

    private mathOp(other: any, op: (a: Py_Int, b: Py_Int) => Py_Int): any {
        if (other.isInt)
            return op(this, other);
        else
            return NIError;
    }

    // Reverse math ops will occur iff a `op` b => a doesn't implement op for
    // type b. For Ints, this rarely happens.
    private revMathOp(other: any, op: (a: Py_Int, b: Py_Int) => any): any {
        if (other.isInt)
            return op(other, this);
        else
            return NIError;
    }

    add(other: any): any {
        return this.mathOp(other, function(a, b) {
            return new Py_Int(a.value.add(b.value));
        });
    }

    sub(other: any): any {
        return this.mathOp(other, function(a, b) {
            return new Py_Int(a.value.subtract(b.value));
        });
    }

    mult(other: any): any {
        return this.mathOp(other, function(a, b) {
            return new Py_Int(a.value.multiply(b.value));
        });
    }

    floordiv(other: any): any {
        return this.mathOp(other, function(a, b) {
            if (b.value.isZero())
                throw new Error("Division by 0");
            return new Py_Int(a.value.div(b.value));
        });
    }

    div(other: any): any {
        return this.truediv(other);
    }

    truediv(other: any): any {
        // Do this / (float)other
        return Py_Float.fromPy_Int(this).truediv(other);
        // return this.mathOp(other, function(a, b) {
        //     return Py_Float.fromPy_Int(new Py_Int(a.div(b.value)));
        // });
    }

    mod(other: any): any {
        return this.mathOp(other, function(a, b) {
            if (b.value.isZero())
                throw new Error("Modulos by 0 is not allowed");
            // return new Py_Int(a.value.modulo(b.value));
            console.log("MOD: ", a, b);
            console.log("FLOORDIV: ", a.floordiv(b));
            return a.sub(b.mult(a.floordiv(b)));
        });
    }

    divmod(other: any): any {
        return this.mathOp(other, function(a, b) {
            return a.div(b).mod(b);
        });
    }

    pow(other: any): any {
        if (other.isInt && other.value.isNegative()) {
            return Py_Float.fromPy_Int(this).pow(other);
        } else {
            return this.mathOp(other, function(a, b) {
                var res = a.value;
                var x = gLong.ONE;
                for (x; x.lessThan(b.value); x = x.add(gLong.ONE)) {
                    res = res.multiply(a.value);
                }
                return new Py_Int(res);
            });
        }
    }

    lshift(other: any): any {
        return this.mathOp(other, function(a, b) {
            return new Py_Int(a.value.shiftLeft(b.toNumber()));
        });
    }

    rshift(other: any): any {
        return this.mathOp(other, function(a, b) {
            return new Py_Int(a.value.shiftRight(b.toNumber()));
        });
    }

    and(other: any): any {
        return this.mathOp(other, function(a, b) {
            return new Py_Int(a.value.and(b.value));
        });
    }

    xor(other: any): any {
        return this.mathOp(other, function(a, b) {
            return new Py_Int(a.value.xor(b.value));
        });
    }

    or(other: any): any {
        return this.mathOp(other, function(a, b) {
            return new Py_Int(a.value.or(b.value));
        });
    }

    // Reverse ops
    radd(other: any): any {
        return this.mathOp(other, function(a, b) {
            return new Py_Int(a.value.add(b.value));
        });
    }

    rsub(other: any): any {
        return this.mathOp(other, function(a, b) {
            return new Py_Int(a.value.subtract(b.value));
        });
    }

    rmult(other: any): any {
        return this.mathOp(other, function(a, b) {
            return new Py_Int(a.value.multiply(b.value));
        });
    }

    rfloordiv(other: any): any {
        return this.mathOp(other, function(a, b) {
            if (b.value.isZero())
                throw new Error("Division by 0");
            return new Py_Int(a.value.div(b.value));
        });
    }

    rdiv(other: any): any {
        return this.rtruediv(other);
    }

    rtruediv(other: any): any {
        return Py_Float.fromPy_Int(this).rtruediv(other);
        // return this.mathOp(other, function(a, b) {
        //     return Py_Float.fromPy_Int(new Py_Int(a.div(b.value)));
        // });
    }

    rmod(other: any): any {
        return this.mathOp(other, function(a, b) {
            if (b.value.isZero())
                throw new Error("Modulo by 0 is not allowed");
            return new Py_Int(a.value.modulo(b.value));
            // return a.sub(b.mult(a.floordiv(b)));
        });
    }

    rdivmod(other: any): any {
        return this.mathOp(other, function(a, b) {
            return a.div(b).mod(b);
        });
    }

    rpow(other: any): any {
        if (other.isInt && other.value.isNegative()) {
            return Py_Float.fromPy_Int(this).rpow(other);
        } else {
            return this.mathOp(other, function(a, b) {
                var res = a;
                var x = gLong.ONE;
                for (x; x.lessThan(b.value); x = x.add(gLong.ONE)) {
                    res = res.mult(a);
                }
                return res;
            });
        }
    }

    rlshift(other: any): any {
        return this.mathOp(other, function(a, b) {
            return new Py_Int(a.value.shiftLeft(b.toNumber()));
        });
    }

    rrshift(other: any): any {
        return this.mathOp(other, function(a, b) {
            return new Py_Int(a.value.shiftRight(b.toNumber()));
        });
    }

    rand(other: any): any {
        return this.mathOp(other, function(a, b) {
            return new Py_Int(a.value.and(b.value));
        });
    }

    rxor(other: any): any {
        return this.mathOp(other, function(a, b) {
            return new Py_Int(a.value.xor(b.value));
        });
    }

    ror(other: any): any {
        return this.mathOp(other, function(a, b) {
            return new Py_Int(a.value.or(b.value));
        });
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
