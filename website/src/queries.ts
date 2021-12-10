import gql from "graphql-tag";

export const SETS = gql`
    query get_sets($species: [String], $author: String = "", $speed: Int = 0) {
        sets(species: $species, author: $author, speed: $speed) {
            set_id
            species
            name
            author
            set_uploaded_on
            description
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