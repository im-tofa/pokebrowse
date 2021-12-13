
/* style */
import style from './style.css';

/* preact types */
import { FunctionalComponent, h } from 'preact';

/* fonts */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons'
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons'

/* custom types */
import { Set } from '../../types'
import { useState } from 'preact/hooks';
import { Popup } from '../popup';

interface ResultProps {
    sets: Set[];
};

const evConvert = {
    "hp": "HP",
    "atk": "Atk",
    "def": "Def",
    "spa": "SpA",
    "spd": "SpD",
    "spe": "Spe",
};

function evToString(set: Set, isEv: boolean = true): string {
    let evs = '';
    const key = isEv ? 'evs' : 'ivs';
    for(const ev in set[key]){

        // to skip __typename, since it is iterable for some reason...
        if(ev in evConvert){
            evs += ev in set[key] && set[key][ev] !== (isEv ? 0 : 31) ? `${set[key][ev]} ${evConvert[ev]} / ` : '';
            // console.log(set[key][ev]);
        }
    }
    evs = evs.trim();
    evs = evs.endsWith('/') ? evs.slice(0, -1) : evs;
    //console.log(evs);
    return evs;
}

function exportSet(set: any) {
    let text = '';

    // core
    if (set.name && set.name !== set.species) {
        text += `${set.name} (${set.species})`;
    } else {
        text += `${set.species}`;
    }
    if (set.gender === 'M') text += ` (M)`;
    if (set.gender === 'F') text += ` (F)`;
    if (set.item) {
        text += ` @ ${set.item}`;
    }
    text += `  \n`;
    if (set.ability) {
        text += `Ability: ${set.ability}  \n`;
    }
    if (set.moves) {
        for (let move of set.moves) {
            if (move.substr(0, 13) === 'Hidden Power ') {
                const hpType = move.slice(13);
                move = move.slice(0, 13);
                move = `${move}[${hpType}]`;
            }
            if (move) {
                text += `- ${move}  \n`;
            }
        }
    }

    // stats
    let first = true;
    if (set.evs) {
        for (const stat in evConvert) {
            if (!set.evs[stat]) continue;
            if (first) {
                text += `EVs: `;
                first = false;
            } else {
                text += ` / `;
            }
            text += `${set.evs[stat]} ${evConvert[stat]}`;
        }
    }
    if (!first) {
        text += `  \n`;
    }
    if (set.nature) {
        text += `${set.nature} Nature  \n`;
    }
    first = true;
    if (set.ivs) {
        for (const stat in evConvert) {
            if (set.ivs[stat] === undefined || isNaN(set.ivs[stat]) || set.ivs[stat] === 31) continue;
            if (first) {
                text += `IVs: `;
                first = false;
            } else {
                text += ` / `;
            }
            text += `${set.ivs[stat]} ${evConvert[stat]}`;
        }
    }
    if (!first) {
        text += `  \n`;
    }

    // details
    if (set.level && set.level !== 100) {
        text += `Level: ${set.level}  \n`;
    }
    if (set.shiny) {
        text += `Shiny: Yes  \n`;
    }
    if (typeof set.happiness === 'number' && set.happiness !== 255 && !isNaN(set.happiness)) {
        text += `Happiness: ${set.happiness}  \n`;
    }
    if (set.gigantamax) {
        text += `Gigantamax: Yes  \n`;
    }

    text += `\n`;
    return text;
}

const ResultComponent: FunctionalComponent<ResultProps> = (props: ResultProps) => {
    const [chosen, setChosen] = useState(''); // use set ID since it is unique
    const getSet = (id: string) => props.sets.find((set) => set.set_id === parseInt(id));
    if(chosen !== '') console.log(exportSet(getSet(chosen)));
    if(chosen !== '') console.log(JSON.stringify(getSet(chosen)));
    return (
        <div class={style.results}>
            {chosen && (
                <Popup set={getSet(chosen)!} setChosen={setChosen}/>
            )}
            <ul class={style.scrollable}>
            {
                props.sets.map((set) => (
                    <li key={`${set.set_id}`} data-set={`${set.set_id}`} class={`${style.result}`}>
                            <div class={`${style.name}`}>
                                <div>{set.name ? set.name : set.species}</div>
                                <button onClick={(e) => {
                                    e.preventDefault();
                                    setChosen(e.currentTarget.parentElement?.parentElement?.getAttribute('data-set') || '');
                                }}>Details</button></div>
                            <div class={`${style.wrapper} ${style.image}`}>
                                {/* NOTE that these links do not have animations for some newer mons and icons for newer items */}
                                <img class={style.img} src={`https://play.pokemonshowdown.com/sprites/gen5ani/${set.species.toLowerCase().split(' ').join('-')}.gif`} onError={(event) => event.target.src = `https://play.pokemonshowdown.com/sprites/gen5/${set.species.toLowerCase().split(' ').join('')}.png`}></img>
                                <img class={style.icon} src={`https://play.pokemonshowdown.com/sprites/itemicons/${set.item.toLowerCase().split(' ').join('-')}.png`}></img>
                            </div>
                            <div class={`${style.author}`}>By <i>{set.author}</i></div>
                            <div class={`${style.rating}`}>
                                <FontAwesomeIcon icon={fasStar}></FontAwesomeIcon>
                                <FontAwesomeIcon icon={fasStar}></FontAwesomeIcon>
                                <FontAwesomeIcon icon={fasStar}></FontAwesomeIcon>
                                <FontAwesomeIcon icon={farStar}></FontAwesomeIcon>
                                <FontAwesomeIcon icon={farStar}></FontAwesomeIcon>
                            </div>
                            <div class={`${style.date}`}><i>{new Date(set.set_uploaded_on).toLocaleDateString()}</i></div>
                            <div class={`${style.ability}`}>{set.ability}</div>
                            <div class={`${style.nature}`}><i>{set.nature}</i> Nature</div>
                            {set.evs ? <div class={`${style.evs}`}>EVs: {evToString(set)}</div> : <div class={`${style.evs}`}></div>}
                            {set.ivs ? <div class={`${style.ivs}`}>IVs: {evToString(set, false)}</div> : <div class={`${style.ivs}`}></div>}
                            <div class={`${style.moves}`}>
                                {set.moves.map(move => <div>{move}</div>)}
                            </div>
                            <div class={`${style.description}`}><b>Description: </b>{set.description}</div>
                            {/* <div class={`${style.grid} ${style.c2} ${style.r1} ${style.tight}`}><b>Tags:</b> */}
                            {/* TODO: show excerpt of description, clipped by ellipsis</div> */}
                            {/* {<div>{pokedex[props.species.toLowerCase()]["types"].map(_type => <div class={`${style[_type.toLowerCase()]} ${style.typing}`}>{_type}</div>)}</div>} */}
                    </li>
                ))
            }
            </ul>
        </div>
    );
};

export { ResultComponent };