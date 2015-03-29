var http = require('http');
var fs = require('fs');
http.createServer(function(req, res){
	res.writeHead(200, {'Content-Type':'text/html'});
	res.end('Hello World\n');
}).listen(8080, '10.132.64.248');
console.log('Game server running at http://APP_PRIVATE_IP_ADDRESS:8083/');
