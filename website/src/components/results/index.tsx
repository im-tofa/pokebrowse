
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
                                <div>By <i>{set.author}</i></div>
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

export { ResultComponent };