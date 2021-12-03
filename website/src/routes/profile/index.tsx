import { useQuery, gql } from '@apollo/client';
import { FunctionalComponent, h } from 'preact';
import { route } from 'preact-router';
import { useContext, useEffect, useState } from 'preact/hooks';
import { ResultComponent } from '../../components/results';
import { SETS } from '../../queries';
import { AuthContext } from '../../token';
import style from './style.css';

interface Props {
    user: string;
}

const Profile: FunctionalComponent<Props> = (props: Props) => {
    const { user } = props;
    const [time, setTime] = useState<number>(Date.now());
    const [count, setCount] = useState<number>(0);
    const { accessToken, setAccessToken } = useContext(AuthContext);
    const [ config, setConfig ] = useState("");

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

    const {loading, error, data} = useQuery(SETS, { variables: {species: ['excadrill'], author: '', speed: 0}});
    console.log(error);
    if(loading) return <div>Loading...</div>;
    if(error) return <div>Error</div>;

    return (
        <div class={style.profile}>
            <h1>Profile</h1>
            <form>
                <h2>Create a set</h2>
                <textarea value={config} onChange={(e) => {setConfig(e.target.value);}}>

                </textarea>
            </form>
            <div>
                <h2>Uploaded sets:</h2>
                <ResultComponent sets={data.sets}/>
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
