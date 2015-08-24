'user strict';

var flickrControllers = angular.module('flickrControllers', []);

flickrControllers.controller('GalleryListCtrl', ['$scope', '$q', '$authService', '$location', '$galleryService', '$queryService', galleryListCtrl]);


function galleryListCtrl ($scope, $q, $authService, $location, $galleryService, $queryService) {

	function loadPhotosetsList() {
		var promiseLoadList = $galleryService.loadPhotosetsList($scope.user.nsid);
		promiseLoadList.then(function(data) {
			$scope.photosets = data.photosets.photoset;
		});
	}

	function loadPhotosetPhotos(id) {
		var promiseloadPhotos = $galleryService.loadPhotosetPhotos($scope.user.nsid, id);
		promiseloadPhotos.then(function(data) {
			$scope.photos = data.photoset.photo;
		});
	}

	function run() {
		
		//var paramFrob = $location.search().frob;
		var paramFrob = $queryService.getFrob();
		if (!paramFrob) return; 
		var promiseAuth = $authService.authGetToken(paramFrob);
		promiseAuth.then(function(data) {
			$scope.user = {
				'fullname': data.auth.user.fullname,
				'token': data.auth.token._content,
				'nsid': data.auth.user.nsid
			};
			loadPhotosetsList();
		});
	}

	$scope.setPhotoset = function(id) {
		$scope.curPhotosetId = id;
		loadPhotosetPhotos(id);
	};

	$scope.deletePhoto = function(id) {
		if(confirm('Are you sure you want to delete the photo?')) {
			var promiseDeletePhoto = $galleryService.deletePhoto(id, $scope.user.token);
			promiseDeletePhoto.then(function(data) {
				$scope.messagesInfo.push('The photo: ' + id + ' was deleted.');
			});
		}
	};


	$scope.authUrl = $authService.authUrl();
	$scope.curPhotosetId = 0;
	$scope.messagesInfo = [];

	run();

}