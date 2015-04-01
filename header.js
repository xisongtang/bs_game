/*function parseCookies (cookie) {
    var list = {},
        rc = cookie;

    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}
*/
if (typeof exports === 'undefined'){
	this.address = 'game.raytang.me';
	this.port = 8083;
} else {
	exports.port = 8083;
	exports.address = '45.55.134.129';
}
