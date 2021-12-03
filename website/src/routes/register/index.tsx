import { useLazyQuery } from '@apollo/client';
import { FunctionalComponent, h } from 'preact';
import { route } from 'preact-router';
import { useState } from 'preact/hooks';
import { setAccessToken } from '../../token';
import style from './style.css';

const Register: FunctionalComponent = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
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
