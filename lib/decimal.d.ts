declare module DecimalJSLibrary {

    interface DecimalJS_Constructor {
        new (value: number, base?: number): DecimalJS_Constructor;
        new (value: string, base?: number): DecimalJS_Constructor;
        new (value: DecimalJS, base?: number): DecimalJS_Constructor;

        // (value: number, base?: number): DecimalJS;
        // (value: string, base?: number): DecimalJS;
        // (value: DecimalJS, base?: number): DecimalJS;
    }

    // Decimal class (static) methods
    function config(object: { [name: string]: any }): DecimalJS_Constructor;
    function constructor(object: { [name: string]: any }):
        DecimalJS_Constructor;
    function exp(n: number): DecimalJS;
    function ln(n: number, base?: number): DecimalJS;
    function ln(n: string, base?: number): DecimalJS;
    function ln(n: DecimalJS, base?: number): DecimalJS;
    function log(n: number): DecimalJS;
    // this should be continued later
    function pow(base: number, exponent: any): DecimalJS;
    function pow(base: string, exponent: string): DecimalJS;
    function pow(base: DecimalJS, exponent: string): DecimalJS;

    interface DecimalJS extends DecimalJS_Constructor {
        plus(n: number, base?: number): DecimalJS;
        plus(n: string, base?: number): DecimalJS;
        plus(n: DecimalJS, base?: number): DecimalJS;

        times(n: number, base?: number): DecimalJS;
        times(n: string, base?: number): DecimalJS;
        times(n: DecimalJS, base?: number): DecimalJS;

        toNumber(): number;
    }
}

declare var Decimal: DecimalJSLibrary.DecimalJS;
