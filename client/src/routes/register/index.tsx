import { useLazyQuery } from '@apollo/client';
import { FunctionalComponent, h } from 'preact';
import { Link, route } from 'preact-router';
import { useContext, useEffect, useState } from 'preact/hooks';
import { Auth } from '../../components/auth';
import { AuthContext } from '../../token';
import style from './style.css';

const Register: FunctionalComponent = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
        <Auth rerouteIfSignedIn='/upload'>
            <div class={style.register}>
                <h1>Sign up</h1>
                {/* <p>This is the Register component.</p> */}
                <form class={style.form} onSubmit={ async e => {
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
                        <input
                            value={username}
                            placeholder="username"
                            onChange={(e) => setUsername(e.target?.value || '')}
                        />
                        <input
                            type="password"
                            value={password}
                            placeholder="password"
                            onChange={(e) => setPassword(e.target?.value || '')}
                        />
                    <button type="submit">Register</button>
                </form>
                <div>Already have an account? <Link href="/login">Sign in</Link>!</div>
            </div>
        </Auth>
    );
};

export default Register;
