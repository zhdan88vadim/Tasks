'use strict';


/* managerServices */

managerServices.service('$userService', ['$q', '$http', '$rootScope', '$filter',
	function ($q, $http, $rootScope, $filter) {

		var serverUrl = "/person";

		var userService = {};

		userService.create = function(person) {
			return $http.post(serverUrl, person);
		};

		userService.update = function(person) {
			return $http.put(serverUrl + '/' + person.id, person);
		};

		userService.getById = function(id) {
			return $http.get(serverUrl + '/' + id);
		};

		userService.getUsers = function() {
			return $http.get(serverUrl);
		}

		return userService;
	}]);

