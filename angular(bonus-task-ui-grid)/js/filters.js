'use strict';

var managerFilters = angular.module('managerFilters', []);

managerFilters.filter('phoneNumber', function() {
	return function(phones, phoneType) {

		for (var index = 0; index < phones.length; ++index) {
			if(phones[index].type === phoneType.name) {
				return phones[index].number;
			}
		}
	}
});

managerFilters.filter('personFilter', function($filter) {
	return function(persons, searchText, phoneType) {
		
		if (!searchText) return persons;

		var search = searchText.toUpperCase();
		var filtered = [];

		angular.forEach(persons, function(item) {

			var phone = $filter('phoneNumber')(item.phoneNumber, phoneType);

			if ((item.firstName.toUpperCase().indexOf(search) > -1)
			|| (item.lastName.toUpperCase().indexOf(search) > -1)
			|| (item.age.toString().toUpperCase().indexOf(search) > -1) 
			|| (item.address.city.toUpperCase().indexOf(search) > -1)
			|| (phone.toUpperCase().indexOf(search) > -1)) {
				filtered.push(item);
			}
		});

		return filtered;
	}
});