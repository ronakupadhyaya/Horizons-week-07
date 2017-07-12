const express = require('express')
const app = express()

app.get('/routename/:parameter1', function(req, res) {
    // use req.params to get the value of the parameter value 
    console.log('doing something here...')
})


app.listen(3000, function () {
    console.log('Server started up on port 3000')
})
