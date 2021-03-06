'use strict';

var flickrServices = angular.module('flickrServices', []);


/* FlickrService */

flickrServices.service('$flickrService', ['$q', 'appConfig', function ($q, appConfig) {
	var flickrService = {};
	var flickr = new Flickr({
		api_key: appConfig.api_key,
		secret: appConfig.secret
	});	

	flickrService.getFlickr = function() {
		return flickr;
	};
	return flickrService;
}]);


/* QueryService */

flickrServices.factory('$queryService', ['$q', '$location', function ($q, $location) {
	var queryService = {};
	queryService.getFrob = function() {
		return $location.search().frob;
	};
	return queryService;
}]);


/* AuthService */

flickrServices.service('$authService', ['$q', '$http', '$rootScope', 'appConfig', '$flickrService',
	function ($q, $http, $rootScope, appConfig, $flickrService) {

		var authService = {};

		var user = {
			fullname: '',
			token: '',
			nsid: '',
			isAuthorized: false
		};

		authService.getUser = function() {
			return user;
		};

		authService.setUser = function(fullname, token, nsid, isAuthorized) {
			user.fullname = fullname;
			user.token = token;
			user.nsid = nsid;
			user.isAuthorized = isAuthorized;
		};

		authService.getToken = function(frob) {
			if (!frob) throw new Error('Error! Frob parameter is not specified!');

			var deferred = $q.defer();

			$flickrService.getFlickr().authGetToken({
				params: {
					frob: frob
				},
				callback: function(result){
					if (result.stat == "ok") {

						authService.setUser(
							result.auth.user.fullname,
							result.auth.token._content,
							result.auth.user.nsid,
							true);

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
			authUrl += 'api_key=' + appConfig.api_key;
			authUrl += '&perms=' + 'delete';
			authUrl + '&callback=JSON_CALLBACK';
			return authUrl + '&api_sig=' + generateUrlSign(appConfig.secret, authUrl);
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

flickrServices.factory('$galleryService', ['$q', '$rootScope', '$authService', 'appConfig', '$flickrService',
	function ($q, $rootScope, $authService, appConfig, $flickrService) {

		var galleryService = {};

		galleryService.loadPhotosetsList = function(user_nsid) {
			if (!user_nsid) throw new Error('Error! Input parameter is not specified!');			
			var deferred = $q.defer();

			$flickrService.getFlickr().photosetsGetList({
				user_id: user_nsid,
				callback: function(result){
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

			$flickrService.getFlickr().photosetsGetPhotos({
				user_id: user_nsid,
				photoset_id: photosetId,
				callback: function(result){
					if(!result) return; /* WHY ?? */
					result.stat !== "ok" ? deferred.reject(result) : deferred.resolve(result);
					$rootScope.$apply(); // Warning! Karma tests don't work without it!					
				}
			});
			return deferred.promise;
		}

		galleryService.uploadPhoto = function(photoInfo) {
			if (!photoInfo) throw new Error('Error! Input parameters are not specified!');
			var user = $authService.getUser();
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
		+ '&api_key=' + appConfig.api_key 
		+ '&auth_token=' + user.token;

		data.append("photo", photoInfo.file);
		data.append("title", photoInfo.title);
		data.append("description", photoInfo.description);
		data.append("api_key", appConfig.api_key);
		data.append("auth_token", user.token);
		data.append("api_sig", generateUrlSign(appConfig.secret, tempUrl));

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
		var user = $authService.getUser();
		if(!user.isAuthorized) throw new Error('Error! Is not authorized!');

		var deferred = $q.defer();

		$flickrService.getFlickr().addPhotoToPhotosets({
			params: {
				photo_id: photo_id,
				photoset_id: photoset_id,
				auth_token: user.token
			},
			callback: function(result) {
				if(!result) return; /* WHY ?? */
				result.stat !== "ok" ? deferred.reject(result) : deferred.resolve(result);
					$rootScope.$apply(); // Warning! Karma tests don't work without it!					
				}
			});

		return deferred.promise;
	}

	galleryService.deletePhoto = function(photo_id) {
		if (!photo_id) throw new Error('Error! Input parameters are not specified!');
		var user = $authService.getUser();
		if(!user.isAuthorized) throw new Error('Error! Is not authorized!');

		var deferred = $q.defer();

		$flickrService.getFlickr().deletePhoto({
			params: {
				photo_id: photo_id,
				auth_token: user.token
			},
			callback: function(result){
				if(!result) return; /* WHY ?? */
				result.stat !== "ok" ? deferred.reject(result) : deferred.resolve(result);
					$rootScope.$apply(); // Warning! Karma tests don't work without it!					
				}
			});

		return deferred.promise;
	}


	return galleryService;

}]);
