import { useQuery, gql } from '@apollo/client';
import { FunctionalComponent, h } from 'preact';
import { route } from 'preact-router';
import { useContext, useEffect, useState } from 'preact/hooks';
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

const Profile: FunctionalComponent<Props> = (props: Props) => {
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
                route('/setbrowser', true);
            });
    }, []);

    // gets called when this route is navigated to
    useEffect(() => {
        const timer = window.setInterval(() => setTime(Date.now()), 1000);

        // gets called just before navigating away from the route
        return (): void => {
            clearInterval(timer);
        };
    }, []);

    // update the current time
    const increment = (): void => {
        setCount(count + 1);
    };

    const {loading, error, data} = useQuery(SETS, { variables: {species: ['excadrill']}});
    // console.log(error);
    if(loading) return <div>Loading...</div>;
    if(error) {
        console.log(error);
        return <div>Error</div>;
    }

    return (
        <div class={style.profile}>
            <h1>Profile</h1>
            <form onSubmit={async e => {
                e.preventDefault();
                console.log("form submitted");
                //console.log(username, password);
                try {
                    const response = await fetch('https://localhost:3000/set', {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            'Content-Type': 'application/json',
                            'authorization': `Bearer ${accessToken}`
                        },
                        body: JSON.stringify({set: config})
                    });
                    const json = await response.json();
                    console.log(json);
                    setRes(JSON.stringify(json));
                } catch (error) {
                    console.log(error);
                }
            }}>
                <h2>Create a set</h2>
                <div>
                    <label for="set">Import</label>
                    <textarea id="set" value={config} onChange={(e) => {setConfig(e.target.value);}}/>
                </div>
                <div>
                    <label for="desc">Description</label>
                    <textarea id="desc" value={desc} onChange={(e) => {setDesc(e.target.value);}}/>
                </div>
                <button type="submit">Submit!</button>
            </form>
            <div>
                <h2>Uploaded sets:</h2>
                <div>{res}</div>
                {/* <ResultComponent sets={data.sets}/> */}
            </div>

            {/* <div>Current time: {new Date(time).toLocaleString()}</div>

            <p>
                <button onClick={increment}>Click Me</button> Clicked {count}{' '}
                times.
            </p> */}
        </div>
    );
};

export default Profile;
