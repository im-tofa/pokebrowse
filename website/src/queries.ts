import gql from "graphql-tag";

export const SETS = gql`
    query get_sets($species: [String], $author: String = "", $speed: Int = 0) {
        sets(species: $species, author: $author, speed: $speed) {
            species
            name
            ability
            item
            evs {
                hp
                at
                df
                sa
                sd
                sp
            }
            ivs {
                hp
                at
                df
                sa
                sd
                sp
            }
            nature
            moves
        }
    }
`;