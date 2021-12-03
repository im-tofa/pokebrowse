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
    const [species, setSpecies] = useState([] as string[]);
    const [speed, setSpeed] = useState(0);
    const [author, setAuthor] = useState('');
    const [filters, setFilters] = useState(dummy_filters);

    function handleUserInput(event: KeyboardEvent) {
        event.preventDefault();
        if(event.code === "Enter"){
            setCurrentInput('');
            const res = parseInput(event.target.value);
            if(res){
                switch(res.key) {
                    case "species":
                        if(species.includes(res.val)) break;
                        setSpecies([...species, res.val]);
                        break;
                    case "speed":
                        setSpeed(parseInt(res.val));
                        break;
                    case "author":
                        setAuthor(res.val);
                        break;
                    default:
                        break;
                }
            }
        }
    };

    const [fetchResults, {loading, error, data}] = useLazyQuery(SETS);

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
            {speed !== 0 && <Filter filterType={'speed'} filterValue={speed} inputType={'input'} remove={(event) => {event.preventDefault(); setSpeed(0)}}></Filter>}
            {author && <Filter filterType={'author'} filterValue={author} inputType={'input'} remove={(event) => {event.preventDefault(); setAuthor('')}}></Filter>}
            </div>}
            <button class={style.searchButton} onClick={(e) => {
                e.preventDefault(); 
                console.log(species);
                fetchResults({
                    variables: { species: species, author: author, speed: speed }
                });
            }}>
                Search!
            </button>
        </form>
    );
};

export { SearchComponent };