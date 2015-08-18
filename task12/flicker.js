/**
 * Flickr API
 * Based on the work of Ryan Heath (http://rpheath.com)
 * ----------------------------------------------------
 */

(function(window){
	"use strict";

	function generateUrlSign(url){
		var query = url.substring(url.lastIndexOf("?") + 1);
		var obj = parseQueryParametrs(query);
		var sortKey = Object.keys(obj).sort();
		var tempStr = '';

		for (var i = 0, len = sortKey.length; i < len; i++) {
			tempStr = tempStr + sortKey[i] + obj[sortKey[i]];
		}
		return url + '&api_sig=' + md5(this.secret + tempStr);
	}

	function Initclass(j){
		if(typeof j !== 'object'){
			throw new Error('j was expected to be an object, '+(typeof j+' was received.'));
		}

		var data = (j.data !== undefined) ? j.data : {};
		var defaults = (j.defaults !== undefined) ? j.defaults : {};
		var synonyms = (j.synonyms !== undefined) ? j.synonyms : {};

		for(var k in synonyms){
			if(data[k] !== undefined){
				data[ synonyms[k] ] = data[k];
			}
		}

		var types = {};
		for (var llave in defaults){
			types[llave] = typeof defaults[llave];
		}

		for(var key in defaults){
			data[key] = (typeof data[key] === 'undefined') ? defaults[key] : data[key];
		}

		for(var key in data){
			var t = typeof data[key];
			if(t !== types[key] && types[k] !== undefined){
				throw new Error ('Error : '+key+' was expected to be '+types[key]+', but was received: '+t);
			}else{
				this[key] = data[key];
			}
		}
	}

	var Flickr = function(j){
		var defaults = {
			api_key: 'YOUR API KEY',
			secret: 'YOUR SECRET CODE',
			thumbnail_size: 'sq',
			element: {}, // this must be a valid DOM object
			callback: function(){}
		}

		var js = {data:j, defaults:defaults};
		Initclass.call(this, js);
	}

	Flickr.prototype.build_url = function(method, params) {
		var params_t = '';
		if(Object.keys(params).length > 0){
			params_t = '&' + $.param(params);
		}
		return 'https://api.flickr.com/services/rest/?method=' + method + '&format=json' + '&api_key=' + this.api_key + params_t + '&jsoncallback=?';
	};

	Flickr.prototype.translate = function(size) {
		switch(size){
			case 'sq' : return '_s'; // squre
			case 't'  : return '_t'; // thumbnail
			case 's'  : return '_m'; // small
			case 'm'  : return   ''; // medium
			case 'b'  : return '_b'; // big
			default   : return   '';
		}
	};

	Flickr.prototype.linkTag = function(j) {
		if (j.href === undefined){
			j.href = ['http://www.flickr.com/photos', j.owner, j.id].join('/')
		}

		var a = document.createElement('a');
		a.href = j.href;
		a.title = j.title;
		return a;
	};

	Flickr.prototype.thumbnail_src = function(j, options) {
		j.size = this.translate(options.thumbnail_size);
		return 'http://farm' + j.farm + '.static.flickr.com/' + j.server + '/' + j.id + '_' + j.secret + j.size + '.jpg';
	};

	Flickr.prototype.translate_set = function(set, params) {
		var keys_src = ['farm', 'secret', 'id', 'size', 'title', 'id', 'owner', 'server'];
		var js = {};
		for(var j = 0, len2 = keys_src.length; j < len2; j++){
			var k = keys_src[j];
			var real_key = params[k];
			js[k] = set[real_key];
		}

		return js;
	};

	Flickr.prototype.preProcess = function(photos, options) {
		var params = {
			farm: 'farm',
			secret: 'secret',
			id: 'id',
			size: 'size',
			title: 'title',
			owner: 'owner',
			server: 'server'
		};

		var elm = this.process(photos, params, options);
	};

	Flickr.prototype.process = function(sets, params, options) {
		this.thumbnails = [];
		var list = document.createElement('ul');

		this.images = [];
		this.list_elements = [];

		for(var i = 0, len = sets.length; i < len; i ++){
			var set = sets[i];

			set.owner = options.user_id;
			set.size = this.thumbnail_size;

			var img = document.createElement('img');
			var trans = this.translate_set(set, params);
			img.src = this.thumbnail_src(trans, options);
			img.title = trans.title;
			img.alt = trans.title;
			img._set = set;
			this.images.push(img);

			trans.href = '';
			var li = document.createElement('li');
			var a = this.linkTag(trans);
			a.appendChild(img);
			li.appendChild(a);
			this.list_elements.push(li);
			list.appendChild(li);
		}

		this.list = list;

		return this.callback(this);
	};

	Flickr.prototype.request = function(method, options, callback) {
		var url = this.build_url(method, options);
		$.getJSON(url, function(data) {
			callback(data);
		});
	};
	Flickr.prototype.requestUrl = function(url, callback) {
		$.getJSON(url, function(data) {
			debugger;

			callback(data);
		});
	};
	Flickr.prototype.append = function() {
		this.element.appendChild(this.list);
	};

	Flickr.prototype.favorites = function(method, options) {
		var t = this;
		this.request(method, options, function(data){
			var favorites = data.photos.photo;
			t.preProcess(favorites, options);
		});
	};

	Flickr.prototype.photos = function(method, options) {
		var t = this;
		this.request(method, options, function(data){

		options.callback(data);		
		
		// var photos = (data.photos === undefined ? data.photoset.photo : data.photos);
		// t.preProcess(photos, options);
		});
	};

	Flickr.prototype.photosets = function(method, options) {
		var t = this;
		this.request(method, options, function(data){
			
			options.callback(data);

			//var photosets = data.photosets.photoset;
			//t.preProcess(photosets, options);
		});
	};
	Flickr.prototype.authGetToken = function(options) {
		var method = 'flickr.auth.getToken';
		
		var url ='https://api.flickr.com/services/rest/?method=' + method + '&format=json' + '&api_key=' 
		+ this.api_key + '&frob=' + options.frob;

		var signUrl = generateUrlSign.call(this, url);

		this.requestUrl(signUrl, function(data){
			options.callback(data);
		});
	}
	// http://www.flickr.com/services/api/flickr.photos.getRecent.html
	Flickr.prototype.photosGetRecent = function(options) {
		this.photos('flickr.photos.getRecent', options);
	};

	// http://www.flickr.com/services/api/flickr.photos.getContactsPublicPhotos.html
	Flickr.prototype.photosGetContactsPublicPhotos = function(options) {
		this.photos('flickr.photos.getContactsPublicPhotos', options);
	};

	// http://www.flickr.com/services/api/flickr.photos.search.html
	Flickr.prototype.photosSearch = function(options) {
		this.photos('flickr.photos.search', options);
	};

	// http://www.flickr.com/services/api/flickr.photos.getInfo.html
	Flickr.prototype.photosGetInfo = function(options) {
		this.photos('flickr.photos.getInfo', options);
	};

	// http://www.flickr.com/services/api/flickr.photosets.getPhotos.html
	Flickr.prototype.photosetsGetPhotos = function(options) {
		this.photos('flickr.photosets.getPhotos', options);
	};

	Flickr.prototype.photosetsGetList = function(options) {
		this.photosets('flickr.photosets.getList', options);
	};

	// http://www.flickr.com/services/api/flickr.favorites.getPublicList.html
	Flickr.prototype.favoritesGetPublicList = function(options) {
		this.favorites('flickr.favorites.getPublicList', options);
	};

	window.Flickr = function(j){
		return new Flickr(j);
	}
})(window);
