import { useQuery, gql, useApolloClient } from '@apollo/client';
import { FunctionalComponent, h } from 'preact';
import { route } from 'preact-router';
import { useContext, useEffect, useState } from 'preact/hooks';
import { ResultComponent } from '../../components/results';
import { SETS } from '../../queries';
import { AuthContext } from '../../token';
import { Auth } from '../auth';
import { Refresh } from '../refresh';
import style from './style.css';

interface Props {
    reroute?: string;
};

// TODO: Rewrite to use function for retrying instead
const Creator: FunctionalComponent<Props> = (props: Props) => {
    const { accessToken, setAccessToken } = useContext(AuthContext);
    const [retry, setRetry] = useState(false);
    const client = useApolloClient();
    const [uploadError, setUploadError] = useState("");
    const [ config, setConfig ] = useState("");
    const [ name, setName ] = useState("");
    const [ desc, setDesc ] = useState("");
    const reroute = props.reroute ? props.reroute : '/browser';

    const upload = async () => {
        const response = await fetch('https://localhost:3000/set', {
            method: "POST",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({set: config, name, desc})
        });

        if (response.status === 403 || response.status === 401) throw new Error(await response.json()); // if authentication error
        if (response.status !== 200) { setUploadError(await response.json()); return; }
        
        // console.log(json);
        setUploadError("");
        client.clearStore();
        window.location.reload();
    }

    useEffect(() => {
        if(accessToken !== "" && retry) {
            setRetry(false);
            upload()
                .then(() => {console.log("form submitted"); })
                .catch((error) => {console.log(error); route('/login', true); });
        }
    }, [accessToken, retry]);

    return (
            <form class={style.creator} onSubmit={async e => {
                /* THIS DOESN'T WORK BC OF ASYNC BS */
                /* 
                    ACTUALLY, I am pretty sure this does not work because 
                    setting the access token during a retry does not take 
                    effect in the current form send, only in the next form
                    send after a re-render, since accessToken is const.
                */
                e.preventDefault();
                if(retry) return; // prevent double click/spam

                //console.log(username, password);
                try {
                    // console.log(accessToken);
                    await upload();
                    console.log("form submitted");
                } catch (error) {
                    // console.log("hesadasdf");
                    console.log(error);

                    // reset token; this will trigger Refresh context to attempt refetch
                    setAccessToken(""); 
                    setRetry(true);
                    return;
                }
            }}>
                {/* <div class={style.grid}>
                    <div/>
                    <h2>Upload a Set</h2>
                </div> */}
                {uploadError && <div><b style="color: red">{uploadError}</b></div>}
                <div class={style.grid}>
                    <label for="name">Name:</label>
                    <input type="text" id="name" value={name} onChange={(e) => {setName(e.target.value);}}/>
                </div>
                <div class={style.grid}>
                    <label for="set">Import:</label>
                    <textarea id="set" value={config} onChange={(e) => {setConfig(e.target.value);}}/>
                </div>
                <div class={style.grid}>
                    <label for="desc">Description:</label>
                    <textarea id="desc" value={desc} onChange={(e) => {setDesc(e.target.value);}}/>
                </div>
                <div class={style.grid}>
                    <div/>
                    <button type="submit">Submit!</button>
                </div>
            </form>        
    );
};

export default Creator;
