import { useQuery, gql } from '@apollo/client';
import { FunctionalComponent, h } from 'preact';
import { route } from 'preact-router';
import { useContext, useEffect, useState } from 'preact/hooks';
import { Auth } from '../../components/auth';
import Creator from '../../components/creator';
import { Panel } from '../../components/panel';
import { ResultComponent } from '../../components/results';
import { SETS } from '../../queries';
import { AuthContext } from '../../token';
import style from './style.css';

const sample = `Bestcadrill (Excadrill) @ Leftovers  
Ability: Mold Breaker  
EVs: 44 HP / 44 Atk / 212 SpD / 208 Spe  
Jolly Nature  
- Rapid Spin  
- Toxic    
- Iron Head`;

interface Props {
    user: string;
}

const Uploader: FunctionalComponent<Props> = (props: Props) => {

    return (
        <Auth rerouteIfSignedOut='/login'>
            <div class={style.upload}>
                <h2>Set Uploader</h2>
                <Creator/>
            </div>
        </Auth>
    );
};

export default Uploader;
