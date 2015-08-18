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

function authGetToken(frob, callback){
	flickr.authGetToken({
		'frob': frob,
		'callback': function(result){
			
			debugger;

			if (!result) return; /* BAG */
			callback(result);
		}
	});
}

function uploadPhoto(){
        var data = new FormData();
        var files = $("#fileUpload").get(0).files;
        if (files.length > 0) {
            data.append("photo", files[0]);
        }
        data.append("title", "title");
        data.append("description", "description");
        data.append("api_key", "3a2429a5539e3b00718f6193b783b2ca");

        $.ajax("https://up.flickr.com/services/upload/", {
            data: data,
            type: "POST",
            processData: false,
            cache: false,
            contentType: false,
            success: function (result) { debugger; },
            error: function () {
                alert("Error!");
            }
        });
        return true;
}

function PhotoGalleryViewModel() {
	var gallery_user_id = "134818206@N02";
	loadPhotosetsList();

	var uploadDialog = initUploadDialog(function() { uploadPhoto(); });
	
	function loadPhotosetsList() {
		flickr.photosetsGetList({
			user_id: gallery_user_id,			
			callback: function(result){
				console.log('== loadPhotosetsList ==');
				console.log(result);

				if (!result) return; /* BAG */
				var photosets = result.photosets.photoset;
				self.photosets(photosets);
			}
		});
	}

	function loadPhotosetPhotos(photoset_id) {
		flickr.photosetsGetPhotos({
			user_id: gallery_user_id,
			photoset_id: photoset_id,
			callback: function(result){
				console.log('== loadPhotosetsPhotos ==');
				console.log(result);
				if (!result) return; /* BAG */

				var photos = result.photoset.photo;
				self.photos(photos);
			}
		});
	}	



	var frob = QueryString.frob;
	authGetToken(frob, function(data) {

		debugger;

		var user = {
			'fullname': data.auth.user.fullname
		};

		self.user(user);	
	});




	var self = this;

	self.user = ko.observable();
	self.photosets = ko.observableArray();
	self.photoset = ko.observable({id:0});
	self.photos = ko.observableArray();
	self.authUrl = 'http://flickr.com/services/auth/?api_key=3a2429a5539e3b00718f6193b783b2ca&perms=delete&api_sig=d0e5bfcf2f23a946e91604634284166b';

	self.viewPhotoset = function(photoset) {
		console.log(photoset);
		self.photoset(photoset);

		loadPhotosetPhotos(photoset.id)
	};
	self.uploadPhoto = function() {
		uploadDialog.dialog('open');
	};
}

var viewModel = new PhotoGalleryViewModel();
ko.applyBindings(viewModel);