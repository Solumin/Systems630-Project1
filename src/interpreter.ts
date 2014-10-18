/// <reference path="unmarshal.ts" />
/// <reference path="frameobject.ts" />
/// <reference path="codeobject.ts" />

module PyInterpreter {

    export class Interpreter {
        // The interpreter stack
        stack: any[]

        constructor() {
            this.stack = [];
        }

        interpret(code: Py_CodeObject) {
            return this.exec(
                    new Py_FrameObject(null, {}, code, {}, -1, 0, {}, false));
        }

        exec(frame: Py_FrameObject) {
            var code: Py_CodeObject = frame.codeObj;
        }

        readOp(f: Py_FrameObject): string {
            f.lastInst += 1;
            return f.codeObj.code[f.lastInst];
        }

        readArg(f: Py_FrameObject): number {
            f.lastInst += 1;
            var low = f.codeObj.code.charCodeAt(f.lastInst);
            f.lastInst += 1;
            var high = f.codeObj.code.charCodeAt(f.lastInst);
            return (high << 8) + low;
        }

        push(v) {
            return this.stack.push(v);
        }

        pop() {
            return this.stack.pop();
        }

        // Opcodes
        // 23: BINARY_ADD
        binary_add(f: Py_FrameObject) {
            var a = this.pop();
            var b = this.pop();
            return a + b;
        }
        // 71: PRINT_ITEM
        print_item(f: Py_FrameObject) {
            var a = this.pop();
            console.log(a);
        }
        // 72: PRINT_NEWLINE
        print_newline(f: Py_FrameObject) {
            console.log("\n");
        }
        // 83: RETURN_VALUE
        return_value(f: Py_FrameObject) {
            return this.pop();
        }
        // 90: STORE_NAME
        store_name(f: Py_FrameObject) {
            var i = this.readArg(f);
            var val = this.pop();
            var name = f.codeObj.names[i];
            f.locals[name] = val;
        }
        // 100: LOAD_CONST
        load_const(f: Py_FrameObject) {
            var i = this.readArg(f);
            this.push(f.codeObj.consts[i]);
        }
        // 101: LOAD_NAME
        load_name(f: Py_FrameObject) {
            var i = this.readArg(f);
            var name = f.codeObj.names[i];
            this.push(f.locals[name]);
        }
        // 124: LOAD_FAST
        load_fast(f: Py_FrameObject) {
            var i = this.readArg(f);
            this.push(f.codeObj.varnames[i]);
        }
        // 131: CALL_FUNCTION
        call_function(f: Py_FrameObject) {
            var i = this.readArg(f);
            // number of positional parameters
            var posNum = i & 0xff;
            // number of keyword arguments
            var keyNum = (i >> 8) & 0xff;
            console.log(this.stack);
            throw new Error("Function calls are weird.");
        }
        // 132: MAKE_FUNCTION
        make_function(f: Py_FrameObject) {
           throw new Error("The documentation kind of sucks here");
        }

    }
}
