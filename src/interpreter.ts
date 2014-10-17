class Interpreter {
    // The interpreter stack
    stack: Any[]

    constructor() {
        this.stack = [];
    }

    interpret(code: Py_CodeObject) {
        return exec(new Py_FrameObject(null, {}, code, {}, 0, 0, {}, false));
    }

    exec(frame: Py_FrameObject) {
        var code: Py_CodeObject = frame.code;
    }

    // Opcodes
    // 100: LOAD_CONST
    load_const {}
    // 132: MAKE_FUNCTION
    make_function {}
    // 90: STORE_NAME
    store_name {}
    // 101: LOAD_NAME
    load_name {}
    // 131: CALL_FUNCTION
    call_function {}
    // 71: PRINT_ITEM
    print_item {}
    // 72: PRINT_NEWLINE
    print_newline {}
    // 83: RETURN_VALUE
    return_value {}
    // 124: LOAD_FAST
    load_fast {}
    // 23: BINARY_ADD
    binary_add {}

}
