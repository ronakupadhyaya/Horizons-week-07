const http = require('http')

module.exports = function () {
    return {
        listen: function(port, callback) {
            // A server receives requests and sends back response. The following creates our server. We are deciding what to do with requests and responses, right? 
            const server = http.createServer(function(request, response) {
                //request.url
                //request.method

                //response.writeHead(statusCode, [headerObj])
                //response.end([body])
                response.writeHead(200, {'Content-Type': 'application/json'})
                response.end(JSON.stringify({key: 'value'}))
                // The reponse must be a string!
                
            })

            //The following is built-in to the Node, http thingy. Listen below is not related to the listen key we are defining 
            server.listen(port, function() {
                if (callback) {
                    callback()
                }
            })
            
            // startup an http server
            // listen on the port specified 
            // executed the callback provided 
            // once the server has been started 
        }
    }
}
