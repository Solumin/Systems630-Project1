import NIError = require('./notimplementederror');
import Py_Int = require('./integer');
import Py_Long = require('./long');
import Py_Float = require('./float');

class Py_Complex {
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

    add(other: any): any {
        if (other instanceof Py_Complex)
            return new Py_Complex(this.real + other.real, this.imag +
                    other.imag);
        else
            return NIError;
    }

    toString(): string {
        return "(" + this.real + " + " + this.imag + "j)";
    }
}
export = Py_Complex;
