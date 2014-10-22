import Py_FrameObject = require('./frameobject');
import Py_CodeObject = require('./codeobject');
import Complex64 = require('./complex');
import None = require('./none');
import unmarshal = require('./unmarshal');
import Py_FuncObject = require('./funcobject');
import opcodes = require('./opcodes');

import gLong = require("../lib/gLong");
var Decimal = require('../lib/decimal');

class Interpreter {
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
        } else if (x instanceof Complex64) {
            return 3;
        } else {
            return NaN;
        }
    }

    private isNumeric(x: any): boolean {
        return ((x instanceof gLong) || (x instanceof Decimal) ||
                (typeof x == 'number') || (x instanceof Complex64));
    }

    // Assuming a is wider than b, this widens b to have the same type as a
    // int64 < long < number < complex is the hierarchy.
    // gLong < Decimal < number < Complex64
    widen(a: any, b: any): any {
        if (a instanceof Complex64) {
            if (typeof b == 'number') {
                return new Complex64(b, 0);
            } else { // Decimal and gLong both use 'toNumber'
                // May (will?) cause loss of precision
                return new Complex64(b.toNumber(), 0);
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
            case None:
            case gLong.ZERO:
            case Decimal.fromNumber(0):
            case new Complex64(0,0):
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

    interpret(code: Py_CodeObject) {
        return this.exec(
            new Py_FrameObject(null, {}, code, {}, -1,
                code.firstlineno, {}, false));
    }

    exec(frame: Py_FrameObject) {
        var code: Py_CodeObject = frame.codeObj;
        for (var op = frame.readOp(); op != undefined; op = frame.readOp()) {
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
                case opcodes.STORE_FAST:
                    this.store_fast(frame);
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

    //TODO: From here down to Opcodes: Check if this is the correct implementation
    // 4: DUP_TOP
    dup_top(f: Py_FrameObject) {
        f.push(f.peek());
    }

    // 9: NOP
    nop(f: Py_FrameObject) {

    }

    // 13: UNARY_CONVERT
    // TODO: convert to string. need to test which type to know how to convert?
    unary_convert(f: Py_FrameObject) {
        var a = f.pop();
        var b = a.toString();
        f.push(b);
    }

    // 26: BINARY_FLOOR_DIVIDE
    // Math.floor returns an integer. Should we change to float to be consistent with python?
    binary_floor_divide(f: Py_FrameObject) {
        var a = f.pop();
        var b = f.pop();
        f.push(Math.floor(b / a));
    }

    // 27: BINARY_TRUE_DIVIDE
    // used when from __future__ import division is in effect
    //TODO: do not know how it is different from BINARY_DIVIDE
    binary_true_divide(f: Py_FrameObject) {
        var a = f.pop();
        var b = f.pop();
        f.push(b / a);
    }

    //TODO: inplace operations
    // 28: INPLACE_FLOOR_DIVIDE
    inplace_floor_divide(f: Py_FrameObject) {
        throw new Error("Not implemented yet");
    }
    // 29: INPLACE_TRUE_DIVIDE
    inplace_true_divide(f: Py_FrameObject) {
        throw new Error("Not implemented yet");
    }
    // 30: SLICE+0
    slice_0(f: Py_FrameObject) {
        var a = f.pop();
        var b = a.slice(0);
        f.push(b);
    }
    // 31: SLICE+1
    slice_1(f: Py_FrameObject) {
        var a = f.pop();
        var b = f.pop();
        f.push(b.slice(a));
    }
    // 32: SLICE+2
    slice_2(f: Py_FrameObject) {
        var a = f.pop();
        var b = f.pop();
        f.push(b.slice(0,a));
    }
    // 33: SLICE+3
    slice_3(f: Py_FrameObject) {
        var a = f.pop();
        var b = f.pop();
        var c = f.pop();
        f.push(c.slice(b,a));
    }
    //TODO: store_slice is not working yet
    // 40: STORE_SLICE+0
    store_slice_0(f: Py_FrameObject) {
        var a = f.pop();
        var b = f.pop();
        var aux = a.slice(0);
        aux = b;
    }
    // 41: STORE_SLICE+1
    store_slice_1(f: Py_FrameObject) {
        var a = f.pop();
        var b = f.pop();
        var c = f.pop();
        var aux = b.slice(a);
        aux = c;
    }
    // 42: STORE_SLICE+2
    store_slice_2(f: Py_FrameObject) {
        var a = f.pop();
        var b = f.pop();
        var c = f.pop();
        var aux = b.slice(0,a);
        aux = c;
    }
    // 43: STORE_SLICE+3
    store_slice_3(f: Py_FrameObject) {
        var a = f.pop();
        var b = f.pop();
        var c = f.pop();
        var d = f.pop();
        var aux = c.slice(b,a);
        aux = d;
    }
    // 60: STORE_SUBSCR
    // TODO: more testing
    store_subscr(f: Py_FrameObject) {
        var a = f.pop();
        var b = f.pop();
        var c = f.pop();
        b[a] = c;
    }
    // 61: DELETE_SUBSCR
    // TODO: more testing
    delete_subscr(f: Py_FrameObject) {
        var a = f.pop();
        var b = f.pop();
        f.push(b.splice(a,1));
    }

    // 102: BUILD_TUPLE
    // TODO: not sure what would be a tuple in typescript
    build_tuple(f: Py_FrameObject) {
        throw new Error("Not implemented yet");
    }

    // 103: BUILD_LIST
    //TODO: seems to work but need more testing
    build_list(f: Py_FrameObject) {
        var count = f.readArg();
        var l = [];
        for (var i = count-1; i >= 0; i--){
            l[i] = f.pop();
        }
        f.push(l);
    }

    // 105: BUILD_MAP
    build_map(f: Py_FrameObject) {
        throw new Error("Not implemented yet");
    }

    // Opcodes
    // 0: STOP_CODE
    stop_code(f: Py_FrameObject) {
        throw new Error("Indicates end-of-code to the compiler, not used by the interpreter.");
    }

    // 1: POP_TOP
    pop_top(f: Py_FrameObject) {
        f.pop();
    }

    // 2: ROT_TWO
    rot_two(f: Py_FrameObject) {
        var a = f.pop();
        var b = f.pop();
        f.push(a);
        f.push(b);
    }

    // 3: ROT_THREE
    rot_three(f: Py_FrameObject) {
        var a = f.pop();
        var b = f.pop();
        var c = f.pop();
        f.push(a);
        f.push(c);
        f.push(b);
    }

    // 5: ROT_FOUR
    rot_four(f: Py_FrameObject) {
        var a = f.pop();
        var b = f.pop();
        var c = f.pop();
        var d = f.pop();
        f.push(a);
        f.push(d);
        f.push(c);
        f.push(b);
    }

    // 10: UNARY_POSITIVE
    unary_positive(f: Py_FrameObject) {
        var a = f.pop();
        f.push(a);
    }

    // 11: UNARY_NEGATIVE
    unary_negative(f: Py_FrameObject) {
        var a = f.pop();
        f.push(-1 * a);
    }

    // 12: UNARY_NOT
    unary_not(f: Py_FrameObject) {
        var a = f.pop();
        f.push(!a);
    }

    // 15: UNARY_INVERT
    unary_invert(f: Py_FrameObject) {
        var a = f.pop();
        f.push(-a-1);
    }

    // 19: BINARY_POWER
    binary_power(f: Py_FrameObject) {
        var a = f.pop();
        var b = f.pop();
        f.push(Math.pow(b, a));
    }

    // 20: BINARY_MULTIPLY
    binary_mult(f: Py_FrameObject) {
        var a = f.pop();
        var b = f.pop();
        f.push(a * b);
    }

    // 21: BINARY_DIVIDE
    //used when from __future__ import division is not in effect
    binary_divide(f: Py_FrameObject) {
        var a = f.pop();
        var b = f.pop();
        f.push(b / a);
    }

    // 22: BINARY_MODULO
    binary_modulo(f: Py_FrameObject) {
        var a = f.pop();
        var b = f.pop();
        f.push(b % a);
    }

    // 23: BINARY_ADD
    binary_add(f: Py_FrameObject) {
        var b = f.pop();
        var a = f.pop();
        if (typeof a == 'string' && typeof b == 'string') {
            f.push(a + b);
        } else if (typeof a == 'number' && typeof b == 'number') {
            f.push(a + b);
        } else if (this.isNumeric(a) && this.isNumeric(b)) {
            if (this.wider(a,b) > 0) {
                var wb = this.widen(a,b);
                if (a.add)
                    f.push(a.add(wb));
                else
                    f.push(a + wb);
            } else if (this.wider(a,b) < 0) {
                var wa = this.widen(b,a);
                if (wa.add)
                    f.push(wa.add(b));
                else
                    f.push(wa + b);
            } else {
                f.push(a.add(b));
            }
        } else { // Let a's add function handle b. It should handle types.
            f.push(a.add(b));
        }
    }

    // 24: BINARY_SUBTRACT
    binary_subtract(f: Py_FrameObject) {
        var a = f.pop();
        var b = f.pop();
        f.push(b - a);
    }

    // 25: BINARY_SUBSCR
    binary_subscr(f: Py_FrameObject) {
        var a = f.pop();
        var b = f.pop();
        f.push(b[a]);
    }

    // 62: BINARY_LSHIFT
    binary_lshift(f: Py_FrameObject) {
        var a = f.pop();
        var b = f.pop();
        f.push(b << a);
    }

    // 63: BINARY_RSHIFT
    binary_rshift(f: Py_FrameObject) {
        var a = f.pop();
        var b = f.pop();
        f.push(b >> a);
    }

    // 64: BINARY_AND
    binary_and(f: Py_FrameObject) {
        var a = f.pop();
        var b = f.pop();
        f.push(a & b);
    }

    // 65: BINARY_XOR
    binary_xor(f: Py_FrameObject) {
        var a = f.pop();
        var b = f.pop();
        f.push(a ^ b);
    }

    // 66: BINARY_OR
    binary_or(f: Py_FrameObject) {
        var a = f.pop();
        var b = f.pop();
        f.push(a | b);
    }

    // 71: PRINT_ITEM
    print_item(f: Py_FrameObject) {
        var a = f.pop();
        process.stdout.write(a.toString());
    }

    // 72: PRINT_NEWLINE
    print_newline(f: Py_FrameObject) {
        process.stdout.write("\n");
    }

    // 83: RETURN_VALUE
    return_value(f: Py_FrameObject) {
        // NOP -- clear stack?
    }

    // 90: STORE_NAME
    store_name(f: Py_FrameObject) {
        var i = f.readArg();
        var val = f.pop();
        var name = f.codeObj.names[i];
        f.locals[name] = val;
    }

    // 100: LOAD_CONST
    load_const(f: Py_FrameObject) {
        var i = f.readArg();
        f.push(f.codeObj.consts[i]);
    }

    // 101: LOAD_NAME
    load_name(f: Py_FrameObject) {
        var i = f.readArg();
        var name = f.codeObj.names[i];
        f.push(f.locals[name]);
    }

    // 107: COMPARE_OP
    compare_op(f: Py_FrameObject) {
        var comp_ops = ['<', '<=', '==', '>', '>=', 'in', 'not in',
                        'is', 'is not', 'exception match'];
        var opidx = f.readArg();
        var op = comp_ops[opidx];
        var b = f.pop();
        var a = f.pop();

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
    jump_forward(f: Py_FrameObject) {
        var delta = f.readArg();
        f.lastInst += delta
    }

    // 111: JUMP_IF_FALSE_OR_POP
    jump_if_false_or_pop(f: Py_FrameObject) {
        var target = f.readArg();
        if (this.toBool(f.peek())) {
            f.pop();
        } else {
            f.lastInst = target;
        }
    }

    // 112: JUMP_IF_TRUE_OR_POP
    jump_if_true_or_pop(f: Py_FrameObject) {
        var target = f.readArg();
        if (this.toBool(f.peek())) {
            f.lastInst = target;
        } else {
            f.pop();
        }
    }

    // 113: JUMP_ABSOLUTE
    jump_absolute(f: Py_FrameObject) {
        var target = f.readArg();
        f.lastInst = target;
    }

    // 114: POP_JUMP_IF_FALSE
    pop_jump_if_false(f: Py_FrameObject) {
        var target = f.readArg();
        if (this.toBool(f.pop()))
            f.lastInst = target;
    }

    // 115: POP_JUMP_IF_TRUE
    pop_jump_if_true(f: Py_FrameObject) {
        var target = f.readArg();
        if (!this.toBool(f.pop()))
            f.lastInst = target;
    }

    // 124: LOAD_FAST
    load_fast(f: Py_FrameObject) {
        var i = f.readArg();
        var name = f.codeObj.varnames[i];
        f.push(f.locals[name]);
    }

    // 125: STORE_FAST
    store_fast(f: Py_FrameObject) {
        var i = f.readArg();
        var val = f.pop();
        f.locals[f.codeObj.varnames[i]] = val;
    }

    // 131: CALL_FUNCTION
    call_function(f: Py_FrameObject) {
        var i = f.readArg();
        // number of positional parameters
        var posNum = i & 0xff;
        // number of keyword arguments
        var keyNum = (i >> 8) & 0xff;
        var keyNames: string[] = [];
        var keyVals: any[] = [];
        var posVals = [];
        var locals: { [name: string]: any } = {};

        for (var x = 0; x < keyNum; x++) {
            keyVals.push(f.pop());
            keyNames.push(f.pop());
        }

        for (var x = 0; x < posNum; x++) {
            posVals.push(f.pop());
        }

        var func: Py_FuncObject = f.pop();

        for (var x = 0; x < keyNames.length; x++) {
            locals[keyNames[x]] = keyVals[x];
        }

        func.code.varnames.reverse().forEach( function(name, idx, array) {
            if (locals[name] == undefined)
                locals[name] = posVals.pop() || func.defaults[name];
        });

        var newf = new Py_FrameObject(f, f.builtins, func.code,
                func.globals, -1, func.code.firstlineno, locals, false);
        this.exec(newf)
    }

    // 132: MAKE_FUNCTION
    make_function(f: Py_FrameObject) {
        var numDefault = f.readArg();
        var defaults: { [name: string]: any } = {};

        var code = f.pop();

        for (var i = code.varnames.length-1; i >= 0; i--) {
            defaults[code.varnames[i]] = f.pop();
        }

        var func = new Py_FuncObject(code, f.globals, defaults, code.name);
        f.push(func);
    }
}
export = Interpreter;
