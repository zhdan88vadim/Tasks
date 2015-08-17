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
		//form[0].reset();
		//allFields.removeClass( "ui-state-error" );
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
	api_key: "xxx"
});

function uploadPhoto(){
        var data = new FormData();
        var files = $("#fileUpload").get(0).files;
        if (files.length > 0) {
            data.append("uploadFile", files[0]);
        }
        data.append("ID", user.id);
        data.append("Name", user.name);
        data.append("Email", user.email);
        data.append("Phone", user.phone);
        data.append("Password", user.password);

        $.ajax("/api/user/" + user.id, {
            data: data,
            type: "POST",
            processData: false,
            cache: false,
            contentType: false,
            success: function (result) { callback(); },
            error: function () {
                alert("Error!");
            }
        });
        return true;
}

function PhotoGalleryViewModel() {
	var gallery_user_id = "xxx";
	loadPhotosetsList();

	var uploadDialog = initUploadDialog();
	
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

	var self = this;
	self.photosets = ko.observableArray();
	self.photoset = ko.observable({id:0});
	self.photos = ko.observableArray();

	self.viewPhotoset = function(photoset) {
		console.log(photoset);
		self.photoset(photoset);

		loadPhotosetPhotos(photoset.id)
	};
	self.uploadPhoto = function() {
		uploadDialog.dialog('open');
	};

}

ko.applyBindings(new PhotoGalleryViewModel());
