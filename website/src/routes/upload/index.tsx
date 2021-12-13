import { useQuery, gql } from '@apollo/client';
import { FunctionalComponent, h } from 'preact';
import { route } from 'preact-router';
import { useContext, useEffect, useState } from 'preact/hooks';
import Creator from '../../components/creator';
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
    const { user } = props;
    const [time, setTime] = useState<number>(Date.now());
    const [count, setCount] = useState<number>(0);
    const { accessToken, setAccessToken } = useContext(AuthContext);
    const [ config, setConfig ] = useState("");
    const [ desc, setDesc ] = useState("");
    const [ res, setRes ] = useState("");

    // since this is an authenticated page, force authentication
    useEffect(() => {
        fetch('https://localhost:4000/token', { 
            method: 'POST',
            credentials: 'include'
        })
            .then(async res => {
                console.log(res);
                if(res.status !== 200) throw Error();
                const json = await res.json();
                setAccessToken(json.accessToken);
            })
            .catch(err => {
                console.error(err);
                setAccessToken("");
                route('/login', true);
            });
    }, [accessToken]);

    if(!accessToken) return <div></div>;
    // console.log(data);

    return (
        <Creator/>
    );
};

export default Uploader;
