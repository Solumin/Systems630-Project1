
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

    log(n: number, base?: any): Decimal;
    log(n: string, base?: any): Decimal;
    log(n: Decimal, base?: any): Decimal;

    max(...n: number[]): Decimal;
    max(...n: string[]): Decimal;
    max(...n: Decimal[]): Decimal;

    min(...n: number[]): Decimal;
    min(...n: string[]): Decimal;
    min(...n: Decimal[]): Decimal;

    noConflict(): DecimalStatic;

    pow(base: number, exponent: any): Decimal;
    pow(base: string, exponent: any): Decimal;
    pow(base: Decimal, exponent: any): Decimal;

    random(n: number): Decimal;

    sqrt(n: number): Decimal;
    sqrt(n: string): Decimal;
    sqrt(n: Decimal): Decimal;

    ONE: Decimal;
    precision: number;
    rounding: number;
    minE: number;
    maxE: number;
    toExpNeg: number;
    toExpPos: number;
    errors: boolean;
    modulo: number;
    crypto: boolean;

    ROUND_UP: number;
    ROUND_DOWN: number;
    ROUND_CEIL: number;
    ROUND_FLOOR: number;
    ROUND_HALF_UP: number;
    ROUND_HALF_DOWN: number;
    ROUND_HALF_EVEN: number;
    ROUND_HALF_CEIL: number;
    ROUND_HALF_FLOOR: number;
    EUCLID: number;
}

declare module DecimalRound {
    export enum Modes {
        ROUND_UP,
        ROUND_DOWN,
        ROUND_CEIL,
        ROUND_FLOOR,
        ROUND_HALF_UP,
        ROUND_HALF_DOWN,
        ROUND_HALF_EVEN,
        ROUND_HALF_CEIL,
        ROUND_HALF_FLOOR,
        EUCLID,
    }
}

declare var Decimal: DecimalStatic;
declare module "Decimal" {
    export = Decimal;
}
