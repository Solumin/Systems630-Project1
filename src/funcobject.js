// Python Function object
// Code: Code object, from stack
// Globals: Frame's globals, from where MAKE_FUNCTION is called
// Defaults: The default arguments and their values, a tuple on stack
// Closure: Tuple of cell objects? (Locals for closure?)
// doc: __doc__, can be anything
// name: Name of the function
// dict: __dict__, can be NULL
var Py_FuncObject = (function () {
    function Py_FuncObject(code, globals, defaults, name) {
        this.code = code;
        this.globals = globals;
        this.defaults = defaults;
        this.name = name;
    }
    return Py_FuncObject;
})();
exports.Py_FuncObject = Py_FuncObject;
