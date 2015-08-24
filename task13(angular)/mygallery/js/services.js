'use strict';

var flickrServices = angular.module('flickrServices', []);


// /* QueryService */

// flickrServices.factory('$queryService', ['$q', '$http', '$location', function ($q, $http, $location) {

// 		var queryService = {};

// 		queryService.getFrob = function() {
// 			return $location.search().frob;
// 		};
// 		return queryService;
// 	}]);


/* AuthService */

flickrServices.factory('$authService', ['$q', '$http', function ($q, $http) {

		var authService = {};

		authService.authGetToken = function(frob) {
			var deferred = $q.defer();
		
			flickr.authGetToken({
				params: {
					frob: frob
				},
				callback: function(result){
					console.log(result);
					if (result.stat !== "ok")
						deferred.reject(result);
					else
						deferred.resolve(result);
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
			
			//$http.get(url)
			
			// $http({ 
			// 	method: 'JSONP',
			// 	url: url
			//  })

			$http.jsonp(url)
			.then(function(result) {
				debugger;
				deferred.resolve(result);
			})
			// .error(function(result) {
			// 	debugger;				
			// 	deferred.reject(result);
			// });

			return deferred.promise;
		};

		return authService;
	}]);


/* GalleryService */

flickrServices.factory('$galleryService', ['$q', function ($q) {

		var galleryService = {};

		galleryService.loadPhotosetsList = function(user_nsid) {
			var deferred = $q.defer();

			flickr.photosetsGetList({
				user_id: user_nsid,
				callback: function(result){
					console.log(result);
					
					if(!result) return; /* WHY ?? */
					if (result.stat !== "ok") 
						deferred.reject(status);

					deferred.resolve(result);
				}
			});
			return deferred.promise;
		}

		galleryService.loadPhotosetPhotos = function(user_nsid, photosetId) {
			var deferred = $q.defer();

			flickr.photosetsGetPhotos({
				user_id: user_nsid,
				photoset_id: photosetId,
				callback: function(result){
					console.log(result);
					
					if(!result) return; /* WHY ?? */
					if (result.stat !== "ok") 
						deferred.reject(status);

					deferred.resolve(result);
				}
			});
			return deferred.promise;
		}

		galleryService.deletePhoto = function(photo_id, auth_token) {
			var deferred = $q.defer();

			flickr.deletePhoto({
					params: {
						photo_id: photo_id,
						auth_token: auth_token
				},
				callback: function(result){
					console.log(result);
					
					if(!result) return; /* WHY ?? */
					if (result.stat !== "ok") 
						deferred.reject(status);

					deferred.resolve(result);
				}
			});
			return deferred.promise;
		}


		return galleryService;
	}]);
