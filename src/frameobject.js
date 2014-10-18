var Py_FrameObject = (function () {
    // Tracing function for this frame
    // trace:
    function Py_FrameObject(back, builtins, code, globals, lastInst, lineNum, locals, restricted) {
        this.back = back;
        this.builtins = builtins;
        this.codeObj = code;
        this.globals = globals;
        this.lastInst = lastInst;
        this.lineNum = lineNum;
        this.locals = locals;
        this.restricted = restricted;
    }
    return Py_FrameObject;
})();
exports.Py_FrameObject = Py_FrameObject;
