// Python uses "NotImplemented" to signal that some operation (e.g. addition,
// less-than) is not supported for a particular set of arguments. Typically the
// reverse operation is tried (e.g. add => radd). If that also returns
// NotImplemented, the interpreter throws an error.
class NotImplementedError implements Error {
    constructor(public name: string, public message?: string) {}
}
export = NotImplementedError;
