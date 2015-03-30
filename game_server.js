var http = require('http'), fs = require('fs'), md5 = require('MD5'), 
	webSocketServer = require('websocket').server, header = require('./header.js');
var first = true;
var clients = [];

var server = http.createServer(function(req, res){
	//console.log(req.url);

	var des = './' + req.url.substr(1);
	if (des === './')
		des = './game.html';
	fs.readFile(des, 'utf-8', function (err, str) {
		if (err){
			return;
		}
		var cookies = header.parseCookies(req.headers.cookie);

		var resobj = {
			'Content-Type':'text/html',
		};
		if (cookies['bs_client'] === undefined)
		{
			var exp = new Date(); 
			exp.setTime(exp.getTime() + 5 * 60 * 1000);
			console.log(String.valueOf(Date.now ? Date.now() : (new Date().getTime())));
			resobj['Set-Cookie'] = 'bs_client=' + md5(String(Date.now ? Date.now() : (new Date().getTime()))) + ';expires=' + exp.toGMTString();
		}
		
		res.writeHead(200, resobj);
		res.write(str);
		res.end();
	});
}).listen(header.port, header.address, function(){
	console.log('Game server running at http://' + header.address + ':' + header.port + '/');
});

var wsserver = new webSocketServer({
	httpServer:server
});
var umap = {}, pmap = {};
wsserver.on('request', function(request){
	var cookies = header.parseCookies(request.httpRequest.headers.cookie), user = cookies['bs_client'];
	if (umap[user] !== undefined){
		console.log('existed');
		request.reject();
		return void 0;
	}
	var connection = request.accept(null, request.origin);
	console.log(clients, pmap);
	umap[user] = connection;
	if (clients.length > 0){
		pmap[user] = clients.shift();
		pmap[pmap[user]] = user;
	}
	else
		clients.push(user);
	console.log(clients, pmap);
	connection.on('message', function(message){
		var data = JSON.parse(message.utf8Data);
		if (pmap[data.user] === undefined)
			console.log('unpaired');
		else{
			console.log('paired');
			umap[pmap[data.user]].sendUTF(data.content);
		}
	});
	connection.on('close', function(connection){
		var left = pmap[user];
		if (left === undefined)
			clients.shift();
		else{
			pmap[left] = undefined;
			clients.push(left);
			delete pmap[left];
			delete umap[user];
		}
	});
	//connection.sendUTF('I\'ve received you request' + cookies['bs_client']);
});