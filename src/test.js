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
/// <reference path="unmarshal.ts" />
/// <reference path="codeobject.ts" />
var PyInterpreter;
(function (PyInterpreter) {
    var Py_FrameObject = (function () {
        // Tracing function for this frame
        // trace:
        function Py_FrameObject(back, builtins, code, globals, lastInst, lineNum, locals, restricted) {
            this.back = back;
            this.builtins = builtins;
            this.codeObj = code;
            this.globals = globals;
            this.lastInst = lastInst;
            this.lineNum = lineNum;
            this.locals = locals;
            this.restricted = restricted;
        }
        return Py_FrameObject;
    })();
    PyInterpreter.Py_FrameObject = Py_FrameObject;
})(PyInterpreter || (PyInterpreter = {}));
/// <reference path="unmarshal.ts" />
/// <reference path="frameobject.ts" />
/// <reference path="codeobject.ts" />
var PyInterpreter;
(function (PyInterpreter) {
    var Interpreter = (function () {
        function Interpreter() {
            this.stack = [];
        }
        Interpreter.prototype.interpret = function (code) {
            return this.exec(new PyInterpreter.Py_FrameObject(null, {}, code, {}, -1, 0, {}, false));
        };
        Interpreter.prototype.exec = function (frame) {
            var code = frame.codeObj;
        };
        Interpreter.prototype.readOp = function (f) {
            f.lastInst += 1;
            return f.codeObj.code[f.lastInst];
        };
        Interpreter.prototype.readArg = function (f) {
            f.lastInst += 1;
            var low = f.codeObj.code.charCodeAt(f.lastInst);
            f.lastInst += 1;
            var high = f.codeObj.code.charCodeAt(f.lastInst);
            return (high << 8) + low;
        };
        Interpreter.prototype.push = function (v) {
            return this.stack.push(v);
        };
        Interpreter.prototype.pop = function () {
            return this.stack.pop();
        };
        // Opcodes
        // 23: BINARY_ADD
        Interpreter.prototype.binary_add = function (f) {
            var a = this.pop();
            var b = this.pop();
            return a + b;
        };
        // 71: PRINT_ITEM
        Interpreter.prototype.print_item = function (f) {
            var a = this.pop();
            console.log(a);
        };
        // 72: PRINT_NEWLINE
        Interpreter.prototype.print_newline = function (f) {
            console.log("\n");
        };
        // 83: RETURN_VALUE
        Interpreter.prototype.return_value = function (f) {
            return this.pop();
        };
        // 90: STORE_NAME
        Interpreter.prototype.store_name = function (f) {
            var i = this.readArg(f);
            var val = this.pop();
            var name = f.codeObj.names[i];
            f.locals[name] = val;
        };
        // 100: LOAD_CONST
        Interpreter.prototype.load_const = function (f) {
            var i = this.readArg(f);
            this.push(f.codeObj.consts[i]);
        };
        // 101: LOAD_NAME
        Interpreter.prototype.load_name = function (f) {
            var i = this.readArg(f);
            var name = f.codeObj.names[i];
            this.push(f.locals[name]);
        };
        // 124: LOAD_FAST
        Interpreter.prototype.load_fast = function (f) {
            var i = this.readArg(f);
            this.push(f.codeObj.varnames[i]);
        };
        // 131: CALL_FUNCTION
        Interpreter.prototype.call_function = function (f) {
            var i = this.readArg(f);
            // number of positional parameters
            var posNum = i & 0xff;
            // number of keyword arguments
            var keyNum = (i >> 8) & 0xff;
            console.log(this.stack);
            throw new Error("Function calls are weird.");
        };
        // 132: MAKE_FUNCTION
        Interpreter.prototype.make_function = function (f) {
            throw new Error("The documentation kind of sucks here");
        };
        return Interpreter;
    })();
    PyInterpreter.Interpreter = Interpreter;
})(PyInterpreter || (PyInterpreter = {}));
/// <reference path="unmarshal.ts" />
/// <reference path="interpreter.ts" />
/// <reference path="frameobject.ts" />
var u = new Unmarshaller("../examples/simpleadd.pyc");
var code = u.value();
console.log(code);
code.consts.forEach(function (element, index, array) {
    console.log("\t" + index + ": " + element);
});
