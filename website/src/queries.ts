import gql from "graphql-tag";

export const SETS = gql`
    query get_sets($species: [String], $author: String = "", $speed: Int = 0) {
        sets(species: $species, author: $author, speed: $speed) {
            species
            name
            author
            ability
            item
            evs {
                hp
                atk
                def
                spa
                spd
                spe
            }
            ivs {
                hp
                atk
                def
                spa
                spd
                spe
            }
            nature
            moves
        }
    }
`;