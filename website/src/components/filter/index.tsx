import { FunctionalComponent, h } from 'preact';
import { Link } from 'preact-router/match';
import style from './style.css';

/** 
 * TODO: Make button delete filter on click
 * 
 * Also, find a way to make filter part of a form or something, 
 * that can be sent to a server and validated before being sent 
 * to database. 
*/
const Filter: FunctionalComponent = (props) => {
    return (
        <div class={style.filter}>
            {/*<div>{(props as any).filterType + ": " + (props as any).filterValue}</div>*/}
            <span>{(props as any).filterType + ": " + (props as any).filterValue}</span>
            <button onClick={(props as any).remove} class={`${style.btn} fa fa-trash`}></button> 
        </div>
    );
};

export default Filter;
