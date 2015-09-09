'use strict';

var managerServices = angular.module('managerServices', []);


/* managerServices */

managerServices.service('$userService', ['$q', '$http', '$rootScope', '$filter',
	function ($q, $http, $rootScope, $filter) {

		var userService = {};

		userService.update = function(person) {
			var item = userService.getById(person.id);
			
			item.age = person.age;
			item.address.streetAddress = person.address.streetAddress;
			item.address.city = person.address.city;
			item.address.state = person.address.state;
			item.address.postalCode = person.address.postalCode;
			
			for (var index = 0; index < item.phoneNumber.length; ++index) {
				for (var i = 0; i < person.phoneNumber.length; ++i) {
					if(item.phoneNumber[index].type === person.phoneNumber[i].name) {
						item.phoneNumber[index].number = person.phoneNumber[i];
					}
				}
			}
		};

		userService.getById = function(id) {
			var persons = this.getUsers();

			for (var i = 0; i < persons.length; i++) {
				if (persons[i].id === +id) {
					return persons[i];
				}
			}
		};

		userService.getUsers = function() {
			return data;
		}

		var data = [{
				"id": 13457,
				"firstName": "John",
				"lastName": "Smith",
				"age": 25,
				"address": {
					"streetAddress": "21 2nd Street",
					"city": "New York",
					"state": "NY",
					"postalCode": "10021"
				},
				"phoneNumber": [
				{
					"type": "home",
					"number": "212 555-1234"
				},
				{
					"type": "fax",
					"number": "646 555-4567"
				}
				]
			},
			{
				"id": 76578,
				"firstName": "Simona",
				"lastName": "Morasca",
				"age": 22,
				"address": {
					"streetAddress": "3 Mcauley Dr",
					"city": "Ashland",
					"state": "OH",
					"postalCode": "44805"
				},
				"phoneNumber": [
				{
					"type": "home",
					"number": "419-503-2484"
				},
				{
					"type": "fax",
					"number": "419-800-6759"
				}
				]
			},
			{
				"id": 12583,
				"firstName": "Josephine",
				"lastName": "Darakjy",
				"age": 33,
				"address": {
					"streetAddress": "4 B Blue Ridge Blvd",
					"city": "Brighton",
					"state": "MI",
					"postalCode": "48116"
				},
				"phoneNumber": [
				{
					"type": "home",
					"number": "973-605-6492"
				},
				{
					"type": "fax",
					"number": "602-919-4211"
				}
				]
			}];

		return userService;
	}]);

