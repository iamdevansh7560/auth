const express = require("express");
const session = require("express-session")
const passport = require('passport')
const axios = require('axios')
const OAuth2Strategy = require('passport-oauth2').Strategy
const cors = require('cors')


let dataa
let id = []

const app = express();

app.use(
    cors({
        origin: "*"
    })
)
app.use(session({
    secret: "catsdog",
}));
app.use(passport.initialize());
app.use(passport.session())


const PORT = process.env.PORT || 8000;

const cl_id = '3MVG9wt4IL4O5wvIoK56B_Plb1H2yUuJcNJqra.70m1W0dSJhT9pbdPtNojU50LQ6O5xCpSipUoaySXohJtlJ'
const cl_secret = 'E97AF6DD73A145192A0582D98B3776BFBB02C1B9F12C89126C3100BE07A123F2'
var acess_token

passport.use(new OAuth2Strategy({
    authorizationURL: 'https://login.salesforce.com/services/oauth2/authorize',
    tokenURL: 'https://login.salesforce.com/services/oauth2/token',
    clientID: cl_id,
    clientSecret: cl_secret,
    callbackURL: 'http://localhost:8000/auth/example/callback'
},
    function (accessToken, refreshToken, profile, cb) {
        acess_token = accessToken
        return cb(null, profile)
    }
));

passport.serializeUser(function (user, done) {
    done(null, user)
})

passport.deserializeUser(function (user, done) {
    done(null, user)
})

app.get('/auth/example',
    passport.authenticate('oauth2', { scope: ['full'] }));


app.get('/auth/example/callback',
    passport.authenticate('oauth2', {   
        failureRedirect: "'http://localhost:3000/",
        // successRedirect: 'http://localhost:3000/Home',

    }),
    async function (req, res) {
        console.log(acess_token);

        res.cookie('auth_token', acess_token, { expires: new Date(Date.now() + 1000 * 60 * 60) })
        res.redirect('http://localhost:3000/Home')

    }
);


app.get('/data',
    // passport.authenticate('oauth2', { failureMessage: "eroor" }),
    async function data(req, res) {
        try {
            console.log(acess_token);
            let response = await axios({
                url: 'https://cloudanalogy-2c5-dev-ed.my.salesforce.com/services/data/v55.0/sobjects/Lead',
                method: "get",
                headers: { 'Authorization': 'Bearer ' + acess_token }
            })

            dataa = await response.data
            user = dataa.recentItems
            
            user.map(async (user_id) => {
                return await axios({
                    url: `https://cloudanalogy-2c5-dev-ed.my.salesforce.com/services/data/v55.0/sobjects/Lead/${user_id.Id}`,
                    method: "get",
                    headers: { 'Authorization': 'Bearer ' + acess_token }
                }).then((res) => {
                    const data = res.data
                    const found = id.some(el => el.Id === data.Id)
                    if (!found) id.push(data)

                    return res.data
                })


            })
            res.status(200).json(id);




            // url = data.recentItems

            // url.map(async (row) => {
            //     return await axios.get(`https://cloudanalogy-2c5-dev-ed.my.salesforce.com/services/data/v55.0/sobjects/Lead/00Q5i00000AJcbYEAT`)
            //         .then((res) => {
            //             id.push(res.data)
            //             return (res.data)

            //         })
            //         .catch(err => {
            //             console.log(err);
            //             return err
            //         })

            // });
            // 
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ message: err });
        }
    })




app.listen(PORT, () => {
    console.log(`listening to port : http://localhost:${PORT}/`)
})

module.exports = app
