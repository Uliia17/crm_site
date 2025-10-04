import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api.client";
import { useDispatch } from "react-redux";
import { setTokens, setUser } from "../redux/slices/authSlice";

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState("admin@gmail.com");
    const [password, setPassword] = useState("admin");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        try {
            const resp = await client.post("/login/sign-in", new URLSearchParams({
                email, password
            }), {
                headers: { "Content-Type": "application/x-www-form-urlencoded" }
            });

            // бек може віддати структуру { access, refresh, user } або { tokens: { accessToken, refreshToken }, user }
            const data = resp.data;
            const access = data.access ?? data.tokens?.accessToken;
            const refresh = data.refresh ?? data.tokens?.refreshToken;
            const user = data.user ?? data.user;

            if (!access) {
                alert("No access token returned");
                return;
            }

            dispatch(setTokens({ accessToken: access, refreshToken: refresh ?? "" }));
            dispatch(setUser(user ?? null));
            navigate("/orders");
        } catch (err) {
            console.error(err);
            alert("Login failed");
        }
    }

    return (
        <form onSubmit={submit}>
            <h2>Login</h2>
            <div>
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="email" />
            </div>
            <div>
                <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="password" />
            </div>
            <button type="submit">Sign in</button>
        </form>
    );
};

export default LoginPage;
