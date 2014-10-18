// Python Function object
// Code: Code object, from stack
// Globals: Frame's globals, from where MAKE_FUNCTION is called
// Defaults: The default arguments and their values, a tuple on stack
// Closure: Tuple of cell objects? (Locals for closure?)
// doc: __doc__, can be anything
// name: Name of the function
// dict: __dict__, can be NULL

import codeObj = require('./codeobject');

export class Py_FuncObject {
    code: codeObj.Py_CodeObject;
    globals: { [name: string]: any };
    defaults: any[];
    //closure: ???
    name: string;

    constructor(code: codeObj.Py_CodeObject,
                globals: { [name: string]: any },
                defaults: any[],
                name: string) {
        this.code = code;
        this.globals = globals;
        this.defaults = defaults;
        this.name = name
    }
}
