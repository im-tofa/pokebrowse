import { useLazyQuery } from '@apollo/client';
import { FunctionalComponent, h } from 'preact';
import { route } from 'preact-router';
import { useContext, useEffect, useState } from 'preact/hooks';
import { AuthContext } from '../../token';
import style from './style.css';

const Register: FunctionalComponent = () => {
    const { accessToken, setAccessToken } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // redirect if user already logged in
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
                route('/profile', true);
            })
            .catch(err => {
                console.error(err);
                setAccessToken("");
            });
    }, []);

    return (
        <div class={style.register}>
            <h1>Register</h1>
            <p>This is the Register component.</p>
            <form onSubmit={ async e => {
                e.preventDefault();
                console.log("form submitted");
                //console.log(username, password);
                try {
                    const response = await fetch('https://localhost:4000/register', {
                        method: "POST",
                        // credentials: "include",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ username, password })
                    })
                    route('/login', true);
                } catch (error) {
                    console.log(error);
                    route('/register', true);
                }
            }}>
                <div>
                    <input
                        value={username}
                        placeholder="username"
                        onChange={(e) => setUsername(e.target?.value || '')}
                    />
                </div>
                <div>
                    <input
                        type="password"
                        value={password}
                        placeholder="password"
                        onChange={(e) => setPassword(e.target?.value || '')}
                    />
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
