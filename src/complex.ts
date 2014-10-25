import NIError = require('./notimplementederror');
import Py_Int = require('./integer');
import Py_Long = require('./long');
import Py_Float = require('./float');

class Py_Complex {
    isComplex: boolean = true;
    constructor(public real: Py_Float, public imag: Py_Float) {}

    static fromNumber(r: number, i = 0) {
        return new Py_Complex(new Py_Float(r), new Py_Float(i));
    }

    static fromPy_Int(n: Py_Int): Py_Complex {
        return new Py_Complex(Py_Float.fromPy_Int(n), new Py_Float(0));
    }

    static fromPy_Long(n: Py_Long): Py_Complex {
        return new Py_Complex(Py_Float.fromPy_Long(n), new Py_Float(0));
    }

    static fromPy_Float(n: Py_Float): Py_Complex {
        return new Py_Complex(n, new Py_Float(0));
    }

    private mathOp(other: any, op: (a: Py_Complex, b: Py_Complex) => any): any {
        if (other.isInt)
            return op(this, Py_Complex.fromPy_Int(other));
        else if (other.isLong)
            return op(this, Py_Complex.fromPy_Long(other));
        else if (other.isFloat)
            return op(this, Py_Complex.fromPy_Float(other));
        else if (other.isComplex)
            return op(this, other);
        else
            return NIError;
    }

    // Reverse math ops will occur iff a `op` b => a doesn't implement op for
    // type b. For longs, this should occur for a: Py_Int, b: Py_Long
    // Therefore, these should do c: Py_Long = Py_Long(a), c `op` b
    private revMathOp(other: any, op: (a: Py_Complex, b: Py_Complex) => any): any {
        if (other.isInt)
            return op(Py_Complex.fromPy_Int(other), this);
        else if (other.isLong)
            return op(Py_Complex.fromPy_Long(other), this);
        else if (other.isFloat)
            return op(Py_Complex.fromPy_Float(other), this);
        else if (other.isComplex)
            return op(other, this);
        else
            return NIError;
    }

    add(other: any): any {
        return this.mathOp(other, function(a, b) {
            return new Py_Complex(a.real.add(b.real), a.imag.add(b.imag));
        });
    }

    sub(other: any): any {
        return this.mathOp(other, function(a, b) {
            return new Py_Complex(a.real.sub(b.real), a.imag.sub(b.imag));
        });
    }

    mult(other: any): any {
        return this.mathOp(other, function(a, b) {
            var r, i: Py_Float;
            r = (this.real.mult(other.real) - this.imag.mult(other.imag));
            i = (this.imag.mult(other.real) + this.real.mult(other.imag));
            return new Py_Complex(r, i);
        });
    }

    floordiv(other: any): any {
        return this.mathOp(other, function(a, b) {
            var r, i, d: Py_Float;
            r = (this.real.mult(other.real) + this.imag.mult(other.imag));
            i = (this.imag.mult(other.real) - this.real.mult(other.imag));
            d = (other.real.mult(other.real) + other.imag.mult(other.imag));
            return new Py_Complex(r.floordiv(d), i.floordiv(d));
        });
    }

    div(other: any): any {
        return this.mathOp(other, function(a, b) {
            var r, i, d: Py_Float;
            r = (this.real.mult(other.real) + this.imag.mult(other.imag));
            i = (this.imag.mult(other.real) - this.real.mult(other.imag));
            d = (other.real.mult(other.real) + other.imag.mult(other.imag));
            return new Py_Complex(r.div(d), i.div(d));
        });
    }

    truediv(other: any): any {
        return this.mathOp(other, function(a, b) {
            var r, i, d: Py_Float;
            r = (this.real.mult(other.real) + this.imag.mult(other.imag));
            i = (this.imag.mult(other.real) - this.real.mult(other.imag));
            d = (other.real.mult(other.real) + other.imag.mult(other.imag));
            return new Py_Complex(r.truediv(d), i.truediv(d));
        });
    }

    mod(other: any): any {
        return this.mathOp(other, function(a, b) {
            return new Py_Complex(a.real.mod(b.real), a.imag.mod(b.imag));
        });
    }

    divmod(other: any): any {
        return this.mathOp(other, function(a, b) {
            return a.floordiv(b).mod(b);
        });
    }

    // Powers with complex numbers are weird. Could easily do integer powers w/
    // multiplication loops, but not negative or fractional powers.
    pow(other: any): any {
        return NIError;
        // return this.mathOp(other, function(a, b) {
        //     return new Py_Complex(a.real.add(b.real), a.imag.add(b.imag));
        // });
    }

    // lshift(other: any): any {
    //     return NIError
    //     // return this.mathOp(other, function(a, b) {
    //     //     return a.times(Decimal.pow(2, b));
    //     // ; });
    // }

    // rshift(other: any): any {
    //     return NIError
    //     // return this.mathOp(other, function(a, b) {
    //     //     return a.divToInt(Decimal.pow(2, b));
    //     // ; });
    // }

    // and(other: any): any {
    //    return this.mathOp(other, function(a, b) { return a & b; });
    // }

    // xor(other: any): any {
    //    return this.mathOp(other, function(a, b) { return a ^ b; });
    // }

    // or(other: any): any {
    //    return this.mathOp(other, function(a, b) { return a | b; });
    // }

    radd(other: any): any {
        return this.mathOp(other, function(a, b) {
            return new Py_Complex(a.real.add(b.real), a.imag.add(b.imag));
        });
    }

    rsub(other: any): any {
        return this.mathOp(other, function(a, b) {
            return new Py_Complex(a.real.sub(b.real), a.imag.sub(b.imag));
        });
    }

    rmult(other: any): any {
        return this.mathOp(other, function(a, b) {
            var r, i: Py_Float;
            r = (this.real.mult(other.real) - this.imag.mult(other.imag));
            i = (this.imag.mult(other.real) + this.real.mult(other.imag));
            return new Py_Complex(r, i);
        });
    }

    rfloordiv(other: any): any {
        return this.mathOp(other, function(a, b) {
            var r, i, d: Py_Float;
            r = (this.real.mult(other.real) + this.imag.mult(other.imag));
            i = (this.imag.mult(other.real) - this.real.mult(other.imag));
            d = (other.real.mult(other.real) + other.imag.mult(other.imag));
            return new Py_Complex(r.floordiv(d), i.floordiv(d));
        });
    }

    rdiv(other: any): any {
        return this.mathOp(other, function(a, b) {
            var r, i, d: Py_Float;
            r = (this.real.mult(other.real) + this.imag.mult(other.imag));
            i = (this.imag.mult(other.real) - this.real.mult(other.imag));
            d = (other.real.mult(other.real) + other.imag.mult(other.imag));
            return new Py_Complex(r.div(d), i.div(d));
        });
    }

    rtruediv(other: any): any {
        return this.mathOp(other, function(a, b) {
            var r, i, d: Py_Float;
            r = (this.real.mult(other.real) + this.imag.mult(other.imag));
            i = (this.imag.mult(other.real) - this.real.mult(other.imag));
            d = (other.real.mult(other.real) + other.imag.mult(other.imag));
            return new Py_Complex(r.truediv(d), i.truediv(d));
        });
    }

    rmod(other: any): any {
        return this.mathOp(other, function(a, b) {
            return new Py_Complex(a.real.mod(b.real), a.imag.mod(b.imag));
        });
    }

    rdivmod(other: any): any {
        return this.mathOp(other, function(a, b) {
            return a.floordiv(b).mod(b);
        });
    }

    // Powers with complex numbers are weird. Could easily do integer powers w/
    // multiplication loops, but not negative or fractional powers.
    rpow(other: any): any {
        return NIError;
        // return this.mathOp(other, function(a, b) {
        // });
    }

    // rlshift(other: any): any {
    //     return NIError
    // }

    // rrshift(other: any): any {
    //     return NIError
    // }

    // rand(other: any): any {
    // }

    // rxor(other: any): any {
    // }

    // ror(other: any): any {
    // }

    neg(): Py_Complex {
        return new Py_Complex(this.real.neg(), this.imag.neg());
    }

    pos(): Py_Complex {
        return this
    }

    abs(): Py_Float {
        var r = this.real.value;
        var i = this.imag.value;
        return new Py_Float(Math.sqrt(r*r + i*i));
    }

    // This isn't implemented for floats in Python, apparently?
    // invert(): any {
    //     return NIError
    // }

    // Rich comparison ops
    // Python does not define an ordering for complex numbers

    // lt(other): any {
    //     return NIError;
    // }

    // le(other): any {
    //     return NIError;
    // }

    eq(other): boolean {
        return this.mathOp(other, function(a, b) {
            return (a.real.eq(b.real) && a.imag.eq(b.imag));
        });
    }

    ne(other): boolean {
        return this.mathOp(other, function(a, b) {
            return (a.real.ne(b.real) && a.imag.ne(b.imag));
        });
    }

    // gt(other): any {
    //     return NIError;
    // }

    // ge(other): any {
    //     return NIError;
    // }

    toString(): string {
        return "(" + this.real.toString() + " + " + this.imag.toString() + "j)";
    }
}
export = Py_Complex;
