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

function initEditDialog(editFunction) {
	var dialog = $("#edit-user-dialog").dialog({
		autoOpen: false,
		height: 400,
		width: 350,
		modal: true,
		buttons: {
			"Save": function(){ 
				editFunction();
				dialog.dialog("close");
			},
			Cancel: function(){
				dialog.dialog("close");
			}
		},
		close: function() {
		}
	});
	return dialog;	
}

function initViewDialog() {
	var dialog = $("#view-user-dialog").dialog({
		autoOpen: false,
		height: 400,
		width: 350,
		modal: true,
		buttons: {
			Cancel: function(){
				dialog.dialog("close");
			}
		},
		close: function() {
		}
	});
	return dialog;
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


var flickr = new Flickr({
	api_key: "3a2429a5539e3b00718f6193b783b2ca",
	secret: "43512cb4f8044f69"
});


function sendPhoto(user, application, callback) {
	var data = new FormData();
	var files = $("#fileUpload").get(0).files;
	if (files.length > 0) {
		data.append("photo", files[0]);
	}
	var tempUrl = 'https://up.flickr.com/services/upload/?' 
	+ 'title=title&description=description'
	+'&api_key=' 
	+ application.api_key 
	+ '&auth_token=' + user.token;

	data.append("title", "title");
	data.append("description", "description");
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
	
	var application = {};
	application.api_key = '3a2429a5539e3b00718f6193b783b2ca';
	application.secret = '43512cb4f8044f69';

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
		sendPhoto(self.user(), application, function(data) {
			var photoId = data.getElementsByTagName('photoid').item(0).textContent;
			console.log('photoId:' + photoId);

			addPhotoToPhotoset(photoId, self.photoset().id, self.user().token, function(data) {
				if (data.stat === "ok")
					self.messageInfo.push('Photo:' + photoId + 'add to photoset:' + self.photoset().id);
			});
		}); 
	});

	var self = this;

	self.user = ko.observable();
	self.photosets = ko.observableArray();
	self.photoset = ko.observable({id:0});
	self.photos = ko.observableArray();
	self.messageInfo = ko.observableArray();
	
	self.authUrl = 'http://flickr.com/services/auth/?api_key=3a2429a5539e3b00718f6193b783b2ca&perms=delete&api_sig=d0e5bfcf2f23a946e91604634284166b';

	self.viewPhotoset = function(photoset) {
		self.photoset(photoset);

		loadPhotosetPhotos(self.user(), photoset.id, function(data) {
			self.photos(data.photoset.photo);
		});
	};
	self.uploadPhoto = function() {
		uploadDialog.dialog('open');
		self.messageInfo.push('This is test message.');
	};
}

var viewModel = new PhotoGalleryViewModel();
ko.applyBindings(viewModel);