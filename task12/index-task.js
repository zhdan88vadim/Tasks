app = {};
app.api_key = '3a2429a5539e3b00718f6193b783b2ca';
app.secret = '43512cb4f8044f69';

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

var QueryString = function () {
	var query = window.location.search.substring(1);
	return parseQueryParametrs(query);
}();

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

function initUploadDialog(callback){
	var dialog = $("#upload-dialog").dialog({
		resizable: false,
		autoOpen: false,
		height:400,
		widht: 250,
		modal: true,
		buttons: {
			"Upload": function() {
				callback();
				$(this).dialog("close");
			},
			Cancel: function() {
				$(this).dialog("close");
			}
		}
	});
	return dialog;
}

function sendPhoto(user, photoInfo, application, callback) {
	var data = new FormData();
	var files = $("#fileUpload").get(0).files;
	if (files.length > 0) {
		data.append("photo", files[0]);
	}
	var tempUrl = 'https://up.flickr.com/services/upload/?' 
	+ 'title=' + photoInfo.title
	+ '&description=' + photoInfo.description
	+ '&api_key=' + application.api_key 
	+ '&auth_token=' + user.token;

	data.append("title", photoInfo.title);
	data.append("description", photoInfo.description);
	data.append("api_key", application.api_key);
	data.append("auth_token", user.token);
	data.append("api_sig", generateUrlSign(application.secret, tempUrl));

	$.ajax("https://up.flickr.com/services/upload/", {
		data: data,
		type: "POST",
		processData: false,
		cache: false,
		contentType: false,
		success: function (result) { 
			callback(result);
		},
		error: function () {
			alert("Error!");
		}
	});
	return true;
}

var flickr = new Flickr({
	api_key: app.api_key,
	secret: app.secret
});

function authGetToken(callback) {
	flickr.authGetToken({
		'frob': QueryString.frob,
		'callback': function(result){
			if (result.stat !== "ok") return;
			callback(result);
		}
	});
}

function loadPhotosetsList(user, callback) {
	flickr.photosetsGetList({
		user_id: user.nsid,			
		callback: function(result){
			if(!result) return; /* WHY ?? */
			if (result.stat !== "ok") return;			
			callback(result);
		}
	});
}

function loadPhotosetPhotos(user, photoset_id, callback) {
	flickr.photosetsGetPhotos({
		user_id: user.nsid,
		photoset_id: photoset_id,
		callback: function(result){
			if (!result) return; /* BAG */
			callback(result);
		}
	});
}

function addPhotoToPhotoset(photo_id, photoset_id, auth_token, callback) {
	flickr.addPhotoToPhotosets({
		photo_id:photo_id,
		photoset_id: photoset_id,
		auth_token: auth_token,
		callback: function(result){
			if (!result) return; /* BAG */
			callback(result);
		}
	});	
}

function PhotoGalleryViewModel() {
	var self = this;

	authGetToken(function(data) {
		console.log(data);
		var user = {
			'fullname': data.auth.user.fullname,
			'token': data.auth.token._content,
			'nsid': data.auth.user.nsid
		};
		self.user(user);

		loadPhotosetsList(self.user(), function(data) {
			self.photosets(data.photosets.photoset);
		});	
	});	

	var uploadDialog = initUploadDialog(function() { 
		sendPhoto(self.user(), self.uploadPhotoInfo(), app, function(data) {
			var photoId = data.getElementsByTagName('photoid').item(0).textContent;
			console.log('photoId:' + photoId);

			addPhotoToPhotoset(photoId, self.photoset().id, self.user().token, function(data) {
				if (data.stat === "ok")
					self.messageInfo.push('Photo:' + photoId + 'add to photoset:' + self.photoset().id);
			});
		}); 
	});

	self.user = ko.observable();
	self.photosets = ko.observableArray();
	self.photoset = ko.observable({id:0}); // Set default value for photoset.
	self.photos = ko.observableArray();
	self.messageInfo = ko.observableArray();
	self.uploadPhotoInfo = ko.observable();

	var authUrl = 'http://flickr.com/services/auth/?';
	authUrl += 'api_key=' + app.api_key;
	authUrl += '&perms=' + 'delete';
	self.authUrl =  authUrl + '&api_sig=' + generateUrlSign(app.secret, authUrl);

	self.viewPhotoset = function(photoset) {
		self.photoset(photoset);

		loadPhotosetPhotos(self.user(), photoset.id, function(data) {
			self.photos(data.photoset.photo);
		});
	};
	self.uploadPhoto = function() {
		uploadPhotoInfoSetDefault(); // Once at the opening.
		uploadDialog.dialog('open');
		self.messageInfo.push('This is test message.');
	};

	function uploadPhotoInfoSetDefault(){
		self.uploadPhotoInfo({title:'Photo title', description: 'Photo description'});	
	}
}

var viewModel = new PhotoGalleryViewModel();
ko.applyBindings(viewModel);