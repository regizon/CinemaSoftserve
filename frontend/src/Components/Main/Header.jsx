import React from "react";
import { Link } from 'react-router-dom';

export  default function Footer() {
    return (
        <header className="header1">
            <div className="container1">
            <h1 className="logo1"><a href="/">Svinkino</a></h1>
            <p  className="login-link1"><Link to={`/login`} >Увійти</Link>/<Link to={`/register`} >Реєстрація</Link></p>
            </div>
        </header>
    );
}