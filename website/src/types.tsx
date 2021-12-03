export type Set = {
    species: string,
    name: string,
    level: number,
    ability: string,
    item: string,
    evs: {
        hp: number | null,
        at: number | null,
        df: number | null,
        sa: number | null,
        sd: number | null,
        sp: number | null,
    },
    ivs: null | {
        hp: number | null,
        at: number | null,
        df: number | null,
        sa: number | null,
        sd: number | null,
        sp: number | null,
    },
    nature: string,
    moves: string[],
};

export type Pokemon = {
    species: string,
    sets: Set[],
};