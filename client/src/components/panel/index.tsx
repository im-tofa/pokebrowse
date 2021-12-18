import style from './style.css';

import { Component, FunctionalComponent, h, Fragment } from 'preact';
const Panel: FunctionalComponent = (props) => {
    return (
        <div class={style.panel}>
          {props.children}
        </div>
    );
};

export { Panel };