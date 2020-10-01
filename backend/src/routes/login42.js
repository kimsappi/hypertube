var createError = require('http-errors');
const express = require('express');
const axios = require('axios');
const router = express.Router();
const codes = require('../config.secret.json');
const User = require('../models/User');
const { updateOne } = require('../models/User');
const { generateJWT } = require('../utils/auth');
const { hashPassword } = require('../utils/auth');
const { NotExtended } = require('http-errors');

router.post('/login', async (req, res, next)  => {

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


        const responseTwo = await axios.get(
            'https://api.intra.42.fr/v2/me',
            {headers: {Authorization: 'Bearer '+token42}}
        )


        var confirm = await User.findOne({
            "oauth.provider": "42", "oauth.email": responseTwo.data.email
        })

        if (confirm !== null)
        {
            token = generateJWT({username: confirm.username, profilePicture: confirm.profilePicture || null, id: confirm._id});
            return res.status(200).json({
                message: 'login success',
                username: confirm.username,
                token,
                profilePicture: confirm.profilePicture || null,
                id: confirm._id,
                watched: confirm.watched,
                myList: confirm.myList,
                language: confirm.language,
                mute: confirm.mute
            });
        }
        else
        {
            const err = new Error("Not registered");
            err.statusMessage = 'You are not registered. Register first via 42.';
            err.status = 300;
            next(err);
        }
    }
    catch(err)
    {
        const nonEmptyCatch = 5 + 5;
        //c.log(err);
    }
})

router.post('/register', async (req, res, next) => {

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


    const responseTwo = await axios.get(
        'https://api.intra.42.fr/v2/me',
        {headers: {Authorization: 'Bearer '+token}}
    )

    if (responseTwo.status == 200)
    {
        
        var name = responseTwo.data.login;

        var email = await User.findOne({
            email: responseTwo.data.email
        })

        if (email !== null)
        {
            next(createError(301, "You have already registered with 42. Use login."));
            throw "email taken";
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
            //c.log(res);
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

        const result = await newUser.save();


        res.json({
            email: responseTwo.data.email,
            firstName: responseTwo.data.first_name,
            login: name,
            usernameTaken: takenValue,
            id: result._id
        })
    }
    else
    {
        next(createError(301, "User not found"));
        throw "user not found";
    }

    }
    catch(err)
    {
        const nonEmptyCatch = 5 + 5;
        //c.log(err);
    }
    

})

router.post('/submitPass', async (req, res) => {


    let response = await User.findOne({
        username: req.body.user
    },
    'password'
    );

    if (response.password === 'tempPass')
    {
        let answer = await User.updateOne({ username: req.body.user}, { $set: { password: await hashPassword(req.body.password) } });


        token = generateJWT({username: req.body.user, profilePicture: null, id: response._id});


        return res.status(200).json({
            message: 'login success',
            username: req.body.user,
            token,
            profilePicture: null,
            id: response._id
          });
    }
    
    res.send('success');
})

module.exports = router;
