'use strict';

var managerServices = angular.module('managerServices', []);


/* managerServices */

managerServices.service('$userService', ['$q', '$http', '$rootScope', '$filter',
	function ($q, $http, $rootScope, $filter) {

		var serverUrl = "/person";

		var userService = {};

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


managerServices.service('alertsService', ['$rootScope', function ($rootScope) {

	$rootScope.alerts = [];
	$rootScope.MessageBox = "";

	this.SetValidationErrors = function (scope, validationErrors) {

		for (var prop in validationErrors) {
			var property = prop + "InputError";
			scope[property] = true;
		}

	}

	this.RenderErrorMessage = function (message) {

		var messageBox = formatMessage(message);
		$rootScope.alerts = [];
		$rootScope.MessageBox = messageBox;
		$rootScope.alerts.push({ 'type': 'danger', 'msg': '' });

	};

	this.RenderSuccessMessage = function (message) {

		var messageBox = formatMessage(message);
		$rootScope.alerts = [];
		$rootScope.MessageBox = messageBox;
		$rootScope.alerts.push({ 'type': 'success', 'msg': '' });
	};

	this.RenderWarningMessage = function (message) {

		var messageBox = formatMessage(message);
		$rootScope.alerts = [];
		$rootScope.MessageBox = messageBox;
		$rootScope.alerts.push({ 'type': 'warning', 'msg': '' });
	};

	this.RenderInformationalMessage = function (message) {

		var messageBox = formatMessage(message);
		$rootScope.alerts = [];
		$rootScope.MessageBox = messageBox;
		$rootScope.alerts.push({ 'type': 'info', 'msg': '' });
	};

	this.closeAlert = function (index) {
		$rootScope.alerts.splice(index, 1);
	};

	function formatMessage(message) {
		var messageBox = "";
		if (angular.isArray(message) == true) {
			for (var i = 0; i < message.length; i++) {
				messageBox = messageBox + message[i] + "<br/>";
			}
		}
		else {
			messageBox = message;
		}

		return messageBox;

	}

}]);