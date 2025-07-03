import React from "react";
import { Link } from 'react-router-dom';
import { isTokenValid } from './auth.js';


export  default function Footer() {
    const accessToken = localStorage.getItem('access');
    const isAuth = isTokenValid(accessToken);
    return (
        <header className="header1">
            <div className="container1">
            <h1 className="logo1"><a href="/">Svinkino</a></h1>
            {isAuth ? (
            <p className="login-link1">
                <Link to="/profile">Профіль</Link>
            </p>
            ) : (
            <p className="login-link1">
                <Link to="/login">Увійти</Link> / <Link to="/register">Реєстрація</Link>
            </p>
            )}
            </div>
        </header>
    );
}