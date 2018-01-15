import * as ti from 'technicalindicators';

export interface CCIInput {
    high: number[];
    low: number[];
    close: number[];
    period: number;
}

// TODO: implement technical indicators calculation methods. npm libs technicalindicators, trendyways, ...
export namespace Indicators {
    export function cci(input: CCIInput): number[] {
        return ti.cci(input);
    }

    export function mfi(input: any): any {
        //TODO: implement mfi
    }

    export function cmo(input: any): any {

    }
}