class Complex64 {
    real: number;
    imag: number;

    constructor(r: number, j: number) {
        this.real = r;
        this.imag = j;
    }

    add(other: Complex64): Complex64 {
        return new Complex64(this.real + other.real, this.imag + other.imag)
    }

    toString(): string {
        return "(" + this.real + " + " + this.imag + "j)";
    }
}
export = Complex64;
