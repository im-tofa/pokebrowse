import style from './style.css';

import { Component, FunctionalComponent, h, Fragment } from 'preact';
const Sidebar: FunctionalComponent = (props) => {
    return (
        <div class={style.sidebar}>
          {props.children}
        </div>
    );
};

export { Sidebar };