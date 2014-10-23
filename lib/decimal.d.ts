
interface Decimal {
    absoluteValue(): Decimal;
    abs(): Decimal;

    ceil(): Decimal;

    comparedTo(n: number, base?: number): Decimal;
    comparedTo(n: string, base?: number): Decimal;
    comparedTo(n: Decimal, base?: number): Decimal;
    cmp(n: number, base?: number): Decimal;
    cmp(n: string, base?: number): Decimal;
    cmp(n: Decimal, base?: number): Decimal;

    decimalPlaces(): number;
    dp(): number;

    dividedBy(n: number, base?: number): Decimal;
    dividedBy(n: string, base?: number): Decimal;
    dividedBy(n: Decimal, base?: number): Decimal;
    div(n: number, base?: number): Decimal;
    div(n: string, base?: number): Decimal;
    div(n: Decimal, base?: number): Decimal;

    dividedToIntegerBy(n: number, base?: number): Decimal;
    dividedToIntegerBy(n: string, base?: number): Decimal;
    dividedToIntegerBy(n: Decimal, base?: number): Decimal;
    divToInt(n: number, base?: number): Decimal;
    divToInt(n: string, base?: number): Decimal;
    divToInt(n: Decimal, base?: number): Decimal;

    equals(n: number, base?: number): Decimal;
    equals(n: string, base?: number): Decimal;
    equals(n: Decimal, base?: number): Decimal;

    exponential(): Decimal;
    exp(): Decimal;

    floor(): Decimal;

    greaterThan(n: number, base?: number): Decimal;
    greaterThan(n: string, base?: number): Decimal;
    greaterThan(n: Decimal, base?: number): Decimal;

    greaterThanOrEqualTo(n: number, base?: number): Decimal;
    greaterThanOrEqualTo(n: string, base?: number): Decimal;
    greaterThanOrEqualTo(n: Decimal, base?: number): Decimal;

    isFinite(): boolean;

    isInteger(): boolean;

    isNaN(): boolean;

    isNegative(): boolean;

    isZero(): boolean;

    lessThan(n: number, base?: number): Decimal;
    lessThan(n: string, base?: number): Decimal;
    lessThan(n: Decimal, base?: number): Decimal;

    lessThanOrEqualTo(n: number, base?: number): Decimal;
    lessThanOrEqualTo(n: string, base?: number): Decimal;
    lessThanOrEqualTo(n: Decimal, base?: number): Decimal;

    logarithm(n: number, base?: number): Decimal;
    logarithm(n: string, base?: number): Decimal;
    logarithm(n: Decimal, base?: number): Decimal;
    log(n: number, base?: number): Decimal;
    log(n: string, base?: number): Decimal;
    log(n: Decimal, base?: number): Decimal;

    minus(n: number, base?: number): Decimal;
    minus(n: string, base?: number): Decimal;
    minus(n: Decimal, base?: number): Decimal;

    modulo(n: number, base?: number): Decimal;
    modulo(n: string, base?: number): Decimal;
    modulo(n: Decimal, base?: number): Decimal;

    naturalLogarithm(): Decimal;
    ln(): Decimal;

    negated(): Decimal;
    neg(): Decimal;

    plus(n: number, base?: number): Decimal;
    plus(n: string, base?: number): Decimal;
    plus(n: Decimal, base?: number): Decimal;

    precision(include_zeros: boolean): number;
    sd(include_zeros: boolean): number;

    round(): Decimal;

    squareRoot(): Decimal;
    sqrt(): Decimal;

    times(n: number, base?: number): Decimal;
    times(n: string, base?: number): Decimal;
    times(n: Decimal, base?: number): Decimal;

    toDecimalPlaces(dp?: number, rm?: number): Decimal;
    toDP(dp?: number, rm?: number): Decimal;

    toExponential(dp?: number, rm?: number): string;

    toFixed(dp?: number, rm?: number): string;

    toFormat(sep1?: string, sep2?: string, dp?: number): string;

    toFraction(max_denom: number): string[];
    toFraction(max_denom: string): string[];
    toFraction(max_denom: Decimal): string[];

    toJSON(): string;

    toNearest(n: number, rm?: number): Decimal;
    toNearest(n: string, rm?: number): Decimal;
    toNearest(n: Decimal, rm?: number): Decimal;

    toNumber(): number;

    toPower(n: number, base?: number): Decimal;
    toPower(n: string, base?: number): Decimal;
    toPower(n: Decimal, base?: number): Decimal;

    toPrecision(sd?: number, rm?: number): string;

    toSignificantDigits(sd?: number, rm?: number): Decimal;
    toSD(sd?: number, rm?: number): Decimal;

    toString(base?: number): string;

    truncated(): Decimal;
    trunc(): Decimal;

    valueOf(): string;

    //coefficient or significand
    c: number[];
    // exponent
    e: number;
    // sign
    s: number;
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
