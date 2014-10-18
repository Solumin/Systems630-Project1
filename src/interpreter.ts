// <reference path="unmarshal.ts" />
// <reference path="frameobject.ts" />
// <reference path="codeobject.ts" />
// <reference path="supportobjects.ts" />

import frameObj = require('./frameobject');
import codeObj = require('./codeobject');
import support = require('./supportobjects');
import unmarshal = require('./unmarshal');
import funcObj = require('./funcobject');

export class Interpreter {
    // The interpreter stack
    stack: any[]

    constructor() {
        this.stack = [];
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

    // Opcodes
    // 20: BINARY_MULTIPLY
    binary_mult(f: frameObj.Py_FrameObject) {
        var a = this.pop();
        var b = this.pop();
        this.push(a * b);
    }

    // 23: BINARY_ADD
    binary_add(f: frameObj.Py_FrameObject) {
        var a = this.pop();
        var b = this.pop();
        this.push(a + b);
    }

    // 71: PRINT_ITEM
    print_item(f: frameObj.Py_FrameObject) {
        var a = this.pop();
        if (a == undefined) {
            throw new Error("Attempted to write undefined data\n" + this.stack);
        }
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
