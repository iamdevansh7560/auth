const OAuth2Strategy = require('passport-oauth2').Strategy
const passport = require('passport')


const cl_id = '3MVG9wt4IL4O5wvIoK56B_Plb1H2yUuJcNJqra.70m1W0dSJhT9pbdPtNojU50LQ6O5xCpSipUoaySXohJtlJ'
const cl_secret = 'E97AF6DD73A145192A0582D98B3776BFBB02C1B9F12C89126C3100BE07A123F2'
// var acess_token

passport.use(new OAuth2Strategy({
    authorizationURL: 'https://login.salesforce.com/services/oauth2/authorize',
    tokenURL: 'https://login.salesforce.com/services/oauth2/token',
    clientID: cl_id,
    clientSecret: cl_secret,
    callbackURL: 'http://localhost:8000/auth/example/callback'
},
    function (accessToken, refreshToken, profile, cb) {
        // acess_token = accessToken
        return cb(null, profile)
    }
));

passport.serializeUser(function (user, done) {
    done(null, user)
})

passport.deserializeUser(function (user, done) {
    done(null, user)
})
