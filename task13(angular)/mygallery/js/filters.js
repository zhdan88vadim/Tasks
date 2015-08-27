'use strict';

var flickrServices = angular.module('flickrFilters', []);

flickrServices.filter('toPhotoPath', function() {
	return function(photo) {

		var out = '';
		out += "http://farm" + photo.farm;
		out += '.static.flickr.com/' + photo.server;
		out += '/'+ photo.id 
		out += '_' + photo.secret 
		out += '_n.jpg';

		return out;
	};
})