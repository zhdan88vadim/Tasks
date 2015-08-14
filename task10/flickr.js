(function(window) {
	"use strict";

	var Flicker = function(j){
		var defaults = {
			api_key: 'YOUR API KEY',
			callback: function() {}
		}
	}
	Flickr.prototype.photosetsGetList = function(options) {
		this.photosets('flickr.photosets.getList', options);
	};
	window.flicker = function(j){
		return new Flickr(j);
	}
})(window);