
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

interface ResultProps {
    set: Set;
    setChosen(s: string): void; 
};

const Popup: FunctionalComponent<ResultProps> = (props: ResultProps) => {
    const set = props.set;
    return (
        <div class={style.popup} onClick={(e) => {
            e.preventDefault();
            props.setChosen('');
        }}>
            <div class={style.details} onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
        }}>
            <button class={style.btn} onClick={(e) => {
                    e.preventDefault();
                    props.setChosen('');
                }}><i class="fa fa-times"></i></button>
                <div class={style.metadata}>
                <div class={`${style.wrapper} ${style.image}`}>
                                {/* NOTE that these links do not have animations for some newer mons and icons for newer items */}
                                <img class={style.img} src={`https://play.pokemonshowdown.com/sprites/gen5ani/${set.species}.gif`} onError={(event) => {
                                        if(event.target.src === `https://play.pokemonshowdown.com/sprites/gen5/0.png`) return;
                                        if(event.target.src === `https://play.pokemonshowdown.com/sprites/gen5/${set.species}.png`) {
                                            event.target.src = `https://play.pokemonshowdown.com/sprites/gen5/0.png`;
                                            return;
                                        }   
                                        event.target.src = `https://play.pokemonshowdown.com/sprites/gen5/${set.species}.png`;
                                    }}></img>
                                <img class={style.icon} src={`https://play.pokemonshowdown.com/sprites/itemicons/${set.item.toLowerCase().split(' ').join('-')}.png`} onError={(event) => {
                                        if(event.target.src === `https://play.pokemonshowdown.com/sprites/itemicons/0.png`) return;
                                        event.target.src = `https://play.pokemonshowdown.com/sprites/itemicons/0.png`;
                                    }}></img>
                            </div>
                    <div class={style.author}><b>Author:</b> {set.author}</div>
                    <div class={style.date}><b>Uploaded on:</b> {new Date(set.set_uploaded_on).toLocaleDateString()}</div>
                    <div class={style.rating}><b>Rating:</b> <i class="fas fa-star"/><i class="fas fa-star"/><i class="fas fa-star"/><i class="far fa-star"/><i class="far fa-star"/></div>
                </div>
                <div class={style.description}>
                    <h4>Description</h4>
                    <div>{set.description}</div>
                </div>
                <div class={style.import}>
                    <h4>Import</h4>
                    <div>{exportSet(set)}</div>
                </div>
            </div>
        </div>
    );
};

export { Popup };