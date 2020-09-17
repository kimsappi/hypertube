import React, { useState, useEffect, Fragment } from "react";
import Axios from "axios";
import config from '../../config/config';
import { useParams, Link } from 'react-router-dom';

const ApiLog = () => {

    const { action } = useParams();
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get('code');
    const [response, setResponse] = useState('');
    const [passOne, setPassOne] = useState('');
    const [passTwo, setPassTwo] = useState('');
    
    useEffect(() => {
        console.log('axios updated');

    }, [response]);

    useEffect(() => {
        const loginApi = async (code) => {
            console.log('codeLOGIN', code);
            let axiosResponse = await Axios.post(
                config.SERVER_URL+'/42/login',
                {code: code}
            )
            if (axiosResponse.status === 200)
            {
                localStorage.setItem("HiveflixToken", axiosResponse.data.token);
                localStorage.setItem("HiveflixUsername", axiosResponse.data.username);
                localStorage.setItem("HiveflixProfilePicture", axiosResponse.data.profilePicture);
                window.location.replace("http://localhost:3000/home");
            }
            setResponse(axiosResponse);
            console.log(axiosResponse);
            console.log("LOGIN");
        }
            
        const registerApi = async (code) => {
            console.log('codeREGISTER', code);
            let axiosResponse = await Axios.post(
                config.SERVER_URL+'/42/register',
                {code: code,
                test: "asd"}
            )
            setResponse(axiosResponse);
            console.log(axiosResponse);
            console.log("REGISTER");
        }
        
        if (action == 'login')
            loginApi(code);
        else if (action == 'register')
            registerApi(code);

        
    }, [])
    
const registerSubmit = async (event) => {
    event.preventDefault();
    console.log("pw submitted");

    if (passOne === passTwo)
    {
        let passResponse = await Axios.post(
            config.SERVER_URL+'/42/submitPass',
            {user: response.data.login,
            password: passOne}
        )
        console.log(passResponse);
        if (passResponse.status === 200)
        {
            localStorage.setItem("HiveflixToken", passResponse.data.token);
			localStorage.setItem("HiveflixUsername", passResponse.data.username);
            localStorage.setItem("HiveflixProfilePicture", passResponse.data.profilePicture);
            window.location.replace("http://localhost:3000/home");
        }
    }
    else
    {
        console.log("Passwords dont match")
    }
}

const setPassOneF = (event) => {
    setPassOne(event.target.value);
    console.log(passOne);
}

const setPassTwoF = (event) => {
    setPassTwo(event.target.value);
    console.log(passTwo);
}

    return (
        <>
            
            {response && action == 'register' ? 
            <>
                <h1>Hello {response.data.firstName}!</h1>
                {response.data.usernameTaken == true ? <h4>Your username was taken, so we added some numbers to the end..</h4> : ''}
                <h3>Your username is: {response.data.login}</h3>
                <h4>Set your password:</h4>
                <form onSubmit={registerSubmit}>
                    <input type="password" id="pass1" onChange={setPassOneF}/>
                    <input type="password" id="pass2" onChange={setPassTwoF}/>
                    <button type="submit">Set password!</button>
                </form>
            </>
            : response && action == 'login' ? 
            <>
            </>
            : 
            <h1>Loading....</h1> }

          
        </>
    )
}

export default ApiLog;