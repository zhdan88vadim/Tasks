managerServices.factory('sessionInjector', [function() {  
	var sessionInjector = {
		request: function(config) {
			config.headers['x-session-token'] = '123-123-123-000';

			//if (!SessionService.isAnonymus) {
			//		config.headers['x-session-token'] = SessionService.token;				
			//}

			return config;
		}
	};
	return sessionInjector;
}]);

// managerServices.factory('timestampMarker', [function() {  
// 	var timestampMarker = {
// 		request: function(config) {
// 			config.requestTimestamp = new Date().getTime();
// 			return config;
// 		},
// 		response: function(response) {
// 			response.config.responseTimestamp = new Date().getTime();
// 			return response;
// 		}
// 	};
// 	return timestampMarker;
// }]);