'user strict';

var flickrControllers = angular.module('flickrControllers', []);



/* Controller - GalleryListCtrl */

flickrControllers.controller('GalleryListCtrl', 
	['$scope', '$q', '$authService', '$location', '$galleryService', '$queryService', 'dialogService', 
	galleryListCtrl]);


function galleryListCtrl ($scope, $q, $authService, $location, $galleryService, $queryService, dialogService) {

	function loadPhotosetsList(nsid) {
		var promiseLoadList = $galleryService.loadPhotosetsList(nsid);
		promiseLoadList.then(function(data) {
			$scope.photosets = data.photosets.photoset;
		});
	}

	function loadPhotosetPhotos(nsid, id) {
		var promiseloadPhotos = $galleryService.loadPhotosetPhotos(nsid, id);
		promiseloadPhotos.then(function(data) {
			$scope.photos = data.photoset.photo;
		});
	}

	function addPhoto(photoId) {
		var promiseAddPhotoToPhotoset = $galleryService.addPhotoToPhotoset(photoId, $scope.curPhotosetId);
		promiseAddPhotoToPhotoset.then(function(data) {
			if (data.stat === "ok")
				$scope.messagesInfo.push('The photo: ' + photoId + ' was added to photoset: ' + $scope.curPhotosetId);
		});
	}

	function run() {
		
		//var paramFrob = $location.search().frob;
		var paramFrob = $queryService.getFrob();
		if (!paramFrob) return;

		var promiseAuth = $authService.getToken(paramFrob);

		promiseAuth.then(function() {
			var nsid = $authService.user.nsid;
			loadPhotosetsList(nsid);
		});
	}

	$scope.setPhotoset = function(id) {
		$scope.curPhotosetId = id;
		var nsid = $authService.user.nsid;
		loadPhotosetPhotos(nsid, id);
	};

	$scope.deletePhoto = function(id) {
		if(confirm('Are you sure you want to delete the photo?')) {
			var promiseDeletePhoto = $galleryService.deletePhoto(id);
			promiseDeletePhoto.then(function(data) {
				$scope.messagesInfo.push('The photo: ' + id + ' was deleted.');
			});
		}
	};

	$scope.openUploadDialog = function() {
		// The data for the dialog
		var model = {
			title: "title",
			description: "description"
		};

		// jQuery UI dialog options
		var options = {
			autoOpen: false,
			resizable: false,
			height:400,
			widht: 250,
			modal: true,
			close: function(event, ui) {
				console.log("Predefined close");
			}
		};

		// Open the dialog
		dialogService.open("myDialog","dialogTemplate.html", model, options)
		.then(function(result) {

			console.log("Close");
			console.log(result);

			var photoInfo = {};
			photoInfo.file = result.file;
			photoInfo.title = 'title';
			photoInfo.description = 'description';

			var promiseUloadPhoto = $galleryService.uploadPhoto(photoInfo);
			promiseUloadPhoto.then(function(data) {
				addPhoto(data.photoId);
			},
			function(error) {
				console.log("Cancelled");
			});

		},
		function(error) {
			console.log("Cancelled");
		});
	};

	$scope.authUrl = $authService.authUrl();
	$scope.curPhotosetId = 0;
	$scope.messagesInfo = [];

	//run();

}


/* Controller - DialogCtrl */

flickrControllers.controller('DialogCtrl', ['$scope', 'dialogService', dialogCtrl]);

function dialogCtrl ($scope, dialogService) {

	// $scope.model contains the object passed to open in config.model

	$scope.saveClick = function() {
		$scope.model.file = $scope.fileModel;
		dialogService.close("myDialog", $scope.model);
	};

	$scope.cancelClick = function() {
		dialogService.cancel("myDialog");
	};
}