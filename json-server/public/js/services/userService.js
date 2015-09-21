'use strict';


/* managerServices */

// managerServices.service('$userService', ['$q', '$http',
// 	function ($q, $http) {

// 		var serverUrl = "/person";

// 		var userService = {};

// 		userService.create = function(person) {
// 			return $http.post(serverUrl, person);
// 		};

// 		userService.update = function(person) {
// 			return $http.put(serverUrl + '/' + person.id, person);
// 		};
// 		userService.delete = function(id) {
// 			return $http.delete(serverUrl + '/' + id);
// 		};

// 		userService.getById = function(id) {
// 			return $http.get(serverUrl + '/' + id);
// 		};

// 		userService.getAll = function() {
// 			return $http.get(serverUrl);
// 		}

// 		return userService;
// 	}]);




managerServices.service('$userService', ['$q', '$http', '$promiseFactory',
	function ($q, $http, $promiseFactory) {


		var data = [
		{
			"id": 13457,
			"firstName": "John",
			"lastName": "Smith",
			"age": 23,
			"address": {
				"streetAddress": "3434",
				"city": "New Yorksdfs",
				"state": "123 123",
				"postalCode": "44444"
			},
			"phoneNumber": [
			{
				"type": "fax",
				"number": "232-232-4455"
			},
			{
				"type": "home",
				"number": "234-234 0222"
			}
			]
		},
		{
			"id": 123,
			"firstName": "Test",
			"lastName": "Mor",
			"age": 123,
			"address": {
				"streetAddress": "3 Dr",
				"city": "Ashland",
				"state": "OH",
				"postalCode": "448"
			},
			"phoneNumber": [
			{
				"type": "fax",
				"number": "419-800-2343"
			},
			{
				"type": "home",
				"number": "419-232-2343"
			}
			]
		},
		{
			"id": 323,
			"firstName": "Simo",
			"lastName": "Moras",
			"age": 32,
			"address": {
				"streetAddress": "3 Mcauley",
				"city": "Ashlandd",
				"state": "OH",
				"postalCode": "44809"
			},
			"phoneNumber": [
			{
				"type": "fax",
				"number": "419-800-6759"
			},
			{
				"type": "home",
				"number": "419-503-3454"
			}
			]
		},
		{
			"id": 76578,
			"firstName": "Simona",
			"lastName": "Morasca",
			"age": 34,
			"address": {
				"streetAddress": "test street",
				"city": "test city",
				"state": "state",
				"postalCode": "44805"
			},
			"phoneNumber": [
			{
				"type": "fax",
				"number": "419-800-1212"
			},
			{
				"type": "home",
				"number": "419-503-0033"
			}
			]
		},
		{
			"id": 12583,
			"firstName": "Josephine",
			"lastName": "Darakjy",
			"age": 33,
			"address": {
				"streetAddress": "4 B Blue Ridgde Blvd",
				"city": "Brightonw",
				"state": "asdasdas",
				"postalCode": "48116"
			},
			"phoneNumber": [
			{
				"type": "fax",
				"number": "602-919-4333"
			},
			{
				"type": "home",
				"number": "973-605-6433"
			}
			]
		}
		];


		function getRawPersonById(id) {
			for (var i = 0; i < data.length; i++) {
				if (!data[i]) continue;
				if (data[i].id === +id) {
					return data[i];
				}
			}
		}

		//var serverUrl = "/person";

		var userService = {};

		userService.create = function(person) {
			var deferred = $promiseFactory.defer();
			person.id = ++data.length;
			
			data.push(person);
			deferred.resolve(angular.copy(person));

			return deferred.promise;
		};

		userService.update = function(person) {
			var deferred = $promiseFactory.defer();
			
			var personRaw = getRawPersonById(person.id);
			
			personRaw.age = person.age;
			personRaw.address.streetAddress = person.address.streetAddress;
			personRaw.address.city = person.address.city;
			personRaw.address.state = person.address.state;
			personRaw.address.postalCode = person.address.postalCode;
			
			for (var index = 0; index < personRaw.phoneNumber.length; ++index) {
				for (var i = 0; i < person.phoneNumber.length; ++i) {
					if(personRaw.phoneNumber[index].type === person.phoneNumber[i].type) {
						personRaw.phoneNumber[index].number = person.phoneNumber[i].number;
					}
				}
			}

			deferred.resolve(angular.copy(personRaw));

			return deferred.promise;
		};
		userService.delete = function(id) {
			var deferred = $promiseFactory.defer();
			var personRaw = getRawPersonById(id);
			personRaw.id = -1;

			deferred.resolve({});

			return deferred.promise;
		};

		userService.getById = function(id) {
			var deferred = $promiseFactory.defer();
			var person = getRawPersonById(id);
			deferred.resolve(angular.copy(person));

			return deferred.promise;
		};

		userService.getAll = function() {
			var deferred = $promiseFactory.defer();

			var notDeleted = [];
			for (var i = 0; i < data.length; ++i) {
			
				if (!data[i]) continue;
				if (data[i].id === -1) continue;
				notDeleted.push(data[i]);
			}

			deferred.resolve(angular.copy(notDeleted));

			return deferred.promise;
		}

		return userService;


	}]);

