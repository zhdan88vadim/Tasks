'use strict';


/* managerServices */

managerServices.service('$userService', ['$q', '$http',
	function ($q, $http) {

		var serverUrl = "/person";

		var userService = {};

		userService.create = function(person) {
			return $http.post(serverUrl, person);
		};

		userService.update = function(person) {
			return $http.put(serverUrl + '/' + person.id, person);
		};
		userService.delete = function(id) {
			return $http.delete(serverUrl + '/' + id);
		};

		userService.getById = function(id) {
			return $http.get(serverUrl + '/' + id);
		};

		userService.getUsers = function() {
			return $http.get(serverUrl);
		}

		return userService;
	}]);

