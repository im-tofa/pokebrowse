export type Set = {
    species: string,
    author: string,
    name: string,
    level: number,
    ability: string,
    item: string,
    evs: {
        hp: number | null,
        atk: number | null,
        def: number | null,
        spa: number | null,
        spd: number | null,
        spe: number | null,
    },
    ivs: null | {
        hp: number | null,
        atk: number | null,
        def: number | null,
        spa: number | null,
        spd: number | null,
        spe: number | null,
    },
    nature: string,
    moves: string[],
};

export type Pokemon = {
    species: string,
    sets: Set[],
};