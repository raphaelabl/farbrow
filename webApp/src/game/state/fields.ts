export interface fieldStatus {
    name: string,
    firstColor: number,
    secondColor: number
}

export const FieldState ={
    PLOWED: {
        name: 'plowed',
        firstColor: 0x85603c,
        secondColor: 0x573d24
    },
    SEEDED: {
        name: 'seeded',
        firstColor: 0xe1f5ce,
        secondColor: 0x85603c
    },
    GROWING: {
        name: 'growing',
        firstColor: 0xf7e51e,
        secondColor: 0xeefab1
    },
    READY: {
        name: 'ready',
        firstColor: 0xdb8400,
        secondColor: 0xffb23d
    },
    HARVESTED: {
        name: 'harvested',
        firstColor: 0x8a7560,
        secondColor: 0xbda893
    }
}



export type SeedType = 'wheat'; // | 'corn' | 'potatoes';

export interface Field{
    id: number;
    x: number;
    y: number;
    name: string;
    width: number;
    height: number;
    seedType?: SeedType;
    state: fieldStatus;
    price?: number;
}

export const startingFields: Field[] = [
    {id: 1, name: 'Field 1', x: 2, y: 1, width: 5, height: 7, state: FieldState.PLOWED, price: 10000},
    {id: 2, name: 'Field 2', x: 19, y: 5, width: 11, height: 7, state: FieldState.READY, price: 20000},
    {id: 3, name: 'Field 3', x: 8, y: 11, width: 6, height: 4, state: FieldState.HARVESTED, price: 5000},
];