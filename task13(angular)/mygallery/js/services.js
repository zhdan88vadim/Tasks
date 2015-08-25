'use strict';

var flickrServices = angular.module('flickrServices', []);


/* QueryService */

flickrServices.factory('$queryService', ['$q', '$location', function ($q, $location) {
	var queryService = {};
	queryService.getFrob = function() {
		return $location.search().frob;
	};
	return queryService;
}]);


/* AuthService */

flickrServices.service('$authService', ['$q', '$http', '$rootScope', function ($q, $http, $rootScope) {

	var authService = {};
	
	authService.user = {
		fullname: '',
		token: '',
		nsid: '',
		isAuthorized: false
	};

	authService.getToken = function(frob) {
		if (!frob) throw new Error('Error! Frob parameter is not specified!');

		var deferred = $q.defer();
		
		flickr.authGetToken({
			params: {
				frob: frob
			},
			callback: function(result){
				console.log(result);
				if (result.stat == "ok") {

					authService.user = {
						'fullname': result.auth.user.fullname,
						'token': result.auth.token._content,
						'nsid': result.auth.user.nsid,
						isAuthorized: true
					};

					deferred.resolve();
				}
				else {
					deferred.reject();
				}

				$rootScope.$apply(); // Warning! Karma tests don't work without it!
			}
		});
		return deferred.promise;
	};

	authService.authUrl = function() {
		var authUrl = 'http://flickr.com/services/auth/?';
		authUrl += 'api_key=' + app.api_key;
		authUrl += '&perms=' + 'delete';
		authUrl + '&callback=JSON_CALLBACK';
		return authUrl + '&api_sig=' + generateUrlSign(app.secret, authUrl);
	};

	authService.getFrob = function(url) {
		var deferred = $q.defer();
		$http.jsonp(url)
		.then(function(result) {
			debugger;
			deferred.resolve(result);
				$rootScope.$apply(); // Warning! Karma tests don't work without it!				
			});
		return deferred.promise;
	};

	return authService;
}]);


/* GalleryService */

flickrServices.factory('$galleryService', ['$q', '$rootScope', '$authService', function ($q, $rootScope, $authService) {

	var galleryService = {};

	galleryService.loadPhotosetsList = function(user_nsid) {
		if (!user_nsid) throw new Error('Error! Input parameter is not specified!');			
		var deferred = $q.defer();

		flickr.photosetsGetList({
			user_id: user_nsid,
			callback: function(result){
				console.log(result);

				if(!result) return; /* WHY ?? */
				result.stat !== "ok" ? deferred.reject(result) : deferred.resolve(result);
					$rootScope.$apply(); // Warning! Karma tests don't work without it!
				}
			});
		return deferred.promise;
	}

	galleryService.loadPhotosetPhotos = function(user_nsid, photosetId) {
		if (!user_nsid && !photosetId) throw new Error('Error! Input parameters are not specified!');
		
		var deferred = $q.defer();

		flickr.photosetsGetPhotos({
			user_id: user_nsid,
			photoset_id: photosetId,
			callback: function(result){
				console.log(result);

				if(!result) return; /* WHY ?? */
				result.stat !== "ok" ? deferred.reject(result) : deferred.resolve(result);
					$rootScope.$apply(); // Warning! Karma tests don't work without it!					
				}
			});
		return deferred.promise;
	}

	galleryService.uploadPhoto = function(photoInfo) {
		if (!photoInfo) throw new Error('Error! Input parameters are not specified!');
		var user = $authService.user;
		if(!user.isAuthorized) throw new Error('Error! Is not authorized!');

		var deferred = $q.defer();

		var data = new FormData();

		// var files = $(photoInfo.elementFile).get(0).files;
		// if (files.length > 0) {
		// 	data.append("photo", files[0]);
		// } else {
		// 	return false; // If photo not selected exit.
		// }

		var tempUrl = 'https://up.flickr.com/services/upload/?' 
		+ 'title=' + photoInfo.title
		+ '&description=' + photoInfo.description
		+ '&api_key=' + app.api_key 
		+ '&auth_token=' + user.token;

		data.append("photo", photoInfo.file);
		data.append("title", photoInfo.title);
		data.append("description", photoInfo.description);
		data.append("api_key", app.api_key);
		data.append("auth_token", user.token);
		data.append("api_sig", generateUrlSign(app.secret, tempUrl));

		$.ajax("https://up.flickr.com/services/upload/", {
			data: data,
			type: "POST",
			processData: false,
			cache: false,
			contentType: false,
			success: function (result) {
				if(!result) return; /* WHY ?? */
				var statItem = result.getElementsByTagName('rsp').item(0);
				var resultStat = statItem.attributes.getNamedItem('stat').textContent;

				var photoId = result.getElementsByTagName('photoid').item(0).textContent;

				resultStat !== "ok" ? deferred.reject(0) : deferred.resolve({ photoId: photoId });
					$rootScope.$apply(); // Warning! Karma tests don't work without it!	
				},
				error: function () {
					deferred.reject(-1);
				}
			});

		return deferred.promise;
	};

	galleryService.addPhotoToPhotoset = function(photo_id, photoset_id) {
		if (!photo_id) throw new Error('Error! Input parameters are not specified!');
		var user = $authService.user;
		if(!user.isAuthorized) throw new Error('Error! Is not authorized!');

		var deferred = $q.defer();

		flickr.addPhotoToPhotosets({
			params: {
				photo_id: photo_id,
				photoset_id: photoset_id,
				auth_token: user.token
			},
			callback: function(result) {
				console.log(result);

				if(!result) return; /* WHY ?? */
				result.stat !== "ok" ? deferred.reject(result) : deferred.resolve(result);
					$rootScope.$apply(); // Warning! Karma tests don't work without it!					
				}
			});

		return deferred.promise;
	}

	galleryService.deletePhoto = function(photo_id) {
		if (!photo_id) throw new Error('Error! Input parameters are not specified!');
		var user = $authService.user;
		if(!user.isAuthorized) throw new Error('Error! Is not authorized!');

		var deferred = $q.defer();

		flickr.deletePhoto({
			params: {
				photo_id: photo_id,
				auth_token: user.token
			},
			callback: function(result){
				console.log(result);

				if(!result) return; /* WHY ?? */
				result.stat !== "ok" ? deferred.reject(result) : deferred.resolve(result);
					$rootScope.$apply(); // Warning! Karma tests don't work without it!					
				}
			});

		return deferred.promise;
	}


	return galleryService;

}]);
