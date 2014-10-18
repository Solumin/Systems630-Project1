// <reference path="unmarshal.ts" />
// <reference path="frameobject.ts" />
// <reference path="codeobject.ts" />
// <reference path="supportobjects.ts" />
var frameObj = require('./frameobject');
var funcObj = require('./funcobject');
var Interpreter = (function () {
    function Interpreter() {
        this.stack = [];
    }
    Interpreter.prototype.interpret = function (code) {
        return this.exec(new frameObj.Py_FrameObject(null, {}, code, {}, -1, code.firstlineno, {}, false));
    };
    Interpreter.prototype.exec = function (frame) {
        var code = frame.codeObj;
        for (var op = this.readOp(frame); op != undefined; op = this.readOp(frame)) {
            switch (op) {
                case 0x14:
                    this.binary_mult(frame);
                    break;
                case 0x17:
                    this.binary_add(frame);
                    break;
                case 0x47:
                    this.print_item(frame);
                    break;
                case 0x48:
                    this.print_newline(frame);
                    break;
                case 0x53:
                    this.return_value(frame);
                    break;
                case 0x5a:
                    this.store_name(frame);
                    break;
                case 0x64:
                    this.load_const(frame);
                    break;
                case 0x65:
                    this.load_name(frame);
                    break;
                case 0x7c:
                    this.load_fast(frame);
                    break;
                case 0x83:
                    this.call_function(frame);
                    break;
                case 0x84:
                    this.make_function(frame);
                    break;
                default:
                    throw new Error("Unknown op code: " + op);
                    break;
            }
        }
    };
    Interpreter.prototype.readOp = function (f) {
        f.lastInst += 1;
        return f.codeObj.code[f.lastInst];
    };
    Interpreter.prototype.readArg = function (f) {
        f.lastInst += 1;
        var low = f.codeObj.code[f.lastInst];
        f.lastInst += 1;
        var high = f.codeObj.code[f.lastInst];
        return (high << 8) + low;
    };
    Interpreter.prototype.push = function (v) {
        // console.log("Pushing " + v + " to the stack");
        return this.stack.push(v);
    };
    Interpreter.prototype.pop = function () {
        // console.log("Popping stack...");
        return this.stack.pop();
    };
    // Opcodes
    // 20: BINARY_MULTIPLY
    Interpreter.prototype.binary_mult = function (f) {
        var a = this.pop();
        var b = this.pop();
        this.push(a * b);
    };
    // 23: BINARY_ADD
    Interpreter.prototype.binary_add = function (f) {
        var a = this.pop();
        var b = this.pop();
        this.push(a + b);
    };
    // 71: PRINT_ITEM
    Interpreter.prototype.print_item = function (f) {
        var a = this.pop();
        if (a == undefined) {
            throw new Error("Attempted to write undefined data\n" + this.stack);
        }
        process.stdout.write(a.toString());
    };
    // 72: PRINT_NEWLINE
    Interpreter.prototype.print_newline = function (f) {
        process.stdout.write("\n");
    };
    // 83: RETURN_VALUE
    Interpreter.prototype.return_value = function (f) {
        // NOP -- clear stack?
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
        var name = f.codeObj.varnames[i];
        this.push(f.locals[name]);
    };
    // 131: CALL_FUNCTION
    Interpreter.prototype.call_function = function (f) {
        var i = this.readArg(f);
        // number of positional parameters
        var posNum = i & 0xff;
        // number of keyword arguments
        var keyNum = (i >> 8) & 0xff;
        var keyVs = [];
        var posVs = [];
        for (var x = 0; x < keyNum; x++) {
            keyVs.push(this.pop());
        }
        for (var x = 0; x < posNum; x++) {
            posVs.push(this.pop());
        }
        var func = this.pop();
        var locals = {};
        func.code.varnames.reverse().forEach(function (elem, idx, arr) {
            locals[elem] = posVs[idx];
        });
        var newf = new frameObj.Py_FrameObject(f, f.builtins, func.code, func.globals, -1, func.code.firstlineno, locals, false);
        this.exec(newf);
    };
    // 132: MAKE_FUNCTION
    // TODO: Default param support
    Interpreter.prototype.make_function = function (f) {
        var numDefault = this.readArg(f);
        var code = this.pop();
        var func = new funcObj.Py_FuncObject(code, f.globals, null, code.name);
        this.push(func);
    };
    return Interpreter;
})();
exports.Interpreter = Interpreter;
