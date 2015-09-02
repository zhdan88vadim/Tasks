'use strict';

var managerServices = angular.module('managerServices', []);


/* managerServices */

managerServices.service('$userService', ['$q', '$http', '$rootScope', 'appConfig',
	function ($q, $http, $rootScope, appConfig) {

		var userService = {};

		var user = {
			fullname: '',
			token: '',
			nsid: '',
			isAuthorized: false
		};

		userService.getUser = function() {
			return user;
		};


		return userService;
	}]);

