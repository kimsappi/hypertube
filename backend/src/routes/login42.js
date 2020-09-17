const express = require('express');
const axios = require('axios');
const router = express.Router();
const codes = require('../config.secret.json');
const User = require('../models/User');
const { updateOne } = require('../models/User');
const { generateJWT } = require('../utils/auth');
const { hashPassword } = require('../utils/auth');

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
    

    const token42 = response.data.access_token;
    console.log(token42);

    const responseTwo = await axios.get(
        'https://api.intra.42.fr/v2/me',
        {headers: {Authorization: 'Bearer '+token42}}
    )
    console.log(responseTwo);

    var confirm = await User.findOne({
        "oauth.provider": "42", "oauth.email": responseTwo.data.email
    })
    console.log(confirm);
    if (confirm !== null)
    {
        token = generateJWT({username: confirm.username, profilePicture: confirm.profilePicture || null, id: confirm._id});
        return res.status(200).json({
            message: 'login success',
            username: confirm.username,
            token,
            profilePicture: confirm.profilePicture || null
          });
    }
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



    if (responseTwo.status == 200)
    {
        
        var name = responseTwo.data.login;

        var email = await User.findOne({
            email: responseTwo.data.email
        })

        if (email !== null)
        {
            res.send("Email used");
            return;
        }

        var usernameTaken = true;
        var takenValue = false;
        var postfix = 0;
        while(usernameTaken == true)
        {
            let res = await User.findOne({
                username: name
            },
            'username'
            );
            console.log(res);
            if (res === null)
                usernameTaken = false;
            else
            {
                postfix++;
                name = name + postfix;
                takenValue = true
            }
        }

        const newUser = new User({
            username: name,
            firstName: responseTwo.data.first_name,
            lastName: responseTwo.data.last_name,
            password: "tempPass",
            email: responseTwo.data.email,
            oauth: {
                provider: '42',
                email: responseTwo.data.email
            }

        });
        console.log('test22');
        const result = await newUser.save();
        console.log(result);
        
        console.log(responseTwo.data.email);
        console.log(responseTwo.data.first_name);
        console.log(name);

        res.json({
            email: responseTwo.data.email,
            firstName: responseTwo.data.first_name,
            login: name,
            usernameTaken: takenValue
        })
    }
    else
        console.log("STATUS NOT 200");



    }
    catch(err)
    {
        console.log(err);
        console.log("ERROR!");
    }
    

})

router.post('/submitPass', async (req, res) => {
    console.log(req.body);

    let response = await User.findOne({
        username: req.body.user
    },
    'password'
    );
    console.log(response);
    if (response.password === 'tempPass')
    {
        let answer = await User.updateOne({ username: req.body.user}, { $set: { password: await hashPassword(req.body.password) } });
        console.log(answer);

        token = generateJWT({username: req.body.user, profilePicture: null, id: response._id});


        return res.status(200).json({
            message: 'login success',
            username: req.body.user,
            token,
            profilePicture: null
          });
    }
    
    res.send('success');
})

module.exports = router;
