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
import parseInput from './tokenizer';
import dummy_response from './dummy_response';
import pokedex from './pkmnstats';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons'
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons'

import { ApolloProvider, ApolloClient, useQuery, gql, useLazyQuery } from '@apollo/client';

import SearchComponent from '../../components/search';
 
interface Props {
};

const dummy_results = dummy_response;

type Set = {
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

type Pokemon = {
    species: string,
    sets: Set[],
};

interface ResultProps {
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
                    <li key={`${set.species}: ${set.name}`} class={`${style.result}`}>
                        <div class={style.wrapper}><div class={`${style.toptag} ${style.clip}`}>{set.name}</div><div class={style.triangle_bottom_left}></div></div>
                        <div class={`${style.resultcols} ${style.bottag}`}>
                            <div class={style.wrapper}>
                                {/* NOTE that these links do not have animations for some newer mons and icons for newer items */}
                                <img src={`https://play.pokemonshowdown.com/sprites/gen5ani/${set.species.toLowerCase().split(' ').join('-')}.gif`} onError={(event) => event.target.src = `https://play.pokemonshowdown.com/sprites/gen5/${set.species.toLowerCase().split(' ').join('')}.png`}></img>
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
    const [results, setResults] = useState([]);
    //console.log(results);
    return (
    <div class={style.setbrowser}>
        <SearchComponent setResults={(searchResults) => setResults(searchResults)}/>
        <ResultComponent sets={results}/>
    </div>
    );
};
 
 export default SetBrowser;
 