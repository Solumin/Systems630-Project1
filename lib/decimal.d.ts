
interface Decimal {
    plus(n: number, base?: number): Decimal;
    plus(n: string, base?: number): Decimal;
    plus(n: Decimal, base?: number): Decimal;

    times(n: number, base?: number): Decimal;
    times(n: string, base?: number): Decimal;
    times(n: Decimal, base?: number): Decimal;

    toNumber(): number;
    toString(): string;
}

interface DecimalStatic {

    new (value: number, base?: number): Decimal;
    new (value: string, base?: number): Decimal;
    new (value: Decimal, base?: number): Decimal;

    (value: number, base?: number): Decimal;
    (value: string, base?: number): Decimal;
    (value: Decimal, base?: number): Decimal;

    config(object: { [name: string]: any }): DecimalStatic;
    constructor(object: { [name: string]: any }): DecimalStatic;

    exp(n: number): Decimal;

    ln(n: number, base?: number): Decimal;
    ln(n: string, base?: number): Decimal;
    ln(n: Decimal, base?: number): Decimal;

    log(n: number base?: any): Decimal;
    log(n: string base?: any): Decimal;
    log(n: Decimal base?: any): Decimal;

    max(n: ...number[]): Decimal;
    max(n: ...string[]): Decimal;
    max(n: ...Decimal[]): Decimal;

    min(n: ...number[]): Decimal;
    min(n: ...string[]): Decimal;
    min(n: ...Decimal[]): Decimal;

    noConflict(): DecimalStatic;

    pow(base: number, exponent: any): Decimal;
    pow(base: string, exponent: any): Decimal;
    pow(base: Decimal, exponent: any): Decimal;

    random(n: number): Decimal;

    sqrt(n: number): Decimal;
    sqrt(n: string): Decimal;
    sqrt(n: Decimal): Decimal;
}

declare var Decimal: DecimalStatic;
declare module "Decimal" {
    export = Decimal;
}
