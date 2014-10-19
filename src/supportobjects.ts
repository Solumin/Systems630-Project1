// Null is an empty value. Mostly used in the interpreter for dictionaries.
// Python has a single null object called "None".
export class NullSingleton {
    private static _instance: NullSingleton;

    constructor() {
        if(NullSingleton._instance) {
            throw new Error("Null is already instantiated. Use get() instead.");
        }
        NullSingleton._instance = this;
    }

    public static get(): NullSingleton {
        if(NullSingleton._instance == null) {
            NullSingleton._instance = new NullSingleton();
            return NullSingleton._instance;
        }
    }

    toString(): string {
        return "None";
    }
}
export var None = NullSingleton.get();

export class Complex64 {
    real: number;
    imag: number;

    constructor(r: number, j: number) {
        this.real = r;
        this.imag = j;
    }

    toString(): string {
        return "(" + this.real + " + " + this.imag + "j)";
    }
}