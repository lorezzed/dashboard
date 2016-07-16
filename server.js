'use strict';
var webshot = require('webshot')
,   express = require('express')
,   path = require('path')
,   app = express()
// ,   passport = require('passport')
// ,   LocalStrategy = require('passport-local').Strategy
// ,   db = require('./db')
// ,   FacebookStrategy = require('passport-facebook')
// ,   authDetails = require('./authDetails')

// // facebook auth
// passport.use(new FacebookStrategy({
//     clientID: authDetails.facebook.clientID
// ,   clientSecret: authDetails.facebook.clientSecret
// ,   callbackURL: authDetails.facebook.callbackURL
// }, function(accessToken, refreshToken, profile, cb) {
//     User.findOrCreate({facebookId: profile.id }, function (err, user) {
//         return cb(err, user)
//     })
// }))
// app.get('/auth/facebook', passport.authenticate('facebook'))
// app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }),
//     function (req, res) {
//         // success
//         res.redirect('/')
//     }
// )



// passport.use(new LocalStrategy(function(username, password, cb) {
//     db.users.findByUsername(username, function(err, user) {
//         if(err)
//             return cb(err)
//         if(!user)
//             return cb(null, false)
//         if(user.password !== password)
//             return cb(null, false)
//         return cb(null, user)
//     })
// }))
// passport.serializeUser(function(user, cb) {
//     cb(null, user.id)
// })
// passport.deserializeUser(function(id, cb) {
//     db.users.findById(id, function(err, user) {
//         if(err)
//             return cb(err)
//         cb(null, user)
//     })
// })


// app.set('views', __dirname + '/views')
// app.set('view engine', 'ejs')

// app.use(require('morgan')('combined'))
// app.use(require('cookie-parser')())
// app.use(require('body-parser').urlencoded({extended:true}))
// app.use(require('express-session')({secret: 'keyboard cat', resave: false, saveUnitialized: false}))


// app.use(passport.initialize())
// app.use(passport.session())

// app.get('/home', function(req, res) {
//     res.render('home', { user: req.user })
// })
// app.get('/login', function(req, res) {
//     res.render('login')
// })
// app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), function(req, res) {
//     res.redirect('/')
// })
// app.get('/logout', function(req, res) {
//     req.logout()
//     res.redirect('/home')
// })
// app.get('/profile', require('connect-ensure-login').ensureLoggedIn(), function(req, res) {
//     res.render('profile', {user:req.user})
// })






const _request = require('request')

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });


app.get('/test/:url', function (reply, response) {
    // const url = 'http://www.google.com'
    const url = reply.params.url
    
    _request(url, function(err, response) {
        console.log('looking up:', url)
        let isBlocked = 'No'
        console.log('error!', err)
        // if the page was found
        if (!err && response.statusCode === 200) {
            // grab the headers
            const headers = response.headers
            // grab the x-frame-options header if it exists
            let xFrameOptions = headers['x-frame-options'] || ''
            // normalize the header to lowercase
            xFrameOptions = xFrameOptions.toLowerCase()
            // check if it's set to a blocking options
            if(xFrameOptions === 'sameorigin' || xFrameOptions === 'deny') {
                isBlocked = 'Yes'
            }
        }
        // print the result
        console.log(isBlocked + ', this page is blocked')
    })
})

//
app.use(express.static(path.join(__dirname)))

app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/search/:url', function (request, response) {
    var url = request.params.url
    ,   shotHeight = request.query.shotHeight || 'window'
    // var url = encodeURIComponent(request.params.url)
    // ,   shotHeight = encodeURIComponent(request.query.shotHeight || 'window')
    ,   options = {
            windowSize: { width: 1024, height: 768 }
        ,   shotSize: { width: 'all', height: shotHeight }
        ,   customCSS: 'body { background-color:#dedede; }'
    }
    ,   renderStream = webshot(url, null, options)
    ,   screenshot = ''

    renderStream.on('data', function (data) {
        screenshot += data.toString('binary')
    })

    renderStream.on('end', function () {
        console.log('served ' + url)
        response.set('Content-Type', 'image/png')
        response.end(screenshot, 'binary')
    })
})

app.listen(3321)