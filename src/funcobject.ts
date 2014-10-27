// Python Function object
// Code: Code object, from stack
// Globals: Frame's globals, from where MAKE_FUNCTION is called
// Defaults: The default arguments and their values, a tuple on stack
// Closure: Tuple of cell objects? (Locals for closure?)
// doc: __doc__, can be anything
// name: Name of the function
// dict: __dict__, can be NULL

import Py_CodeObject = require('./codeobject');

// Similar to frame objects, Function Objects wrap Python functions. However,
// these are more the data representation of functions, and are transformed into
// Frame Objects when the function is called.
class Py_FuncObject {
    code: Py_CodeObject;
    globals: { [name: string]: any };
    defaults: { [name: string]: any};
    //closure: ???
    name: string;

    constructor(code: Py_CodeObject,
                globals: { [name: string]: any },
                defaults: { [name: string]: any},
                name: string) {
        this.code = code;
        this.globals = globals;
        this.defaults = defaults;
        this.name = name
    }
}
export = Py_FuncObject;
