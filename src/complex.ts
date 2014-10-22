import NIError = require('./notimplementederror');

class Complex64 {
    real: number;
    imag: number;

    constructor(r: number, j: number) {
        this.real = r;
        this.imag = j;
    }

    add(other: any): any {
        if (other instanceof Complex64)
            return new Complex64(this.real + other.real, this.imag +
                    other.imag);
        else
            return NIError;
    }

    toString(): string {
        return "(" + this.real + " + " + this.imag + "j)";
    }
}
export = Complex64;
