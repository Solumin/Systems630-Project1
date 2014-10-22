class NotImplementedError implements Error {
    constructor(public name: string, public message?: string) {}
}
export = NotImplementedError;
