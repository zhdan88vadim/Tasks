	describe('GalleryListCtrl', function(){

		var $authService, $rootScope, $location, createController;

		beforeEach(function(){
			module('flickrGallery')
		});

		beforeEach(inject(function($injector) {
			
			$location = $injector.get('$location');
			// Get hold of a scope (i.e. the root scope)
			$rootScope = $injector.get('$rootScope');
			// The $controller service is used to create instances of controllers
			var $controller = $injector.get('$controller');
			
			createController = function () {
				return $controller('GalleryListCtrl', 
				{
					'$scope': $rootScope, 
					'paramFrob': "123-123-123-123-123" 
				});
			};

			$authService = $injector.get('$authService');

		}));

		it('should set the auth url from $authService', function() {
			var controller = createController();
			expect($rootScope.authUrl)
			.toBe('http://flickr.com/services/auth/?api_key=30aa04e510115263def50e2092c99255&perms=delete&api_sig=84400919cd2e826bdb3b6a50a2824035');
		});

		it('should get frop parametr by url', function(done) {

			var result = $authService.getFrob("https://www.google.by/");

			result.then(function(data) {
				debugger;
				expect(result.state).toBe('ok');
				done();
			},
			function(data, status) {
				debugger;
				done();
			});

			//expect(result.state).toBe('ok');

		});

});



	// describe('Test to print out jasmine version', function() {
	// 	it('prints jasmine version', function() {
	// 		console.log('jasmine-version:');
	// 		console.log(jasmine.version || (jasmine.getEnv().versionString && jasmine.getEnv().versionString()));
	// 	});
	// });