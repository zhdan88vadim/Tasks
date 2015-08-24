	describe('GalleryListCtrl', function(){
		var $galleryService, $authService, $rootScope, $location; //, createController;
		var frob = "72157657674012972-ee9af09f035f3349-134797858";
		var user, photosets;

		beforeEach(function(){
			module('flickrGallery')
		});

		beforeEach(inject(function($injector) {
			
			$queryServiceFake = {
				getFrob: function() {
					return frob;
				}
			};

			$location = $injector.get('$location');
			$rootScope = $injector.get('$rootScope');

			var $controller = $injector.get('$controller');
			// createController = function () {
			// 	return $controller('GalleryListCtrl', 
			// 	{
			// 		'$scope': $rootScope, 
			// 		'$queryService': $queryServiceFake
			// 	});
			// };

			$galleryService = $injector.get('$galleryService');
			$authService = $injector.get('$authService');

		}));

		// it('should set the auth url from $authService', function() {
		// 	var controller = createController();
		// 	expect($rootScope.authUrl)
		// 	.toBe('http://flickr.com/services/auth/?api_key=30aa04e510115263def50e2092c99255&perms=delete&api_sig=84400919cd2e826bdb3b6a50a2824035');
		// });

		it('should get auth token by frob', function(done) {
			var promise = $authService.authGetToken(frob);
			promise.then(function(data) {
				user = {
					'fullname': data.auth.user.fullname,
					'token': data.auth.token._content,
					'nsid': data.auth.user.nsid
				};
				
				expect(data.stat).toBe('ok');
				done();
			},
			function(data) {
				expect('server return message: ' + data.message).toBe('ok');
				done();
			});
		});

		it('should load photosets list from server', function(done) {
			var promise = $galleryService.loadPhotosetsList(user.nsid);
			promise.then(function(data) {
				photosets = data.photosets.photoset;

				expect(data.stat).toBe('ok');
				expect(photosets.length).toBe(3);
				expect(photosets).toContain(3);
				done();
			},
			function(data) {
				expect('server return message: ' + data.message).toBe('ok');
				done();
			});
		});

		it('test toContain', function(done) {
			var objects = [ {id:234234, length: 67} ];

			expect(objects).toContain({ id: 234234, length: 67 });
			done();
		});


		it('should load photos list for photoset ', function(done) {
			var promise = $galleryService.loadPhotosetPhotos(user.nsid, id);
			promise.then(function(data) {
				photosets = data.photosets.photoset;

				expect(data.stat).toBe('ok');
				expect(photosets.length).toBe(3);
				done();
			},
			function(data) {
				expect('server return message: ' + data.message).toBe('ok');
				done();
			});
		});



});



	// describe('Test to print out jasmine version', function() {
	// 	it('prints jasmine version', function() {
	// 		console.log('jasmine-version:');
	// 		console.log(jasmine.version || (jasmine.getEnv().versionString && jasmine.getEnv().versionString()));
	// 	});
	// });