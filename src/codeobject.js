var PyInterpreter;
(function (PyInterpreter) {
    var Py_CodeObject = (function () {
        // Args are in marshal order
        function Py_CodeObject(argcount, nlocals, stacksize, flags, code, consts, names, varnames, freevars, cellvars, filename, name, firstlineno, lnotab) {
            this.argcount = argcount;
            this.cellvars = cellvars;
            this.code = code;
            this.consts = consts;
            this.filename = filename;
            this.firstlineno = firstlineno;
            this.flags = flags;
            this.freevars = freevars;
            this.lnotab = lnotab;
            this.name = name;
            this.names = names;
            this.nlocals = nlocals;
            this.stacksize = stacksize;
            this.varnames = varnames;
        }
        return Py_CodeObject;
    })();
    PyInterpreter.Py_CodeObject = Py_CodeObject;
})(PyInterpreter || (PyInterpreter = {}));
