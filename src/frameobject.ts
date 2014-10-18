/// <reference path="unmarshal.ts" />
/// <reference path="codeobject.ts" />

module PyInterpreter {

    export class Py_FrameObject {
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
        }
    }

}
