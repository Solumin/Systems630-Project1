// <reference path="unmarshal.ts" />
// <reference path="frameobject.ts" />
// <reference path="codeobject.ts" />
// <reference path="supportobjects.ts" />

import frameObj = require('./frameobject');
import codeObj = require('./codeobject');
import support = require('./supportobjects');
import unmarshal = require('./unmarshal');
import funcObj = require('./funcobject');

import gLong = require("../lib/gLong");
var Decimal = require('../lib/decimal');

export class Interpreter {
    // The interpreter stack
    stack: any[]

    constructor() {
        this.stack = [];
    }

    // In Python, there's a hierarchy among numeric types.
    // When dealing with arithmetic ops between different numeric types, the
    // narrower type is "widened" to the wider type. The hierarchy is:
    // int < long < float < complex (where '<' denotes 'narrower than')
    // In our implementation, int32 and float are the same type, but int64 is
    // distinct.
    // int64 < long < number < complex is the hierarchy.
    // wider returns <0 if a '<' b, 0 if a '==' b, and >0 if a '>' b
    // or NaN if a or b is not numeric
    wider(a: any, b: any): number {
        return this.numericIndex(a) - this.numericIndex(b);
    }

    private numericIndex(x: any): number {
        if (x instanceof gLong) {
            return 0;
        } else if (x instanceof Decimal) {
            return 1;
        } else if (typeof x == 'number') {
            return 2;
        } else if (x instanceof support.Complex64) {
            return 3;
        } else {
            return NaN;
        }
    }

    private isNumeric(x: any): boolean {
        return ((x instanceof gLong) || (x instanceof Decimal) ||
                (typeof x == 'number') || (x instanceof support.Complex64));
    }

    // Assuming a is wider than b, this widens b to have the same type as a
    // int64 < long < number < complex is the hierarchy.
    // gLong < Decimal < number < support.Complex64
    widen(a: any, b: any): any {
        if (a instanceof support.Complex64) {
            if (typeof b == 'number') {
                return new support.Complex64(b, 0);
            } else { // Decimal and gLong both use 'toNumber'
                // May (will?) cause loss of precision
                return new support.Complex64(b.toNumber(), 0);
            }
        } else if (typeof a == 'number') {
            return b.toNumber(); // Decimal and gLong both use 'toNumber'
        } else { // a is a Decimal, b is a gLong
            return Decimal.fromString(b.toString())
        } // No need for case where a is a gLong, since b would also be a gLong
    }

    interpret(code: codeObj.Py_CodeObject) {
        return this.exec(
            new frameObj.Py_FrameObject(null, {}, code, {}, -1,
                code.firstlineno, {}, false));
    }

    exec(frame: frameObj.Py_FrameObject) {
        var code: codeObj.Py_CodeObject = frame.codeObj;
        for (var op = this.readOp(frame); op != undefined;
                op = this.readOp(frame)) {
            switch(op) {
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
    }

    readOp(f: frameObj.Py_FrameObject): number {
        f.lastInst += 1;
        return f.codeObj.code[f.lastInst];
    }

    readArg(f: frameObj.Py_FrameObject): number {
        f.lastInst += 1;
        var low = f.codeObj.code[f.lastInst];
        f.lastInst += 1;
        var high = f.codeObj.code[f.lastInst];
        return (high << 8) + low;
    }

    push(v) {
        // console.log("Pushing " + v + " to the stack");
        return this.stack.push(v);
    }

    pop() {
        // console.log("Popping stack...");
        return this.stack.pop();
    }


    //TODO: From here down to Opcodes: Check if this is the correct implementation
    // 4: DUP_TOP
    dup_top(f: frameObj.Py_FrameObject) {
        var a = this.pop();
        this.push(a);
        this.push(a);
    }
    // 9: NOP
    nop(f: frameObj.Py_FrameObject) {

    }
    // 13: UNARY_CONVERT
    // TODO: convert to string. need to test which type to know how to convert?
    unary_convert(f: frameObj.Py_FrameObject) {
        var a = this.pop();
        var b = a.toString();
        this.push(b);
    }
    // 26: BINARY_FLOOR_DIVIDE
    // Math.floor returns an integer. Should we change to float to be consistent with python?
    binary_floor_divide(f: frameObj.Py_FrameObject) {
        var a = this.pop();
        var b = this.pop();
        this.push(Math.floor(b / a));
    }
    // 27: BINARY_TRUE_DIVIDE
    // used when from __future__ import division is in effect
    //TODO: do not know how it is different from BINARY_DIVIDE
    binary_true_divide(f: frameObj.Py_FrameObject) {
        var a = this.pop();
        var b = this.pop();
        this.push(b / a);
    }
    //TODO: inplace operations
    // 28: INPLACE_FLOOR_DIVIDE
    inplace_floor_divide(f: frameObj.Py_FrameObject) {
        throw new Error("Not implemented yet");
    }
    // 29: INPLACE_TRUE_DIVIDE
    inplace_true_divide(f: frameObj.Py_FrameObject) {
        throw new Error("Not implemented yet");
    }
    // 60: STORE_SUBSCR
    // TODO: more testing
    store_subscr(f: frameObj.Py_FrameObject) {
        var a = this.pop();
        var b = this.pop();
        var c = this.pop();
        b[a] = c;
    }
    // 61: DELETE_SUBSCR
    // TODO: more testing
    delete_subscr(f: frameObj.Py_FrameObject) {
        var a = this.pop();
        var b = this.pop();
        this.push(b.splice(a,1));
    }
    // 102: BUILD_TUPLE
    // TODO: not sure what would be a tuple in typescript
    build_tuple(f: frameObj.Py_FrameObject) {
        throw new Error("Not implemented yet");
    }
    // 103: BUILD_LIST
    //TODO: seems to work but need more testing
    build_list(f: frameObj.Py_FrameObject) {
        var count = this.readArg(f);
        var l = [];
        for (var i = count-1; i >= 0; i--){
            l[i] = this.pop();
        }
        this.push(l);
    }
    // 105: BUILD_MAP
    build_map(f: frameObj.Py_FrameObject) {
        throw new Error("Not implemented yet");
    }

    // Opcodes
    // 0: STOP_CODE
    stop_code(f: frameObj.Py_FrameObject) {
        throw new Error("Indicates end-of-code to the compiler, not used by the interpreter.");
    }
    // 1: POP_TOP
    pop_top(f: frameObj.Py_FrameObject) {
        this.pop();
    }
    // 2: ROT_TWO
    rot_two(f: frameObj.Py_FrameObject) {
        var a = this.pop();
        var b = this.pop();
        this.push(a);
        this.push(b);
    }
    // 3: ROT_THREE
    rot_three(f: frameObj.Py_FrameObject) {
        var a = this.pop();
        var b = this.pop();
        var c = this.pop();
        this.push(a);
        this.push(c);
        this.push(b);
    }
    // 5: ROT_FOUR
    rot_four(f: frameObj.Py_FrameObject) {
        var a = this.pop();
        var b = this.pop();
        var c = this.pop();
        var d = this.pop();
        this.push(a);
        this.push(d);
        this.push(c);
        this.push(b);
    }
    // 10: UNARY_POSITIVE
    unary_positive(f: frameObj.Py_FrameObject) {
        var a = this.pop();
        this.push(a);
    }
    // 11: UNARY_NEGATIVE
    unary_negative(f: frameObj.Py_FrameObject) {
        var a = this.pop();
        this.push(-1 * a);
    }
    // 12: UNARY_NOT
    unary_not(f: frameObj.Py_FrameObject) {
        var a = this.pop();
        this.push(!a);
    }
    // 15: UNARY_INVERT
    unary_invert(f: frameObj.Py_FrameObject) {
        var a = this.pop();
        this.push(-a-1);
    }
    // 19: BINARY_POWER
    binary_power(f: frameObj.Py_FrameObject) {
        var a = this.pop();
        var b = this.pop();
        this.push(Math.pow(b, a));
    }
    // 20: BINARY_MULTIPLY
    binary_mult(f: frameObj.Py_FrameObject) {
        var a = this.pop();
        var b = this.pop();
        this.push(a * b);
    }
    // 21: BINARY_DIVIDE
    //used when from __future__ import division is not in effect
    binary_divide(f: frameObj.Py_FrameObject) {
        var a = this.pop();
        var b = this.pop();
        this.push(b / a);
    }
    // 22: BINARY_MODULO
    binary_modulo(f: frameObj.Py_FrameObject) {
        var a = this.pop();
        var b = this.pop();
        this.push(b % a);
    }
    // 23: BINARY_ADD
    binary_add(f: frameObj.Py_FrameObject) {
        var b = this.pop();
        var a = this.pop();
        if (typeof a == 'string' && typeof b == 'string') {
            this.push(a + b);
        } else if (typeof a == 'number' && typeof b == 'number') {
            this.push(a + b);
        } else if (this.isNumeric(a) && this.isNumeric(b)) {
            if (this.wider(a,b) > 0) {
                var wb = this.widen(a,b);
                if (a.add)
                    this.push(a.add(wb));
                else
                    this.push(a + wb);
            } else if (this.wider(a,b) < 0) {
                var wa = this.widen(b,a);
                if (wa.add)
                    this.push(wa.add(b));
                else
                    this.push(wa + b);
            } else {
                this.push(a.add(b));
            }
        } else { // Let a's add function handle b. It should handle types.
            this.push(a.add(b));
        }
    }

    // 24: BINARY_SUBTRACT
    binary_subtract(f: frameObj.Py_FrameObject) {
        var a = this.pop();
        var b = this.pop();
        this.push(b - a);
    }
    // 25: BINARY_SUBSCR
    binary_subscr(f: frameObj.Py_FrameObject) {
        var a = this.pop();
        var b = this.pop();
        this.push(b[a]);
    }
    // 62: BINARY_LSHIFT
    binary_lshift(f: frameObj.Py_FrameObject) {
        var a = this.pop();
        var b = this.pop();
        this.push(b << a);
    }
    // 63: BINARY_RSHIFT
    binary_rshift(f: frameObj.Py_FrameObject) {
        var a = this.pop();
        var b = this.pop();
        this.push(b >> a);
    }
    // 64: BINARY_AND
    binary_and(f: frameObj.Py_FrameObject) {
        var a = this.pop();
        var b = this.pop();
        this.push(a & b);
    }
    // 65: BINARY_XOR
    binary_xor(f: frameObj.Py_FrameObject) {
        var a = this.pop();
        var b = this.pop();
        this.push(a ^ b);
    }
    // 66: BINARY_OR
    binary_or(f: frameObj.Py_FrameObject) {
        var a = this.pop();
        var b = this.pop();
        this.push(a | b);
    }
    // 71: PRINT_ITEM
    print_item(f: frameObj.Py_FrameObject) {
        var a = this.pop();
        process.stdout.write(a.toString());
    }

    // 72: PRINT_NEWLINE
    print_newline(f: frameObj.Py_FrameObject) {
        process.stdout.write("\n");
    }

    // 83: RETURN_VALUE
    return_value(f: frameObj.Py_FrameObject) {
        // NOP -- clear stack?
    }

    // 90: STORE_NAME
    store_name(f: frameObj.Py_FrameObject) {
        var i = this.readArg(f);
        var val = this.pop();
        var name = f.codeObj.names[i];
        f.locals[name] = val;
    }

    // 100: LOAD_CONST
    load_const(f: frameObj.Py_FrameObject) {
        var i = this.readArg(f);
        this.push(f.codeObj.consts[i]);
    }

    // 101: LOAD_NAME
    load_name(f: frameObj.Py_FrameObject) {
        var i = this.readArg(f);
        var name = f.codeObj.names[i];
        this.push(f.locals[name]);
    }

    // 124: LOAD_FAST
    load_fast(f: frameObj.Py_FrameObject) {
        var i = this.readArg(f);
        var name = f.codeObj.varnames[i];
        this.push(f.locals[name]);
    }

    // 131: CALL_FUNCTION
    call_function(f: frameObj.Py_FrameObject) {
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

        var func: funcObj.Py_FuncObject = this.pop();

        var locals: { [name: string]: any } = {};
        func.code.varnames.reverse().forEach( function(elem, idx, arr) {
            locals[elem] = posVs[idx];
        });

        var newf = new frameObj.Py_FrameObject(f, f.builtins, func.code,
                func.globals, -1, func.code.firstlineno, locals, false);
        this.exec(newf)
    }

    // 132: MAKE_FUNCTION
    // TODO: Default param support
    make_function(f: frameObj.Py_FrameObject) {
        var numDefault = this.readArg(f);
        var code = this.pop();
        var func = new funcObj.Py_FuncObject(code, f.globals, null, code.name);
        this.push(func);
    }
}
