
function parseQueryParametrs(query) {
	var query_string = {};
	//var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i=0;i<vars.length;i++) {
		var pair = vars[i].split("=");
				// If first entry with this name
				if (typeof query_string[pair[0]] === "undefined") {
					query_string[pair[0]] = decodeURIComponent(pair[1]);
				// If second entry with this name
		} else if (typeof query_string[pair[0]] === "string") {
			var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
			query_string[pair[0]] = arr;
				// If third or later entry with this name
		} else {
			query_string[pair[0]].push(decodeURIComponent(pair[1]));
		}
}
return query_string;
}

// var QueryString = function () {
// 	var query = window.location.search.substring(1);
// 	return parseQueryParametrs(query);
// }();

function generateUrlSign(secret, url){
	var query = url.substring(url.indexOf("?") + 1);
	var obj = parseQueryParametrs(query);
	var sortKey = Object.keys(obj).sort();
	var tempStr = '';

	for (var i = 0, len = sortKey.length; i < len; i++) {
		tempStr = tempStr + sortKey[i] + obj[sortKey[i]];
	}
	return md5(secret + tempStr);
}