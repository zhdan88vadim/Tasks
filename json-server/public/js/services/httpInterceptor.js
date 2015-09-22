managerServices.factory('httpInterceptor', ['$q', function($q) {
	
	function canRecover() {
		return false;
	}

	return {
		// optional method
		'request': function(config) {
			// do something on success
			console.log(config);
			console.log('-- ^ request --');
			return config;
		},

		// optional method
		'requestError': function(rejection) {
			// do something on error
			console.log(rejection);
			console.log('-- ^ rejection --');
			if (canRecover(rejection)) {
				return; //responseOrNewPromise
			}
			return $q.reject(rejection);
		},

		// optional method
		'response': function(response) {
			// do something on success
			
			// if(response.status === 401)
			// 	$location.path('/signin');

			console.log(response);
			console.log('-- ^ response --');
			return response;
		},

		// optional method
		'responseError': function(rejection) {
			// do something on error
			console.log(rejection);
			console.log('-- ^ rejection --');
			if (canRecover(rejection)) {
				return; // responseOrNewPromise
			}
			return $q.reject(rejection);
		}
	};
	
}]);