const express = require('express')
const app = express()
const bodyparser = require('body-parser')

app.use(bodyParser.json())

app.get('/iwantdata', function(req, res){
    res.json({'key': 'value'})
})

app.post('/iwantdata', function(req, res){
    console.log(req.body)
    res.end()
})

app.listen(3000, function(){
    console.log("server started up on port 3000")
})

/////
//////below is the hexpress shit
const hexpress = require('./hexpress')
const app = hexpress()
const server = requires('http')
app.listen(3000)
/////above is app, below is server
const http = request('http')
module.exports = function() {
    return {
        listen: function(port, callback){
            const server = http.createServer(function(request, response){
                //request.url
                //request.method
                console.log(request)
            })
        }
        server.listen(port, function(){
            if(callback){
                callback()
            }
        })
    }
}
