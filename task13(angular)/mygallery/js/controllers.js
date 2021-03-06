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
		//history.pushState({}, "Gallery", "/");
		if (!paramFrob) return;
		if ($authService.getUser().isAuthorized) return;


		var promiseAuth = $authService.getToken(paramFrob);

		promiseAuth.then(function() {
			$scope.isAuthorized = true;

			var nsid = $authService.getUser().nsid;
			loadPhotosetsList(nsid);
		}, function() {
			alert('The token has not been received.');
		});
	}

	$scope.setPhotoset = function(id) {
		$scope.curPhotosetId = id;
		var nsid = $authService.getUser().nsid;
		loadPhotosetPhotos(nsid, id);
	};

	$scope.deletePhoto = function(id, $event) {
		$event.stopPropagation();

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
			title: 'title',
			description: 'description'
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

		dialogService.open("myDialog","dialogTemplate.html", model, options)
		.then(function(result) {

			console.log("Close");
			console.log(result);

			if (!result.file) return; // Exit  if the file is not selected.

			var photoInfo = {};
			photoInfo.file = result.file;
			photoInfo.title = result.title;
			photoInfo.description = result.description;

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
	$scope.isAuthorized = false;

	$scope.loading = true;

	$scope.setCurrentPhoto = function(id) {
		var currentIndex = 0;
		var currentPhoto = null
		
		angular.forEach($scope.photos, function(value, index) {
			if (value.id == id) {
				currentPhoto = value;
				currentIndex = parseInt(index);
				return;
			}
		});

		$scope.currentPhoto = (currentPhoto)? currentPhoto : null;
		$scope.currentPhotoSrc = (currentPhoto)?'http://farm' + $scope.currentPhoto.farm + '.static.flickr.com/' + $scope.currentPhoto.server + '/' + $scope.currentPhoto.id + '_' + $scope.currentPhoto.secret + '_z.jpg' : null;

		$('#photoModal img').on('load', function() {
			var width = $('#photoModal img')[0].naturalWidth;
			$('#photoModal').modal();
			$('#photoModal .modal-dialog').width(width + 15 * 2);
		}).each(function() {
			if(this.complete) 
				$(this).load();
		});
	}


	debugger;
	
	console.log('run');

	run();
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