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


import { Component, FunctionalComponent, h } from 'preact';
import style from './style.css';
import { useState, useCallback, useReducer, useEffect } from 'preact/hooks';
import Filter from './../../components/filter';
import parseInput from './tokenizer';
import dummy_response from './dummy_response';
import pokedex from './pkmnstats';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons'
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons'

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

const SearchComponent: FunctionalComponent<Props> = (props: Props) => {
    const [currentInput, setCurrentInput] = useState('');
    const [filters, setFilters] = useState(dummy_filters);

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
    nature: string
};

interface ResultProps {
    species: string;
    sets: Set[];
};

const ResultComponent: FunctionalComponent<ResultProps> = (props: ResultProps) => {
    return (
        <div class={style.results}>
            <div class={`${style.resultcols} ${style.sticky}`}><div></div><div></div><div>types</div><div>ability</div><div>author</div><div>rating</div></div>
            <ul>
            {
                props.sets.map((set) => (
                    <li key={`${props.species}: ${set.name}`} class={`${style.result}`}>
                        <div class={style.wrapper}><div class={`${style.toptag}`}>{set.name}</div><div class={style.triangle_bottom_left}></div></div>
                        <div class={`${style.resultcols} ${style.bottag}`}>
                            <img src={`https://play.pokemonshowdown.com/sprites/gen5ani/${props.species.toLowerCase()}.gif`}></img>
                            <div class={style.stackdivs}>
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
                            <div>{props.species}</div>
                            <div>{pokedex[props.species.toLowerCase()]["types"].map(_type => <div class={`${style[_type.toLowerCase()]} ${style.typing}`}>{_type}</div>)}</div>
                            <div>{set.ability}</div>
                            <div class={style.author}>Storm Zone</div>
                        </div>
                        
                    </li>
                ))
            }
            </ul>
        </div>
    );
};

const SetBrowser: FunctionalComponent<Props> = (props: Props) => {

    return (
    <div class={style.setbrowser}>
        <SearchComponent />
        <ResultComponent species={dummy_results.pokemon.species} sets={dummy_results.pokemon.sets}/>
    </div>
    );
};
 
 export default SetBrowser;
 