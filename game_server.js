var http = require('http'), fs = require('fs'), md5 = require('MD5'), 
	webSocketServer = require('websocket').server, header = require('./header.js');
var first = true;
var clients = [];

var server = http.createServer(function(req, res){
}).listen(header.port, header.address, function(){
	console.log('Game server running at http://' + header.address + ':' + header.port + '/');
});

var wsserver = new webSocketServer({
	httpServer:server
});
var umap = {}, pmap = {};
wsserver.on('request', function(request){
	user = md5(String(Date.now ? Date.now() : (new Date().getTime())));
	var ret = {'from':'server', 'content':user};
	var connection = request.accept(null, request.origin);
	connection.sendUTF(JSON.stringify(ret));
	umap[user] = connection;
	if (clients.length > 0){
		pmap[user] = clients.shift();
		pmap[pmap[user]] = user;
	}
	else
		clients.push(user);
	console.log('clients queue:', clients);
	console.log('pmap:', pmap);
	connection.on('message', function(message){
		var data = JSON.parse(message.utf8Data);
		if (pmap[data.user] === undefined)
			console.log('unpaired', data);
		else{
			console.log('paired', data);
			umap[pmap[data.user]].sendUTF(data.content);
		}
	});
	connection.on('close', function(connection){
		var left = pmap[user];
		if (left === undefined)
			clients.shift();
		else{
			clients.push(left);
			delete pmap[user];
			delete pmap[left];
		}
		delete umap[user];
		console.log(user, 'close');
	});
});
