
interface Decimal {
    plus(n: number, base?: number): Decimal;
    plus(n: string, base?: number): Decimal;
    plus(n: Decimal, base?: number): Decimal;

    times(n: number, base?: number): Decimal;
    times(n: string, base?: number): Decimal;
    times(n: Decimal, base?: number): Decimal;

    toNumber(): number;
}

interface DecimalStatic {

    // new (value: number, base?: number): Decimal_Constructor;
    // new (value: string, base?: number): Decimal_Constructor;
    // new (value: Decimal, base?: number): Decimal_Constructor;

    (value: number, base?: number): Decimal;
    (value: string, base?: number): Decimal;
    (value: Decimal, base?: number): Decimal;

    // function config(object: { [name: string]: any }): 
    // function constructor(object: { [name: string]: any }):
     exp(n: number): Decimal;
     ln(n: number, base?: number): Decimal;
     ln(n: string, base?: number): Decimal;
     ln(n: Decimal, base?: number): Decimal;
     log(n: number): Decimal;
    // this should be continued later
     pow(base: number, exponent: any): Decimal;
     pow(base: string, exponent: string): Decimal;
     pow(base: Decimal, exponent: string): Decimal;
}

declare var Decimal: DecimalStatic;
declare module "Decimal" {
    export = Decimal;
}
