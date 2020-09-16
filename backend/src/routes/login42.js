const express = require('express');
const axios = require('axios');
const router = express.Router();
const codes = require('../config.secret.json');

router.post('/login', async (req, res)  => {

    console.log(req.body.code);
    console.log(codes.CLIENTID);

    try
    {
    const response = await axios.post(
        'https://api.intra.42.fr/oauth/token',
        {
            grant_type: 'authorization_code',
            client_id: codes.CLIENTID,
            client_secret: codes.SECRET,
            code: req.body.code,
            redirect_uri: codes.logUrl
        }
    )
    

    const token = response.data.access_token;
    console.log(token);

    const responseTwo = await axios.get(
        'https://api.intra.42.fr/v2/me',
        {headers: {Authorization: 'Bearer '+token}}
    )
    console.log(responseTwo);

    res.send("logging in from 42");
    }
    catch(err)
    {
        console.log(err);
    }
})

router.post('/register', async (req, res) => {
    console.log("OUJEE REGISTER");
    try
    {
    const response = await axios.post(
        'https://api.intra.42.fr/oauth/token',
        {
            grant_type: 'authorization_code',
            client_id: codes.CLIENTID,
            client_secret: codes.SECRET,
            code: req.body.code,
            redirect_uri: codes.regUrl
        }
    )
    

    const token = response.data.access_token;
    console.log(token);

    const responseTwo = await axios.get(
        'https://api.intra.42.fr/v2/me',
        {headers: {Authorization: 'Bearer '+token}}
    )
    console.log(responseTwo);

    res.send("registering from 42");
    }
    catch(err)
    {
        console.log(err);
    }

})

module.exports = router;