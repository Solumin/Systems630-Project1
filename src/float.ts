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

    truediv(other: any): any {
        return NIError;
    }

    toString(): string {
        return this.value.toString();
    }
}
export = Py_Float;
