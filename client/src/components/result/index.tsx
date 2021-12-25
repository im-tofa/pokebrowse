
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
import { StateUpdater, useState } from 'preact/hooks';
import { Popup } from '../popup';
import { evToString } from '../../helpers/set';

interface ResultProps {
    set: Set;
    onClick?: h.JSX.MouseEventHandler<HTMLLIElement>;
};

const Result: FunctionalComponent<ResultProps> = (props: ResultProps) => {
    const set = props.set;
    const onClick = props.onClick;
    return (
        <li class={`${style.result}`} onClick={onClick}>
                {/* another class ${highlighted?.includes(set.set_id.toString()) ? style.highlighted : ''} */}
                <div class={`${style.name}`}>
                    <div>{set.name ? set.name : set.species}</div>
                    {/* <button onClick={(e) => {
                        e.preventDefault();
                        setChosen(e.currentTarget.parentElement?.parentElement?.getAttribute('data-set') || '');
                    }}>Details</button> */}
                    </div>
                <div class={`${style.wrapper} ${style.image}`}>
                    {/* NOTE that these links do not have animations for some newer mons and icons for newer items */}
                    {/* NOTE that species are already in ID form, from server processing */}
                    <img class={style.img} src={`https://play.pokemonshowdown.com/sprites/gen5ani/${set.species}.gif`} onError={(event) => {
                            if(event.currentTarget.src === `https://play.pokemonshowdown.com/sprites/gen5/0.png`) return;
                            if(event.currentTarget.src === `https://play.pokemonshowdown.com/sprites/gen5/${set.species}.png`) {
                                event.currentTarget.src = `https://play.pokemonshowdown.com/sprites/gen5/0.png`;
                                return;
                            }   
                            event.currentTarget.src = `https://play.pokemonshowdown.com/sprites/gen5/${set.species}.png`;
                        }}></img>
                    <img class={style.icon} src={`https://play.pokemonshowdown.com/sprites/itemicons/${set.item.toLowerCase().split(' ').join('-')}.png`} onError={(event) => {
                            if(event.currentTarget.src === `https://play.pokemonshowdown.com/sprites/itemicons/0.png`) return;
                            event.currentTarget.src = `https://play.pokemonshowdown.com/sprites/itemicons/0.png`;
                        }}></img>
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
    );
};

export { Result };