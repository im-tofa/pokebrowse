export type Set = {
    set_id: number,
    species: string,
    author: string,
    description: string,
    set_uploaded_on: string,
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