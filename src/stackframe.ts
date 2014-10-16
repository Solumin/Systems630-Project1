class Py_FrameObject {
    // Previous stack frame (this frame's caller, may be None)
    back: Py_FrameObject;
    // Built-in namespace -- TODO: Evaluate for this project?
    builtins: { [name: string]: Any; };
    // Code object executed in this frame
    code: Py_CodeObject;
    // traceback for debugging -- TODO: Implement
    // traceback: Any;
    // Exception type, if raised in this frame
    // exc_type: Any;
    // Exception value, if raised in this frame
    // exc_value
    // List of global values (global namespace!)
    globals: { [name: string]: Any };
    // Last attempted instruction
    lastInst: number;
    // Current line number
    lineNum: number;
    // Local namespace
    locals: { [name: string]: Any };
    // Flag: 1 if running in restricted mode (TODO: What?)
    restricted: boolean;
    // Tracing function for this frame
    // trace:

    constructor(back: Py_FrameObject,
                builtins: { [name: string]: Any; },
                code: Py_CodeObject;
                globals: { [name: string]: Any },
                lastInst: number,
                lineNum: number,
                locals: { [name: string]: Any },
                restricted: boolean) {
        this.back = back;
        this.builtins = builtins;
        this.code = code;
        this.globals = globals;
        this.lastInst = lastInst;
        this.lineNum = lineNum;
        this.locals = locals;
        this.restricted = restricted;
    }
}
