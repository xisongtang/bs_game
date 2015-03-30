function parseCookies (cookie) {
    var list = {},
        rc = cookie;

    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}

if (typeof exports === 'undefined'){
	this.address = '127.0.0.1';
	this.port = 8083;
	this.parseCookies = parseCookies;
} else {
	exports.port = 8083;
	exports.address = '127.0.0.1';	
	exports.parseCookies = parseCookies;
}