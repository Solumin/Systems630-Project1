import frameObj = require('./frameobject');
import codeObj = require('./codeobject');
import support = require('./supportobjects');
import unmarshal = require('./unmarshal');
import funcObj = require('./funcobject');
import opcodes = require('./opcodes');

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

    // toBool returns false if the argument would be considered False in Python
    // Similarly, returns true if it would be considered true.
    toBool(a: any): boolean {
        if (typeof a == 'boolean') {
            return a
        }
        switch(a) {
            case support.None:
            case gLong.ZERO:
            case Decimal.fromNumber(0):
            case new support.Complex64(0,0):
            case 0:
            case 0.0:
            case '':
            case []:
            case {}:
                return false;
                break;
            default:
                return true;
        }
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
                case opcodes.STOP_CODE:
                    this.stop_code(frame);
                    break;
                case opcodes.POP_TOP:
                    this.pop_top(frame);
                    break;
                case opcodes.ROT_TWO:
                    this.rot_two(frame);
                    break;
                case opcodes.ROT_THREE:
                    this.rot_three(frame);
                    break;
                case opcodes.DUP_TOP:
                    this.dup_top(frame);
                    break;
                case opcodes.ROT_FOUR:
                    this.rot_four(frame);
                    break;
                case opcodes.NOP:
                    this.nop(frame);
                    break;
                case opcodes.UNARY_POSITIVE:
                    this.unary_positive(frame);
                    break;
                case opcodes.UNARY_NEGATIVE:
                    this.unary_negative(frame);
                    break;
                case opcodes.UNARY_NOT:
                    this.unary_not(frame);
                    break;
                case opcodes.UNARY_CONVERT:
                    this.unary_convert(frame);
                    break;
                case opcodes.UNARY_INVERT:
                    this.unary_invert(frame);
                    break;
                case opcodes.BINARY_POWER:
                    this.binary_power(frame);
                    break;
                case opcodes.BINARY_MULTIPLY:
                    this.binary_mult(frame);
                    break;
                case opcodes.BINARY_DIVIDE:
                    this.binary_divide(frame);
                    break;
                case opcodes.BINARY_MODULO:
                    this.binary_modulo(frame);
                    break;
                case opcodes.BINARY_ADD:
                    this.binary_add(frame);
                    break;
                case opcodes.BINARY_SUBTRACT:
                    this.binary_subtract(frame);
                    break;
                case opcodes.BINARY_SUBSCR:
                    this.binary_subscr(frame);
                    break;
                case opcodes.BINARY_FLOOR_DIVIDE:
                    this.binary_floor_divide(frame);
                    break;
                case opcodes.BINARY_TRUE_DIVIDE:
                    this.binary_true_divide(frame);
                    break;
                case opcodes.INPLACE_FLOOR_DIVIDE:
                    this.inplace_floor_divide(frame);
                    break;
                case opcodes.INPLACE_TRUE_DIVIDE:
                    this.inplace_true_divide(frame);
                    break;
                case opcodes.STORE_SUBSCR:
                    this.store_subscr(frame);
                    break;
                case opcodes.DELETE_SUBSCR:
                    this.delete_subscr(frame);
                    break;
                case opcodes.BINARY_LSHIFT:
                    this.binary_lshift(frame);
                    break;
                case opcodes.BINARY_RSHIFT:
                    this.binary_rshift(frame);
                    break;
                case opcodes.BINARY_AND:
                    this.binary_and(frame);
                    break;
                case opcodes.BINARY_XOR:
                    this.binary_xor(frame);
                    break;
                case opcodes.BINARY_OR:
                    this.binary_or(frame);
                    break;
                case opcodes.PRINT_ITEM:
                    this.print_item(frame);
                    break;
                case opcodes.PRINT_NEWLINE:
                    this.print_newline(frame);
                    break;
                case opcodes.RETURN_VALUE:
                    this.return_value(frame);
                    break;
                case opcodes.STORE_NAME:
                    this.store_name(frame);
                    break;
                case opcodes.LOAD_CONST:
                    this.load_const(frame);
                    break;
                case opcodes.LOAD_NAME:
                    this.load_name(frame);
                    break;
                case opcodes.BUILD_TUPLE:
                    this.build_tuple(frame);
                    break;
                case opcodes.BUILD_LIST:
                    this.build_list(frame);
                    break;
                case opcodes.BUILD_MAP:
                    this.build_map(frame);
                    break;
                case opcodes.COMPARE_OP:
                    this.compare_op(frame);
                    break;
                case opcodes.JUMP_FORWARD:
                    this.jump_forward(frame);
                    break;
                case opcodes.JUMP_IF_FALSE_OR_POP:
                    this.jump_if_false_or_pop(frame);
                    break;
                case opcodes.JUMP_IF_TRUE_OR_POP:
                    this.jump_if_true_or_pop(frame);
                    break;
                case opcodes.JUMP_ABSOLUTE:
                    this.jump_absolute(frame);
                    break;
                case opcodes.POP_JUMP_IF_FALSE:
                    this.pop_jump_if_false(frame);
                    break;
                case opcodes.POP_JUMP_IF_TRUE:
                    this.pop_jump_if_true(frame);
                    break;
                case opcodes.LOAD_FAST:
                    this.load_fast(frame);
                    break;
                case opcodes.CALL_FUNCTION:
                    this.call_function(frame);
                    break;
                case opcodes.MAKE_FUNCTION:
                    this.make_function(frame);
                    break;
                case opcodes.SLICE_0:
                    this.slice_0(frame);
                    break;
                case opcodes.SLICE_1:
                    this.slice_1(frame);
                    break;
                case opcodes.SLICE_2:
                    this.slice_2(frame);
                    break;
                case opcodes.SLICE_3:
                    this.slice_3(frame);
                    break;
                case opcodes.STORE_SLICE_0:
                    this.store_slice_0(frame);
                    break;
                case opcodes.STORE_SLICE_1:
                    this.store_slice_1(frame);
                    break;
                case opcodes.STORE_SLICE_2:
                    this.store_slice_2(frame);
                    break;
                case opcodes.STORE_SLICE_3:
                    this.store_slice_3(frame);
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
        return this.stack.push(v);
    }

    pop() {
        return this.stack.pop();
    }

    peek() {
        return this.stack[this.stack.length-1];
    }

    //TODO: From here down to Opcodes: Check if this is the correct implementation
    // 4: DUP_TOP
    dup_top(f: frameObj.Py_FrameObject) {
        this.push(this.peek());
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
    // 30: SLICE+0
    slice_0(f: frameObj.Py_FrameObject) {
        var a = this.pop();
        var b = a.slice(0);
        this.push(b);
    }
    // 31: SLICE+1
    slice_1(f: frameObj.Py_FrameObject) {
        var a = this.pop();
        var b = this.pop();
        this.push(b.slice(a));
    }
    // 32: SLICE+2
    slice_2(f: frameObj.Py_FrameObject) {
        var a = this.pop();
        var b = this.pop();
        this.push(b.slice(0,a));
    }
    // 33: SLICE+3
    slice_3(f: frameObj.Py_FrameObject) {
        var a = this.pop();
        var b = this.pop();
        var c = this.pop();
        this.push(c.slice(b,a));
    }
    //TODO: store_slice is not working yet
    // 40: STORE_SLICE+0
    store_slice_0(f: frameObj.Py_FrameObject) {
        var a = this.pop();
        var b = this.pop();
        var aux = a.slice(0);
        aux = b;
    }
    // 41: STORE_SLICE+1
    store_slice_1(f: frameObj.Py_FrameObject) {
        var a = this.pop();
        var b = this.pop();
        var c = this.pop();
        var aux = b.slice(a);
        aux = c;
    }
    // 42: STORE_SLICE+2
    store_slice_2(f: frameObj.Py_FrameObject) {
        var a = this.pop();
        var b = this.pop();
        var c = this.pop();
        var aux = b.slice(0,a);
        aux = c;
    }
    // 43: STORE_SLICE+3
    store_slice_3(f: frameObj.Py_FrameObject) {
        var a = this.pop();
        var b = this.pop();
        var c = this.pop();
        var d = this.pop();
        var aux = c.slice(b,a);
        aux = d;
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

    // 107: COMPARE_OP
    compare_op(f: frameObj.Py_FrameObject) {
        var comp_ops = ['<', '<=', '==', '>', '>=', 'in', 'not in',
                        'is', 'is not', 'exception match'];
        var opidx = this.readArg(f);
        var op = comp_ops[opidx];
        var b = this.pop();
        var a = this.pop();

        switch(op) {
            case '<':
                return a < b;
                break;
            case '<=':
                return a <= b;
                break;
            case '==':
                return a == b;
                break;
            case '>':
                return a > b;
                break;
            case '>=':
                return a >= b;
                break;
            case 'in':
                return b.some( function(elem, idx, arr) {
                    return elem == a;
                });
                break;
            case 'not in':
                return b.every( function(elem, idx, arr) {
                    return elem != a;
                });
                break;
            case 'is':
                return a == b;
                break;
            case 'is not':
                return a != b;
                break;
            case 'exception match':
                throw new Error("Python Exceptions are not supported");
            default:
                throw new Error("Unknown comparison operator");
        }
    }

    // 110: JUMP_FORWARD
    jump_forward(f: frameObj.Py_FrameObject) {
        var delta = this.readArg(f);
        f.lastInst += delta
    }

    // 111: JUMP_IF_FALSE_OR_POP
    jump_if_false_or_pop(f: frameObj.Py_FrameObject) {
        var target = this.readArg(f);
        if (this.toBool(this.peek())) {
            this.pop();
        } else {
            f.lastInst = target;
        }
    }

    // 112: JUMP_IF_TRUE_OR_POP
    jump_if_true_or_pop(f: frameObj.Py_FrameObject) {
        var target = this.readArg(f);
        if (this.toBool(this.peek())) {
            f.lastInst = target;
        } else {
            this.pop();
        }
    }

    // 113: JUMP_ABSOLUTE
    jump_absolute(f: frameObj.Py_FrameObject) {
        var target = this.readArg(f);
        f.lastInst = target;
    }

    // 114: POP_JUMP_IF_FALSE
    pop_jump_if_false(f: frameObj.Py_FrameObject) {
        var target = this.readArg(f);
        if (this.toBool(this.pop()))
            f.lastInst = target;
    }

    // 115: POP_JUMP_IF_TRUE
    pop_jump_if_true(f: frameObj.Py_FrameObject) {
        var target = this.readArg(f);
        if (!this.toBool(this.pop()))
            f.lastInst = target;
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
        var keyNames: string[] = [];
        var keyVals: any[] = [];
        var posVals = [];
        var locals: { [name: string]: any } = {};

        for (var x = 0; x < keyNum; x++) {
            keyVals.push(this.pop());
            keyNames.push(this.pop());
        }

        for (var x = 0; x < posNum; x++) {
            posVals.push(this.pop());
        }

        var func: funcObj.Py_FuncObject = this.pop();

        for (var x = 0; x < keyNames.length; x++) {
            locals[keyNames[x]] = keyVals[x];
        }

        func.code.varnames.reverse().forEach( function(name, idx, array) {
            if (locals[name] == undefined)
                locals[name] = posVals.pop() || func.defaults[name];
        });

        var newf = new frameObj.Py_FrameObject(f, f.builtins, func.code,
                func.globals, -1, func.code.firstlineno, locals, false);
        this.exec(newf)
    }

    // 132: MAKE_FUNCTION
    make_function(f: frameObj.Py_FrameObject) {
        var numDefault = this.readArg(f);
        var defaults: { [name: string]: any } = {};

        var code = this.pop();

        for (var i = code.varnames.length-1; i >= 0; i--) {
            defaults[code.varnames[i]] = this.pop();
        }

        var func = new funcObj.Py_FuncObject(code, f.globals, defaults, code.name);
        this.push(func);
    }
}
