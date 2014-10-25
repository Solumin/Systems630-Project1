import gLong = require("../lib/gLong");
import NIError = require('./notimplementederror');
import Py_Float = require('./float');

class Py_Int {
    isInt: boolean = true;
    constructor(public value: gLong) {}

    static fromInt(n: number): Py_Int {
        return new Py_Int(gLong.fromInt(n));
    }

    add(other: any): any {
        if (other.isInt)
            return new Py_Int(this.value.add(other.value));
        else
            return NIError;
    }

    sub(other: any): any {
        if (other instanceof Py_Int)
            return new Py_Int(this.value.subtract(other.value));
        else
            return NIError;
    }

    mult(other: any): any {
        if (other instanceof Py_Int)
            return new Py_Int(this.value.multiply(other.value));
        else
            return NIError;
    }

    floordiv(other: any): any {
        if (other instanceof Py_Int)
            return new Py_Int(this.value.div(other.value));
        else
            return NIError;
    }

    div(other: any): any {
        return this.floordiv(other);
    }

    truediv(other: any): any {
        if (other instanceof Py_Int) {
            var f: Py_Float = Py_Float.fromPy_Int(this);
            return f.truediv(other);
        } else
            return NIError;
    }

    mod(other: any): any {
        if (other instanceof Py_Int)
            return new Py_Int(this.value.modulo(other.value));
        else
            return NIError;
    }

    divmod(other: any): any {
        if (other instanceof Py_Int)
            return this.floordiv(other).mod(other);
        else
            return NIError;
    }

    pow(other: any): any {
        if (other instanceof Py_Int) {
            var temp = new Py_Int(this.value);
            for (var x = gLong.ONE; x.lessThan(other.value); x = x.add(gLong.ONE)) {
                temp = temp.mult(this);
            }
            return temp;
        } else
            return NIError;
    }

    lshift(other: any): any {
        if (other instanceof Py_Int)
            return new Py_Int(this.value.shiftLeft(other.value));
        else
            return NIError;
    }

    rshift(other: any): any {
        if (other instanceof Py_Int)
            return new Py_Int(this.value.shiftRight(other.value));
        else
            return NIError;
    }

    and(other: any): any {
        if (other instanceof Py_Int)
            return new Py_Int(this.value.and(other.value));
        else
            return NIError;
    }

    xor(other: any): any {
        if (other instanceof Py_Int)
            return new Py_Int(this.value.xor(other.value));
        else
            return NIError;
    }

    or(other: any): any {
        if (other instanceof Py_Int)
            return new Py_Int(this.value.or(other.value));
        else
            return NIError;
    }

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

    neg(): Py_Int {
        return this.mult(-1);
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

    toString(): string {
        return this.value.toString();
    }

    toNumber(): number {
        return this.value.toNumber();
    }
}
export = Py_Int;
