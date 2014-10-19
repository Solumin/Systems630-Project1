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
                case 0x00:
                    this.stop_code(frame);
                    break;
                case 0x01:
                    this.pop_top(frame);
                    break;
                case 0x02:
                    this.rot_two(frame);
                    break;
                case 0x03:
                    this.rot_three(frame);
                    break;
                case 0x04:
                    this.dup_top(frame);
                    break;
                case 0x05:
                    this.rot_four(frame);
                    break;
                case 0x09:
                    this.nop(frame);
                    break;
                case 0x0a:
                    this.unary_positive(frame);
                    break;
                case 0x0b:
                    this.unary_negative(frame);
                    break;
                case 0x0c:
                    this.unary_not(frame);
                    break;
                case 0x0d:
                    this.unary_convert(frame);
                    break;
                case 0x0f:
                    this.unary_invert(frame);
                    break;
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
                case 0x69:
                    this.build_map(frame);
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

    // def_op('BINARY_POWER', 19)
    // def_op('BINARY_MULTIPLY', 20)
    // def_op('BINARY_DIVIDE', 21)
    // def_op('BINARY_MODULO', 22)
    // def_op('BINARY_ADD', 23)
    //TODO: From here down to Opcodes: Checke if this is the correct implementation
    // 4: DUP_TOP
    Interpreter.prototype.dup_top = function (f) {
        var a = this.pop();
        this.push(a);
        this.push(a);
    };

    // 9: NOP
    Interpreter.prototype.nop = function (f) {
    };

    // 12: UNARY_NOT
    Interpreter.prototype.unary_not = function (f) {
        var a = this.pop();
        this.push(!a);
    };

    // 13: UNARY_CONVERT
    Interpreter.prototype.unary_convert = function (f) {
        var a = this.pop();

        // TODO: convert to string. need to test which type to know how to convert?
        this.push(a.toString());
    };

    // 15: UNARY_INVERT
    Interpreter.prototype.unary_invert = function (f) {
        var a = this.pop();
        this.push(-a - 1);
    };

    // 105: BUILD_MAP
    Interpreter.prototype.build_map = function (f) {
        throw new Error("Not implemented yet");
    };

    // Opcodes
    // 0: STOP_CODE
    Interpreter.prototype.stop_code = function (f) {
        throw new Error("Indicates end-of-code to the compiler, not used by the interpreter.");
    };

    // 1: POP_TOP
    Interpreter.prototype.pop_top = function (f) {
        this.pop();
    };

    // 2: ROT_TWO
    Interpreter.prototype.rot_two = function (f) {
        var a = this.pop();
        var b = this.pop();
        this.push(a);
        this.push(b);
    };

    // 3: ROT_THREE
    Interpreter.prototype.rot_three = function (f) {
        var a = this.pop();
        var b = this.pop();
        var c = this.pop();
        this.push(a);
        this.push(c);
        this.push(b);
    };

    // 5: ROT_FOUR
    Interpreter.prototype.rot_four = function (f) {
        var a = this.pop();
        var b = this.pop();
        var c = this.pop();
        var d = this.pop();
        this.push(a);
        this.push(d);
        this.push(c);
        this.push(b);
    };

    // 10: UNARY_POSITIVE
    Interpreter.prototype.unary_positive = function (f) {
        var a = this.pop();
        this.push(a);
    };

    // 11: UNARY_NEGATIVE
    Interpreter.prototype.unary_negative = function (f) {
        var a = this.pop();
        this.push(-1 * a);
    };

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
