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

flickrServices.factory('$authService', ['$q', '$http', '$rootScope', function ($q, $http, $rootScope) {

		var authService = {};

		authService.authGetToken = function(frob) {
			if (!frob) throw new Error('Error! Frob parameter is not specified!');

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

flickrServices.factory('$galleryService', ['$q', '$rootScope', function ($q, $rootScope) {

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
				}
			});
			return deferred.promise;
		}

		galleryService.deletePhoto = function(photo_id, auth_token) {
			if (!photo_id && !auth_token) throw new Error('Error! Input parameters are not specified!');
			
			var deferred = $q.defer();

			flickr.deletePhoto({
					params: {
						photo_id: photo_id,
						auth_token: auth_token
				},
				callback: function(result){
					console.log(result);
					
					if(!result) return; /* WHY ?? */
					result.stat !== "ok" ? deferred.reject(result) : deferred.resolve(result);
				}
			});
			return deferred.promise;
		}


		return galleryService;
	}]);
