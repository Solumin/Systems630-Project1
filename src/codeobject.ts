class Py_CodeObject {
    argcount: number;
    cellvars: string[];
    code: Buffer;
    consts: any[];
    filename: string;
    firstlineno: number;
    flags: number;
    freevars: string[];
    lnotab: string;
    name: string;
    names: string[];
    nlocals: number;
    stacksize: number;
    varnames: string[];

    // Args are in marshal order
    constructor(argcount: number,
                nlocals: number,
                stacksize: number,
                flags: number,
                code: Buffer,
                consts: any[],
                names: string[],
                varnames: string[],
                freevars: string[],
                cellvars: string[],
                filename: string,
                name: string,
                firstlineno: number,
                lnotab: string) {
        this.argcount = argcount;
        this.cellvars = cellvars;
        this.code = code;
        this.consts = consts;
        this.filename = filename;
        this.firstlineno = firstlineno;
        this.flags = flags;
        this.freevars = freevars;
        this.lnotab = lnotab;
        this.name = name;
        this.names = names;
        this.nlocals = nlocals;
        this.stacksize = stacksize;
        this.varnames = varnames;
    }
}
export = Py_CodeObject;
