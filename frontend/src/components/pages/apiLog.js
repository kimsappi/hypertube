import React, { useState, useEffect, Fragment } from "react";
import Axios from "axios";
import config from '../../config/config';
import { useParams, Link } from 'react-router-dom';

const ApiLog = () => {

    const { action } = useParams();
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get('code');
    
    
    const loginApi = async (code) => {
        console.log('codeLOGIN', code);
        var response = await Axios.post(
            config.SERVER_URL+'/42/login',
            {code: code,
            test: "asd"}
        )
        console.log(response);
        console.log("LOGIN");
    }
        
    const registerApi = async (code) => {
        console.log('codeREGISTER', code);
        var response = await Axios.post(
            config.SERVER_URL+'/42/register',
            {code: code,
            test: "asd"}
        )
        console.log(response);
        console.log("REGISTER");
    }
    
    if (action == 'login')
        loginApi(code);
    else if (action == 'register')
        registerApi(code);



    return (
        <>
            <h1>MORO!</h1>
        </>
    )
}

export default ApiLog;