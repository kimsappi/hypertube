import React, { useState, useEffect } from "react";
import Axios from "axios";
import config from '../../config/config';
import { useParams, useHistory } from 'react-router-dom';


const HiveLog = () => {

    const { action } = useParams();
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get('code');
    const error = urlParams.get('error');
    const [response, setResponse] = useState('');
    const [passOne, setPassOne] = useState('');
    const [passTwo, setPassTwo] = useState('');
    const [errorPassword, setError] = useState('');
    
    let history = useHistory();

    useEffect(() => {
        console.log('axios or error updated');

    }, [response, errorPassword]);

    useEffect(() => {


        const loginApi = async (code) => {
            console.log('codeLOGIN', code);

            try
            {
                let axiosResponse = await Axios.post(
                    config.SERVER_URL+'/42/login',
                    {code: code}
                )
                console.log("test1")
                if (axiosResponse.status === 200)
                {
                    localStorage.setItem("HiveflixToken", axiosResponse.data.token);
                    localStorage.setItem("HiveflixUsername", axiosResponse.data.username);
                    localStorage.setItem("HiveflixProfilePicture", axiosResponse.data.profilePicture);
                    localStorage.setItem("HiveflixId", axiosResponse.data.id);
                    localStorage.setItem("HiveflixWatched", JSON.stringify(axiosResponse.data.watched || {}));
                    localStorage.setItem("HiveflixMyList", JSON.stringify(axiosResponse.data.myList));
                    localStorage.setItem("HiveflixLanguage", 'en');
                    window.location.replace("http://localhost:3000/home");
                }
                else
                    history.push('/');
                setResponse(axiosResponse);
                console.log(axiosResponse);
                console.log("LOGIN");
            }
            catch(err)
            {
                console.log(err.response);
                alert(err.response.data.message);
                window.location.replace("http://localhost:3000/home");
            }
        }
            
        const registerApi = async (code) => {
            console.log('codeREGISTER', code);
            if (error)
            {
                alert("registeration not allowed");
                window.location.replace("http://localhost:3000/home");
            }
            try
            {
                let axiosResponse = await Axios.post(
                    config.SERVER_URL+'/42/register',
                    {code: code,
                    test: "asd"}
                )
                setResponse(axiosResponse);
                console.log(axiosResponse);
                console.log("REGISTER");
            }
            catch(err)
            {
                console.log(err.response);
                alert(err.response.data.message);
                window.location.replace("http://localhost:3000/home");
            }
            
        }
        
        if (action === 'login')
            loginApi(code);
        else if (action === 'register')
            registerApi(code);

        
    }, [])
    
    const registerSubmit = async (event) => {
        event.preventDefault();

        if (passOne.length > 7 && /\d/.test(passOne) && /[A-Z]+/.test(passOne))
        {
            if (passOne === passTwo )
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
                    localStorage.setItem("HiveflixId", passResponse.data.id);
                    localStorage.setItem("HiveflixMyList", JSON.stringify([]));
                    localStorage.setItem("HiveflixWatched", JSON.stringify({}));
                    localStorage.setItem("HiveflixLanguage", passResponse.data.language);
                    localStorage.setItem("HiveflixMute", passResponse.data.mute);
                    window.location.replace("http://localhost:3000/home");
                }
            }
            else
                setError("Passwords don't match");
        }
        else
            setError("Check the password requirements");
    }

    const setPassOneF = (event) => {
        setPassOne(event.target.value);
        console.log(passOne);
    }

    const setPassTwoF = (event) => {
        setPassTwo(event.target.value);
        console.log(passTwo);
    }

    const inputStyle = {
        maxWidth: '300px'
    };

    return (
        <div style={{padding: '10px'}}>
            
            {response && action == 'register' ? 
            <>
                <h1>Hello {response.data.firstName}!</h1>
                {response.data.usernameTaken === true ? <h4>Your username was taken, so we added some numbers to the end..</h4> : ''}
                <h3>Your username is: {response.data.login}</h3>
                <h4>Set your password:</h4>
                <form onSubmit={registerSubmit}>
                    <input type="password" id="pass1" onChange={setPassOneF} style={inputStyle}/>
                    <input type="password" id="pass2" onChange={setPassTwoF} style={inputStyle}/>
                    <button type="submit">Set password!</button>
                </form>
                {errorPassword && <div className="small alert alert-error">{errorPassword}</div>}
                <div className="small center">
                    Password must be at least 8 characters in length,
                    contain a minimum of one upper case letter [A-Z]
                    and contain a minimum of one number [0-9]
                </div>
            </>
            : response && action == 'login' ? 
            <>
            </>
            : 
            <h1>Loading....</h1> }

          
        </div>
    )
}

export default HiveLog;
