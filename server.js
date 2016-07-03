'use strict';
var webshot = require('webshot')
,   express = require('express')
,   path = require('path')
,   app = express()

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