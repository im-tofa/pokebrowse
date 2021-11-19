/**
 * setbrowser
 *     search component
 *         filter component
 *     results component (structured by columns for each attribute e.g evs ivs base stats name author etc)
 *         description bar (fixed at the top)
 *         results list
 *             result of each set that was matched
 *                 
 *         
 */

import style from './style.css';

import { ApolloProvider, ApolloClient, useQuery, gql, useLazyQuery } from '@apollo/client';
import { Component, FunctionalComponent, h, Fragment } from 'preact';
import { useState, useCallback, useReducer, useEffect } from 'preact/hooks';

import Filter from './../../components/filter';
import parseInput from '../../routes/setbrowser/tokenizer';

const dummy_filters = {
    species: {
        value: "Excadrill",
        inputType: 'input',
    },
    speed: {
        value: 290,
        inputType: 'number',
    },
    author: {
        value: "Storm Zone",
        inputType: 'input',
    }
};

const GET_GREETING = gql`
    query get_sets($species: [String]!) {
        sets(species: $species) {
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

interface SearchProps {
    setResults(pokemon): void; 
};

const SearchComponent: FunctionalComponent<SearchProps> = (props: SearchProps) => {
    const [currentInput, setCurrentInput] = useState('');
    const [species, setSpecies] = useState([]);
    const [speed, setSpeed] = useState(0);
    const [filters, setFilters] = useState(dummy_filters);

    function handleUserInput(event: KeyboardEvent) {
        event.preventDefault();
        if(event.code === "Enter"){
            setCurrentInput('');
            const res = parseInput(event.target.value);
            if(res){
                switch(res.key) {
                    case "species":
                        if(res.val in species) break;
                        setSpecies([...species, res.val]);
                        break;
                    case "speed":
                        setSpeed(res.val);
                        break;
                    default:
                        break;
                }
            }
        }
    };

    const [fetchResults, {loading, error, data}] = useLazyQuery(GET_GREETING);

    if(loading) {}
    else {
        if(error) {
            console.error(error);
            console.error(data);
        } else {
            if(data !== undefined) {
                console.log(data.sets);
                props.setResults(data.sets);
            }
        }
    }

    return (
        <form class={style.filters}>
          <div class={style.cli}>
            <h3>Browse: </h3>
            <input type="text" class={style.cmd} value={currentInput} onChange={(event) => setCurrentInput(event.target.value)} onKeyUp={(event) => handleUserInput(event)} onKeyDown={(event) => {if(event.code === 'Enter') event.preventDefault();}}></input>
          </div>
          {Object.keys(filters).length > 0 && <div class={style.chosen}>
            <h5>Filters: </h5>
            {species.map((val) => <Filter filterType={'species'} filterValue={val} inputType={'input'} remove={(event) => {event.preventDefault(); setSpecies([...species].filter(el => el !== val))}}></Filter>)}
            </div>}
            <button onClick={(e) => {
                e.preventDefault(); 
                console.log(species);
                fetchResults({
                    variables: { species: species }
                });
            }}>
                Search!
            </button>
        </form>
    );
};

export default SearchComponent;