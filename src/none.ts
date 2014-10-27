// Python has a single null object called "None". It's used to represent no
// value. Here we loosely use it in singleton form for easier comparisons.
class NullSingleton {
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
var None = NullSingleton.get();
export = None;
