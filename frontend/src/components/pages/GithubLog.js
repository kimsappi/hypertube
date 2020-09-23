import React, { useState, useEffect} from "react";
import Axios from "axios";
import config from '../../config/config';
import { useParams } from 'react-router-dom';


const GithubLog = () => {

    const { action } = useParams();
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get('code');

    const [response, setResponse] = useState();
    const [passOne, setPassOne] = useState('');
    const [passTwo, setPassTwo] = useState('');

    console.log(code);
    console.log("githublog")


    useEffect(() => {
    

    const githubReg = async (code) => {
        console.log(code);
        try{
        const response = await Axios.post(
            config.SERVER_URL+'/github/register',
            {code}
        )
        console.log(response);
        setResponse(response);
        }
        catch(err)
        {
            console.log(err.response);
            alert(err.response.data.message);
            window.location.replace("http://localhost:3000/home");
        }
        
        }

    const githubLog = async () => {

        console.log('logging');
        try
        {
            const loginResponse = await Axios.post(
                config.SERVER_URL+'/github/login',
                {code}
            )
            console.log(loginResponse);
            if (loginResponse.status === 200)
            {
                localStorage.setItem("HiveflixToken", loginResponse.data.token);
                localStorage.setItem("HiveflixUsername", loginResponse.data.username);
                localStorage.setItem("HiveflixProfilePicture", loginResponse.data.profilePicture);
                localStorage.setItem("HiveflixId", loginResponse.data.id);
                localStorage.setItem("HiveflixWatched", JSON.stringify(loginResponse.data.watched));
                localStorage.setItem("HiveflixMyList", JSON.stringify(loginResponse.data.myList));
                window.location.replace("http://localhost:3000/home");
            }
        }
        catch(err)
        {
            console.log(err.response);
            alert(err.response.data.message);
            //window.location.replace("http://localhost:3000/home");
        }

            
    }

 
    

    if (action === 'register')
    {
    
        githubReg(code)
   
}
    else if (action === 'login')
        githubLog()


    }, [action, code])


    
    const setPassOneF = (event) => {
        setPassOne(event.target.value);
        console.log(passOne);
    }

    const setPassTwoF = (event) => {
        setPassTwo(event.target.value);
        console.log(passTwo);
    }
    
    const registerSubmit = async (event) => {
        event.preventDefault();
        console.log("SUBMIT");

        if (passOne === passTwo)
        {
            const responseFinal = await Axios.post(
                config.SERVER_URL+'/github/setPass',
                {username: response.data.username,
                    password: passOne}
            )
        
        if (responseFinal.status === 200)
        {
            localStorage.setItem("HiveflixToken", responseFinal.data.token);
            localStorage.setItem("HiveflixUsername", responseFinal.data.username);
            localStorage.setItem("HiveflixProfilePicture", responseFinal.data.profilePicture);
            localStorage.setItem("HiveflixId", responseFinal.data.id);
            window.location.replace("http://localhost:3000/home");
        }
        else
            window.location.replace("http://localhost:3000/home");

        console.log(responseFinal);
        }
        else
            console.log("Passwords dont match");
    }

    return(
        <>
            {response && action == 'register' ? 
            <>
                <h1>Hello {response.data.firstName}!</h1>
                {response.data.usernameTaken == true ? <h4>Your username was taken, so we added some numbers to the end..</h4> : ''}
                <h3>Your username is: {response.data.username}</h3>
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

export default GithubLog;
