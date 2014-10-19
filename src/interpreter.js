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
                case 0x13:
                    this.binary_power(frame);
                    break;
                case 0x14:
                    this.binary_mult(frame);
                    break;
                case 0x015:
                    this.binary_divide(frame);
                    break;
                case 0x16:
                    this.binary_modulo(frame);
                    break;
                case 0x17:
                    this.binary_add(frame);
                    break;
                case 0x18:
                    this.binary_subtract(frame);
                    break;
                case 0x19:
                    this.binary_subscr(frame);
                    break;
                case 0x1a:
                    this.binary_floor_divide(frame);
                    break;
                case 0x1b:
                    this.binary_true_divide(frame);
                    break;
                case 0x1c:
                    this.inplace_floor_divide(frame);
                    break;
                case 0x1d:
                    this.inplace_true_divide(frame);
                    break;
                case 0x3c:
                    this.store_subscr(frame);
                    break;
                case 0x3d:
                    this.delete_subscr(frame);
                    break;
                case 0x3e:
                    this.binary_lshift(frame);
                    break;
                case 0x3f:
                    this.binary_rshift(frame);
                    break;
                case 0x40:
                    this.binary_and(frame);
                    break;
                case 0x41:
                    this.binary_xor(frame);
                    break;
                case 0x42:
                    this.binary_or(frame);
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
                case 0x66:
                    this.build_tuple(frame);
                    break;
                case 0x67:
                    this.build_list(frame);
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

    //TODO: From here down to Opcodes: Check if this is the correct implementation
    // 4: DUP_TOP
    Interpreter.prototype.dup_top = function (f) {
        var a = this.pop();
        this.push(a);
        this.push(a);
    };

    // 9: NOP
    Interpreter.prototype.nop = function (f) {
    };

    // 13: UNARY_CONVERT
    // TODO: convert to string. need to test which type to know how to convert?
    Interpreter.prototype.unary_convert = function (f) {
        var a = this.pop();
        var b = a.toString();
        this.push(b);
    };

    // 26: BINARY_FLOOR_DIVIDE
    // Math.floor returns an integer. Should we change to float to be consistent with python?
    Interpreter.prototype.binary_floor_divide = function (f) {
        var a = this.pop();
        var b = this.pop();
        this.push(Math.floor(b / a));
    };

    // 27: BINARY_TRUE_DIVIDE
    // used when from __future__ import division is in effect
    //TODO: do not know how it is different from BINARY_DIVIDE
    Interpreter.prototype.binary_true_divide = function (f) {
        var a = this.pop();
        var b = this.pop();
        this.push(b / a);
    };

    //TODO: inplace operations
    // 28: INPLACE_FLOOR_DIVIDE
    Interpreter.prototype.inplace_floor_divide = function (f) {
        throw new Error("Not implemented yet");
    };

    // 29: INPLACE_TRUE_DIVIDE
    Interpreter.prototype.inplace_true_divide = function (f) {
        throw new Error("Not implemented yet");
    };

    // 60: STORE_SUBSCR
    // TODO: more testing
    Interpreter.prototype.store_subscr = function (f) {
        var a = this.pop();
        var b = this.pop();
        var c = this.pop();
        b[a] = c;
    };

    // 61: DELETE_SUBSCR
    Interpreter.prototype.delete_subscr = function (f) {
        var a = this.pop();
        var b = this.pop();
        this.push(b.splice(a, 1));
    };

    // 62: BINARY_LSHIFT
    Interpreter.prototype.binary_lshift = function (f) {
        var a = this.pop();
        var b = this.pop();
        this.push(b << a);
    };

    // 63: BINARY_RSHIFT
    Interpreter.prototype.binary_rshift = function (f) {
        var a = this.pop();
        var b = this.pop();
        this.push(b >> a);
    };

    // 64: BINARY_AND
    Interpreter.prototype.binary_and = function (f) {
        var a = this.pop();
        var b = this.pop();
        this.push(a & b);
    };

    // 65: BINARY_XOR
    Interpreter.prototype.binary_xor = function (f) {
        var a = this.pop();
        var b = this.pop();
        this.push(a ^ b);
    };

    // 66: BINARY_OR
    Interpreter.prototype.binary_or = function (f) {
        var a = this.pop();
        var b = this.pop();
        this.push(a | b);
    };

    // 102: BUILD_TUPLE
    // TODO: not sure what would be a tuple in typescript
    Interpreter.prototype.build_tuple = function (f) {
        throw new Error("Not implemented yet");
    };

    // 103: BUILD_LIST
    //TODO: seems to work but need more testing
    Interpreter.prototype.build_list = function (f) {
        var count = this.readArg(f);
        var l = [];
        for (var i = count - 1; i >= 0; i--) {
            l[i] = this.pop();
        }
        this.push(l);
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

    // 12: UNARY_NOT
    Interpreter.prototype.unary_not = function (f) {
        var a = this.pop();
        this.push(!a);
    };

    // 15: UNARY_INVERT
    Interpreter.prototype.unary_invert = function (f) {
        var a = this.pop();
        this.push(-a - 1);
    };

    // 19: BINARY_POWER
    Interpreter.prototype.binary_power = function (f) {
        var a = this.pop();
        var b = this.pop();
        this.push(b ^ a);
    };

    // 20: BINARY_MULTIPLY
    Interpreter.prototype.binary_mult = function (f) {
        var a = this.pop();
        var b = this.pop();
        this.push(a * b);
    };

    // 21: BINARY_DIVIDE
    //used when from __future__ import division is not in effect
    Interpreter.prototype.binary_divide = function (f) {
        var a = this.pop();
        var b = this.pop();
        this.push(b / a);
    };

    // 22: BINARY_MODULO
    Interpreter.prototype.binary_modulo = function (f) {
        var a = this.pop();
        var b = this.pop();
        this.push(b % a);
    };

    // 23: BINARY_ADD
    Interpreter.prototype.binary_add = function (f) {
        var a = this.pop();
        var b = this.pop();
        this.push(a + b);
    };

    // 24: BINARY_SUBTRACT
    Interpreter.prototype.binary_subtract = function (f) {
        var a = this.pop();
        var b = this.pop();
        this.push(b - a);
    };

    // 25: BINARY_SUBSCR
    Interpreter.prototype.binary_subscr = function (f) {
        var a = this.pop();
        var b = this.pop();
        this.push(b[a]);
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
