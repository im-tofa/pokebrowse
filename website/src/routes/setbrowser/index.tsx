/**
 * Pokémon Showdown uses a global dex for the teambuilder,
 * that is essentially a js/ts file with all content in it 
 * as a js object, since the teambuilder rarely changes & 
 * is limited. My application intends to share sets between
 * users, and the sets can be arbitrary, so a database is 
 * needed to store this. Communication with a database thus 
 * needs to occur through a server, to validate any searches
 * before requesting from the database.
 * 
 */


import { Component, FunctionalComponent, h, Fragment } from 'preact';
import style from './style.css';
import { useState, useCallback, useReducer, useEffect } from 'preact/hooks';
import Filter from './../../components/filter';
import parseInput from './tokenizer';
import dummy_response from './dummy_response';
import pokedex from './pkmnstats';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons'
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons'

import { ApolloProvider, ApolloClient, useQuery, gql, useLazyQuery } from '@apollo/client';
 
interface Props {
}

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
    query get_pokemon($species: String!) {
        pokemon(species: $species) {
            species
            sets {
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
    }
`;

interface SearchProps {
    setResults(pokemon: Pokemon): void; 
};

const SearchComponent: FunctionalComponent<SearchProps> = (props: SearchProps) => {
    const [currentInput, setCurrentInput] = useState('');
    const [filters, setFilters] = useState(dummy_filters);

    const [fetchResults, {loading, error, data}] = useLazyQuery(GET_GREETING);

    if(loading) {}
    else {
        if(error) {
            console.error(error);
            console.error(data);
        } else {
            if(data !== undefined) {
                console.log(data);
                props.setResults(data);
            }
        }
    }

    return (
        <form class={style.filters}>
          <div class={style.cli}>
            <h3>Browse: </h3>
            <input type="text" class={style.cmd} value={currentInput} onChange={(event) => setCurrentInput('')}/*onKeyUp={this.changeQuery} onKeyDown={this.supress}*/></input>
          </div>
          {Object.keys(filters).length > 0 && <div class={style.chosen}>
            <h5>Filters: </h5>
            {Object.entries(filters).map(([key, val]) => <Filter filterType={key} filterValue={val.value} inputType={val.inputType} remove={(event) => {event.preventDefault();}}></Filter>)}
            </div>}
            <button onClick={(e) => {
                e.preventDefault(); 
                fetchResults({
                    variables: { species: filters.species.value }
                });
            }}>
            </button>
        </form>
    );
};

const dummy_results = dummy_response;

type Set = {
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

type Pokemon = {
    species: string,
    sets: Set[],
};

interface ResultProps {
    species: string;
    sets: Set[];
};

const evConvert = {
    "hp": "HP",
    "at": "Atk",
    "df": "Def",
    "sa": "SpA",
    "sd": "SpD",
    "sp": "Spe",
};

function evToString(set: Set, isEv: boolean = true): string {
    let evs = '';
    const key = isEv ? 'evs' : 'ivs';
    for(const ev in set[key]){

        // to skip __typename, since it is iterable for some reason...
        if(ev in evConvert){
            evs += set[key][ev] ? `${set[key][ev]} ${evConvert[ev]} / ` : '';
            // console.log(set[key][ev]);
        }
    }
    evs = evs.trim();
    evs = evs.endsWith('/') ? evs.slice(0, -1) : evs;
    //console.log(evs);
    return evs;
}

const ResultComponent: FunctionalComponent<ResultProps> = (props: ResultProps) => {
    return (
        <div class={style.results}>
            <div class={`${style.resultcols} ${style.sticky}`}>
                <b>Results</b>
                {/*<div></div>
                <div></div>
                <div class={`${style.stackdivs} ${style.tight}`}>
                    <div><i>ability</i></div>
                    <div><i>nature</i></div>
                </div>
                <div class={`${style.stackdivs} ${style.tight}`}>
                    <div><i>evs</i></div>
                    <div><i>ivs</i></div>
                </div>
                <div class={`${style.grid} ${style.c2} ${style.r2} ${style.tight}`}>
                    <div>move 1</div><div>move 2</div>
                    <div>move 3</div><div>move 4</div>
                </div>
                <div>types</div>*/}
            </div>
            <ul>
            {
                props.sets.map((set) => (
                    <li key={`${props.species}: ${set.name}`} class={`${style.result}`}>
                        <div class={style.wrapper}><div class={`${style.toptag} ${style.clip}`}>{set.name}</div><div class={style.triangle_bottom_left}></div></div>
                        <div class={`${style.resultcols} ${style.bottag}`}>
                            <div class={style.wrapper}>
                                {/* NOTE that these links do not have animations for some newer mons and icons for newer items */}
                                <img src={`https://play.pokemonshowdown.com/sprites/gen5ani/${props.species.toLowerCase().split(' ').join('-')}.gif`}></img>
                                <img class={style.icon} src={`https://play.pokemonshowdown.com/sprites/itemicons/${set.item.toLowerCase().split(' ').join('-')}.png`}></img>
                            </div>
                            <div class={`${style.grid} ${style.c1} ${style.r3}`}>
                                <div>By <i>Storm Zone</i></div>
                                <div>
                                    <FontAwesomeIcon icon={fasStar}></FontAwesomeIcon>
                                    <FontAwesomeIcon icon={fasStar}></FontAwesomeIcon>
                                    <FontAwesomeIcon icon={fasStar}></FontAwesomeIcon>
                                    <FontAwesomeIcon icon={farStar}></FontAwesomeIcon>
                                    <FontAwesomeIcon icon={farStar}></FontAwesomeIcon>
                                </div>
                                <div>From <i>2021-11-14</i></div>
                            </div>
                            <div class={`${style.grid} ${style.c1} ${style.r2} ${style.tight}`}>
                                <div>{set.ability}</div>
                                <div><i>{set.nature}</i> Nature</div>
                            </div>
                            <div class={`${style.grid} ${style.c1} ${style.r2} ${style.tight}`}>
                                {<div>EVs: {evToString(set)}</div>}
                                {set.ivs ? <div>IVs: {evToString(set, false)}</div> : <div></div>}
                            </div>
                            <div class={`${style.grid} ${style.c2} ${style.r2} ${style.tight}`}>
                                {set.moves.map(move => <div>{move}</div>)}
                            </div>
                            <div class={`${style.grid} ${style.c2} ${style.r1} ${style.tight}`}><b>Tags:</b>{/* TODO: show excerpt of description, clipped by ellipsis */}</div>
                            {/* {<div>{pokedex[props.species.toLowerCase()]["types"].map(_type => <div class={`${style[_type.toLowerCase()]} ${style.typing}`}>{_type}</div>)}</div>} */}
                        </div>
                        
                    </li>
                ))
            }
            </ul>
        </div>
    );
};

const SetBrowser: FunctionalComponent<Props> = (props: Props) => {
    const [results, setResults] = useState(dummy_results as any);
    console.log(results);
    return (
    <div class={style.setbrowser}>
        <SearchComponent setResults={(searchResults) => setResults(searchResults)}/>
        <ResultComponent species={results.pokemon.species} sets={results.pokemon.sets}/>
    </div>
    );
};
 
 export default SetBrowser;
 