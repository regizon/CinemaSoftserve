import React, {useEffect} from "react";
import '../NotFound.css'
import { useNavigate } from "react-router-dom";

export default function UnLogin() {
    const navigate = useNavigate();
    useEffect(() => {
        localStorage.setItem('access', "");
        navigate('/');
        window.location.reload();
    })
    
    return(
        <div className="not-found-page">
            <div className="not-found-content">
                <h3>Exit...</h3>
            </div>
        </div>
        
    );
}