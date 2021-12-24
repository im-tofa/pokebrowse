import { useQuery, gql } from '@apollo/client';
import { FunctionalComponent, h } from 'preact';
import { route } from 'preact-router';
import { useContext, useEffect, useState } from 'preact/hooks';
import { Auth } from '../../components/auth';
import Creator from '../../components/creator';
import { Panel } from '../../components/panel';
import { ResultComponent } from '../../components/results';
import SetManager from '../../components/set-manager';
import { Sidebar } from '../../components/sidebar';
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

const Profile: FunctionalComponent<Props> = (props: Props) => {
    return (
        <Auth rerouteIfSignedOut='/login'>
            <main class={style.main}>
                <SetManager/>
                <Sidebar>
                    <Panel>
                        <h2>Delete Sets</h2>
                        <div>
                            Select items by clicking on them 
                            (they will be highlighted in blue). 
                            Then, press the delete button that 
                            appears in order to delete your sets.
                            <br/> <br/>
                            <b>WARNING:</b> Deleting your sets is an
                            irreversible action!
                        </div>
                    </Panel>
                    <Panel>
                        <h2>Upload Set</h2>
                        <Creator reroute='/profile'/>
                    </Panel>
                </Sidebar>
            </main>
        </Auth>
    );
};

export default Profile;
