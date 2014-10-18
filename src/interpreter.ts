// <reference path="unmarshal.ts" />
// <reference path="frameobject.ts" />
// <reference path="codeobject.ts" />
// <reference path="supportobjects.ts" />

import frameObj = require('./frameobject');
import codeObj = require('./codeobject');
import support = require('./supportobjects');
import unmarshal = require('./unmarshal');

export class Interpreter {
    // The interpreter stack
    stack: any[]

    constructor() {
        this.stack = [];
    }

    interpret(code: codeObj.Py_CodeObject) {
        return this.exec(
            new frameObj.Py_FrameObject(null, {}, code, {}, -1, 0, {}, false));
    }

    exec(frame: frameObj.Py_FrameObject) {
        var code: codeObj.Py_CodeObject = frame.codeObj;

        for (var op = this.readOp(frame); op != undefined;
                op = this.readOp(frame)) {
            switch(op) {
                case '\x17':
                    this.binary_add(frame);
                    break;
                case '\x47':
                    this.print_item(frame);
                    break;
                case '\x48':
                    this.print_newline(frame);
                    break;
                case '\x53':
                    this.return_value(frame);
                    break;
                case '\x5a':
                    this.store_name(frame);
                    break;
                case '\x64':
                    this.load_const(frame);
                    break;
                case '\x65':
                    this.load_name(frame);
                    break;
                case '\x7c':
                    this.load_fast(frame);
                    break;
                case '\x83':
                    this.call_function(frame);
                    break;
                case '\x84':
                    this.make_function(frame);
                    break;
                default:
                    console.log("Unknown: " + op);
                    throw new Error("Unknown op code: " + op);
                    break;
            }
        }
    }

    readOp(f: frameObj.Py_FrameObject): string {
        f.lastInst += 1;
        return f.codeObj.code[f.lastInst];
    }

    readArg(f: frameObj.Py_FrameObject): number {
        f.lastInst += 1;
        var low = f.codeObj.code.charCodeAt(f.lastInst);
        f.lastInst += 1;
        var high = f.codeObj.code.charCodeAt(f.lastInst);
        return (high << 8) + low;
    }

    push(v) {
        console.log("Pushing " + v + " to the stack");
        return this.stack.push(v);
    }

    pop() {
        console.log("Popping stack...");
        return this.stack.pop();
    }

    // Opcodes
    // 23: BINARY_ADD
    binary_add(f: frameObj.Py_FrameObject) {
        var a = this.pop();
        var b = this.pop();
        this.push(a + b);
    }
    // 71: PRINT_ITEM
    print_item(f: frameObj.Py_FrameObject) {
        var a = this.pop();
        console.log(a);
    }
    // 72: PRINT_NEWLINE
    print_newline(f: frameObj.Py_FrameObject) {
        console.log("\n");
    }
    // 83: RETURN_VALUE
    return_value(f: frameObj.Py_FrameObject) {
        var top = this.pop();
        console.log("Ret val: " + top);
        return top;
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
        this.push(f.codeObj.varnames[i]);
    }
    // 131: CALL_FUNCTION
    call_function(f: frameObj.Py_FrameObject) {
        var i = this.readArg(f);
        // number of positional parameters
        var posNum = i & 0xff;
        // number of keyword arguments
        var keyNum = (i >> 8) & 0xff;
        console.log(this.stack);
        throw new Error("Function calls are weird.");
    }
    // 132: MAKE_FUNCTION
    make_function(f: frameObj.Py_FrameObject) {
       throw new Error("The documentation kind of sucks here");
    }

}
