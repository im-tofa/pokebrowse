import { useQuery, gql, useLazyQuery, useApolloClient } from '@apollo/client';
import { FunctionalComponent, h } from 'preact';
import { route } from 'preact-router';
import { useContext, useEffect, useState } from 'preact/hooks';
import { Auth } from '../../components/auth';
import Creator from '../../components/creator';
import { Panel } from '../../components/panel';
import { ResultComponent } from '../../components/results';
import { Sidebar } from '../../components/sidebar';
import { SETS } from '../../queries';
import { AuthContext } from '../../token';
import { Set } from '../../types';
import style from './style.css';

const sample = `Bestcadrill (Excadrill) @ Leftovers  
Ability: Mold Breaker  
EVs: 44 HP / 44 Atk / 212 SpD / 208 Spe  
Jolly Nature  
- Rapid Spin  
- Toxic    
- Iron Head`;

const SetManager: FunctionalComponent = () => {
    const { accessToken, setAccessToken } = useContext(AuthContext);
    const client = useApolloClient();
    const [retry, setRetry] = useState(false);
    const [selected, setSelected] = useState<string[]>([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [results, setResults] = useState<{sets: Set[], next_cursor: number | null}>({sets: [], next_cursor: null});
    
    const deleteSets = async () => {
        const response = await fetch('https://localhost:3000/set', {
            method: "DELETE",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({set_ids: selected})
        });

        if (response.status === 403 || response.status === 401) throw new Error(await response.json()); // if authentication error
        if (response.status !== 200) { setErrorMessage(await response.json()); return; }
        
        // console.log(json);
        setErrorMessage("");

        const author = JSON.parse(atob(accessToken ? accessToken.split('.')[1] : "")).name
        
        // fetch sets after any deletion
        client.clearStore(); // NOTE: A bit extreme, maybe be more precise in the cache updates
        fetchResults({variables: {author}});
    }

    useEffect(() => {
        if(accessToken !== "" && retry) {
            setRetry(false);
            deleteSets()
                .then(() => {console.log("form submitted"); })
                .catch((error) => {console.log(error); route('/login', true); });
        }
    }, [accessToken, retry]);

    // fetch sets once in the beginning
    useEffect(() => {
        if(accessToken !== "") {
            const author = JSON.parse(atob(accessToken ? accessToken.split('.')[1] : "")).name
            fetchResults({variables: {author}});
        }
    }, [accessToken]);

    // TODO: this causes hot refresh to fail due to access token.
    // console.log(JSON.parse(atob(accessToken ? accessToken.split('.')[1] : "")).name);
    const [fetchResults, { loading, error, data, fetchMore } ] = useLazyQuery(SETS);
    // console.log(error);
    if(loading) {
        return <div>Loading...</div>;
    } else {
        if(error) {
            // console.log(error);
            return <div>Error</div>;
        } else {
            if (data !== undefined) {
                // console.log(data);
                setResults(data.sets);
                // console.log(data.sets);
                // console.log(fetchMore);
                // console.log("hiiiiiiiii");
            }
        }


    }

    // console.log(data);

    return (
        <div class={style.profile}>
            <h2>My Sets</h2>
            {errorMessage && <div><b style="color: red">{errorMessage}</b></div>}
            <ResultComponent results={results} fetchMore={fetchMore} editable={true} selected={selected} setSelected={setSelected}/>
            {selected.length > 0 && <button class={style.btn} onClick={async (e) => {
                e.preventDefault(); 
                if(retry) return; // prevent double click/spam
                if(!confirm(`Are you sure you want to delete ${selected.length === 1 ? 'this set' : 'these sets'}?`)) return;

                //console.log(username, password);
                try {
                    // console.log(accessToken);
                    await deleteSets();
                    console.log("form submitted");
                } catch (error) {
                    // console.log("hesadasdf");
                    console.log(error);

                    // reset token; this will trigger Refresh context to attempt refetch
                    setAccessToken(""); 
                    setRetry(true);
                    return;
                }
            }}><b>Delete</b></button>}
        </div>
    );
};

export default SetManager;
