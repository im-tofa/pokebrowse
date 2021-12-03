import { FunctionalComponent, h } from 'preact';
import { Link } from 'preact-router/match';
import style from './style.css';

const resolveInput = (filterType: string) => {
    let input = "";
    switch (filterType.toLowerCase().replace(' ', '')) {
        case "species":
        case "speedtier":
        case "type":
        case "author":
            input = 'text';
            break;
        case "uploaddate":
            input = 'date';
            break;
        default:
    }

    return input;
};

const deleteComponent = () => {

}

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
            <label>
                <span>{(props as any).filterType + ": " + (props as any).filterValue}</span>
                {/*<input type={(props as any).inputType} name={(props as any).filterType} value={(props as any).filterValue} readonly>
                </input>*/}
            </label>
            <button onClick={(props as any).remove}></button> 
        </div>
    );
};

export default Filter;
