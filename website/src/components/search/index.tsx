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
import parseInput from '../../routes/browser/tokenizer';
import { SETS } from '../../queries';

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

interface SearchProps {
    setResults(sets): void; 
};

const SearchComponent: FunctionalComponent<SearchProps> = (props: SearchProps) => {
    const [currentInput, setCurrentInput] = useState('');
    const [species, setSpecies] = useState(['Excadrill'] as string[]);
    const [speed, setSpeed] = useState(0);
    const [author, setAuthor] = useState('');
    const [filters, setFilters] = useState(dummy_filters);

    function handleUserInput(event: KeyboardEvent) {
        event.preventDefault();
        if(event.code === "Enter"){
            setUserInput(event.target.value);
        }
    };

    function setUserInput(value: string) {
        setCurrentInput('');
        const res = parseInput(value);
        if(res){
            switch(res.key) {
                case "species":
                    if(!res.val) break; // e.g empty string
                    if(species.includes(res.val)) break;
                    setSpecies([...species, res.val]);
                    break;
                case "speed":
                    setSpeed(parseInt(res.val));
                    break;
                case "author":
                    if(!res.val) break; // e.g empty string
                    setAuthor(res.val);
                    break;
                default:
                    break;
            }
        }
    }

    const [fetchResults, {loading, error, data}] = useLazyQuery(SETS, {
        fetchPolicy: "no-cache"
    });

    if(loading) {}
    else {
        if(error) {
            console.error(error);
            console.error(data);
        } else {
            if(data !== undefined) {
                // console.log(data.sets);
                props.setResults(data.sets);
            }
        }
    }

    return (
        <form class={style.filters}>
          <div class={style.cli}>
            {/* <h3>Filters: </h3> */}
            <input type="text" id="cli" class={style.cmd} value={currentInput} placeholder="/species <pokemon>, /speed <speedtier> or /author <name>, then press Enter" onChange={(event) => setCurrentInput(event.target.value)} onKeyUp={(event) => handleUserInput(event)} onKeyDown={(event) => {if(event.code === 'Enter') event.preventDefault();}}></input>
            <button class={`${style.btn}`} onClick={(event) => {event.preventDefault(); setUserInput(document.getElementById("cli").value);}}><i class="fa fa-plus"/> Add  </button>
          </div>
          {/* (Object.keys(species).length > 0 || author !== '' || speed !== 0) */}
          <div class={style.query}>
            {<div class={style.chosen}>
                <h5>Filters: </h5>
                {species.map((val) => <Filter filterType={'species'} filterValue={val} inputType={'input'} remove={(event) => {event.preventDefault(); setSpecies([...species].filter(el => el !== val))}}></Filter>)}
                {speed !== 0 && <Filter filterType={'speed'} filterValue={speed} inputType={'input'} remove={(event) => {event.preventDefault(); setSpeed(0)}}></Filter>}
                {author && <Filter filterType={'author'} filterValue={author} inputType={'input'} remove={(event) => {event.preventDefault(); setAuthor('')}}></Filter>}
                </div>}
                <button class={`${style.btn}`} onClick={(e) => {
                    e.preventDefault(); 
                    // console.log(species);
                    fetchResults({
                        variables: { species: species, author: author, speed: speed }
                    });
                }}>
                <i class='fa fa-search'/> Search
                </button>
            </div>
        </form>
    );
};

export { SearchComponent };