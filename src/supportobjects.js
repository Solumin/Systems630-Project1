var PyInterpreter;
(function (PyInterpreter) {
    // Null is an empty value. Mostly used in the interpreter for dictionaries.
    // Python has a single null object called "None".
    var NullSingleton = (function () {
        function NullSingleton() {
            if (NullSingleton._instance) {
                throw new Error("Null is already instantiated. Use get() instead.");
            }
            NullSingleton._instance = this;
        }
        NullSingleton.get = function () {
            if (NullSingleton._instance == null) {
                NullSingleton._instance = new NullSingleton();
                return NullSingleton._instance;
            }
        };
        NullSingleton.prototype.toString = function () {
            return "None";
        };
        return NullSingleton;
    })();
    PyInterpreter.NullSingleton = NullSingleton;
    PyInterpreter.None = NullSingleton.get();
    var Complex64 = (function () {
        function Complex64(r, j) {
            this.real = r;
            this.imag = j;
        }
        return Complex64;
    })();
    PyInterpreter.Complex64 = Complex64;
})(PyInterpreter || (PyInterpreter = {}));
