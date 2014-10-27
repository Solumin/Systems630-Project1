import Py_CodeObject = require('./codeobject');

// Frame Objects are basically stack frames for functions, except they carry
// extra context (e.g. globals, local scope, etc.). This class is not simplified
// in order to keep the fairly neat documentation.
// Frame objects maintain their own stack and scope. This allows for easier
// handling of function calls and other scoping actions.
class Py_FrameObject {
    // Previous stack frame (this frame's caller, may be None)
    back: Py_FrameObject;
    // Built-in namespace -- TODO: Evaluate for this project?
    builtins: { [name: string]: any; };
    // Code object executed in this frame
    codeObj: Py_CodeObject;
    // traceback for debugging -- TODO: Implement
    // traceback: any;
    // Exception type, if raised in this frame
    // exc_type: any;
    // Exception value, if raised in this frame
    // exc_value
    // List of global values (global namespace!)
    globals: { [name: string]: any };
    // Last attempted instruction
    lastInst: number;
    // Current line number
    lineNum: number;
    // Local namespace
    locals: { [name: string]: any };
    // Flag: 1 if running in restricted mode (TODO: What?)
    restricted: boolean;
    // This frame's stack
    stack: any[];
    // Tracing function for this frame
    // trace:

    constructor(back: Py_FrameObject,
                builtins: { [name: string]: any; },
                code: Py_CodeObject,
                globals: { [name: string]: any },
                lastInst: number,
                lineNum: number,
                locals: { [name: string]: any },
                restricted: boolean) {
        this.back = back;
        this.builtins = builtins;
        this.codeObj = code;
        this.globals = globals;
        this.lastInst = lastInst;
        this.lineNum = lineNum;
        this.locals = locals;
        this.restricted = restricted;
        this.stack = [];
    }

    // Stack handling operations.
    push(v) {
        return this.stack.push(v);
    }

    pop() {
        return this.stack.pop();
    }

    peek() {
        return this.stack[this.stack.length-1];
    }

    // The frame's lastInst field keeps track of the last executed instruction.
    readOp(): number {
        this.lastInst += 1;
        return this.codeObj.code[this.lastInst];
    }

    // Arguments are stored as 2 bytes, little-endian.
    readArg(): number {
        this.lastInst += 1;
        var low = this.codeObj.code[this.lastInst];
        this.lastInst += 1;
        var high = this.codeObj.code[this.lastInst];
        return (high << 8) + low;
    }


}
export = Py_FrameObject;
