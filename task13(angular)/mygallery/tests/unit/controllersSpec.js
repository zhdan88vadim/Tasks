	describe('GalleryListCtrl', function() {
		var $galleryService, $authService, $rootScope, $location; //, createController;
		
		var frob = "72157657368174670-1fa1bd04b0c2228c-134797858";
		
		var userPhotosetId = "72157657002842319";

		var uploadPhotoId, photosets, photos, user;

		beforeEach(function(){
			module('flickrGallery');
		});

		beforeEach(inject(function($injector) {
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

			if (!$authService)
				$authService = $injector.get('$authService');
			
			if (!$galleryService)
				$galleryService = $injector.get('$galleryService', {
					$authService : $authService
			});


			
		}));

	it('should get auth token by frob', function(done) {
		var promise = $authService.getToken(frob);
		promise.then(function() {
			
			user = $authService.getUser();

			expect(user.isAuthorized).toBe(true);
			done();
		},
		function() {
			expect('Error').toBe('The token has not been received.');
			done();
		});
	});

	it('should load photosets from server', function(done) {
		var promise = $galleryService.loadPhotosetsList(user.nsid);
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

	it('should load photos from photoset 72157657002842319', function(done) {
		var promise = $galleryService.loadPhotosetPhotos(user.nsid, userPhotosetId);
		promise.then(function(data) {
			photos = data.photoset.photo;

			expect(data.stat).toBe('ok');
			expect(photos.length).toBeGreaterThan(20);
			done();
		},
		function(data) {
			expect('server return message: ' + data.message).toBe('ok');
			done();
		});
	});

	it('should upload photo to server', function(done) {

		var blob = dataURItoBlob("data:image/jpg;base64,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vegBabOu61nX1jYfoaio/cZUd0eYXag+GrRvXTFJ/wC+SP6VaMYYA8YKA/mAa8u+h6kl7z9TRtLaS7UNG6q0EMj/ADDr8uMVDZeBtL+xQyG4vgZYUcgSJgEqM/wVrh7OUvl+pjiG4U013Kt54ftNKvCtu8zj7OHHmsCcl8dgOMV02j20Vr4+1JYYwiyaejED2kAH6VdKVqy87/k/8i5a4Zej/OP+Z1qjinYrtPNP/9n/7AARRHVja3kAAQAEAAAAZAAA/+EJ72h0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4NCjx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDQuMi1jMDIwIDEuMTI0MDc4LCBUdWUgU2VwIDExIDIwMDcgMjM6MjE6NDAgICAgICAgICI+DQoJPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4NCgkJPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eGFwPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpNaWNyb3NvZnRQaG90b18xXz0iaHR0cDovL25zLm1pY3Jvc29mdC5jb20vcGhvdG8vMS4wLyIgeG1sbnM6eGFwTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIiB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIgeG1sbnM6Y3JzPSJodHRwOi8vbnMuYWRvYmUuY29tL2NhbWVyYS1yYXctc2V0dGluZ3MvMS4wLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4YXBSaWdodHM9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9yaWdodHMvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhhcDpSYXRpbmc9IjUiIHhhcDpDcmVhdGVEYXRlPSIyMDA4LTAyLTExVDE5OjMyOjUxLjc3M1oiIHhhcDpNb2RpZnlEYXRlPSIyMDA4LTAyLTExVDExOjMyOjUxLjc3LTA4OjAwIiB4YXA6TWV0YWRhdGFEYXRlPSIyMDA5LTAyLTAyVDExOjQxOjM0LTA4OjAwIiBNaWNyb3NvZnRQaG90b18xXzpSYXRpbmc9Ijg4IiB4YXBNTTpJbnN0YW5jZUlEPSJ1dWlkOmZhZjViZGQ1LWJhM2QtMTFkYS1hZDMxLWQzM2Q3NTE4MmYxYiIgZXhpZjpFeGlmVmVyc2lvbj0iMDIyMSIgZXhpZjpEYXRlVGltZU9yaWdpbmFsPSIyMDA4LTAyLTExVDExOjMyOjUxLjc3LTA4OjAwIiBleGlmOkRhdGVUaW1lRGlnaXRpemVkPSIyMDA4LTAyLTExVDExOjMyOjUxLjc3LTA4OjAwIiBleGlmOlBpeGVsWERpbWVuc2lvbj0iMTAyNCIgZXhpZjpQaXhlbFlEaW1lbnNpb249Ijc2OCIgZXhpZjpDb2xvclNwYWNlPSI2NTUzNSIgdGlmZjpPcmllbnRhdGlvbj0iMSIgdGlmZjpJbWFnZVdpZHRoPSIxMDI0IiB0aWZmOkltYWdlTGVuZ3RoPSI3NjgiIHRpZmY6UGhvdG9tZXRyaWNJbnRlcnByZXRhdGlvbj0iMiIgdGlmZjpTYW1wbGVzUGVyUGl4ZWw9IjMiIHRpZmY6WFJlc29sdXRpb249Ijk2LzEiIHRpZmY6WVJlc29sdXRpb249Ijk2LzEiIHRpZmY6UmVzb2x1dGlvblVuaXQ9IjIiIGNyczpBbHJlYWR5QXBwbGllZD0iVHJ1ZSIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9IiIgcGhvdG9zaG9wOkxlZ2FjeUlQVENEaWdlc3Q9IjY5MzIwOUQ3QzM1MTIzMjI1NUVENTMzMjYzOTMzMTk0IiB4YXBSaWdodHM6TWFya2VkPSJUcnVlIj4NCgkJCTx0aWZmOkJpdHNQZXJTYW1wbGU+DQoJCQkJPHJkZjpTZXE+DQoJCQkJCTxyZGY6bGk+ODwvcmRmOmxpPg0KCQkJCQk8cmRmOmxpPjg8L3JkZjpsaT4NCgkJCQkJPHJkZjpsaT44PC9yZGY6bGk+DQoJCQkJPC9yZGY6U2VxPg0KCQkJPC90aWZmOkJpdHNQZXJTYW1wbGU+DQoJCQk8ZGM6Y3JlYXRvcj4NCgkJCQk8cmRmOlNlcT4NCgkJCQkJPHJkZjpsaT5Ub20gQWxwaGluPC9yZGY6bGk+DQoJCQkJPC9yZGY6U2VxPg0KCQkJPC9kYzpjcmVhdG9yPg0KCQkJPGRjOnJpZ2h0cz4NCgkJCQk8cmRmOkFsdD4NCgkJCQkJPHJkZjpsaSB4bWw6bGFuZz0ieC1kZWZhdWx0Ij7CqSBNaWNyb3NvZnQgQ29ycG9yYXRpb248L3JkZjpsaT4NCgkJCQk8L3JkZjpBbHQ+DQoJCQk8L2RjOnJpZ2h0cz4NCgkJPC9yZGY6RGVzY3JpcHRpb24+DQoJPC9yZGY6UkRGPg0KPC94OnhtcG1ldGE+DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAg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");

		var photoInfo = {};
		photoInfo.file = blob;
		photoInfo.title = 'title test jasmin';
		photoInfo.description = 'description test jasmin';

		var promise = $galleryService.uploadPhoto(photoInfo);
		promise.then(function(data) {

			uploadPhotoId = data.photoId;

			expect(data.photoId).toBeGreaterThan(0);
			done();
		},
		function(data) {
			expect('server return message: ' + data.message).toBe('ok');
			done();
		});
	});

	it('should add upload photo to photoset 72157657002842319', function(done) {

		var promise = $galleryService.addPhotoToPhotoset(uploadPhotoId, userPhotosetId);
		promise.then(function(data) {
			expect(data.stat).toBe("ok");
			done();
		});
	});

	it('should delete upload photo from photoset 72157657002842319', function(done) {

		var promise = $galleryService.deletePhoto(uploadPhotoId);
		promise.then(function(data) {
			expect(data.stat).toBe("ok");
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





function dataURItoBlob(dataURI) {
	// convert base64/URLEncoded data component to raw binary data held in a string
	var byteString;
	if (dataURI.split(',')[0].indexOf('base64') >= 0)
		byteString = atob(dataURI.split(',')[1]);
	else
		byteString = unescape(dataURI.split(',')[1]);

	// separate out the mime component
	var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

	// write the bytes of the string to a typed array
	var ia = new Uint8Array(byteString.length);
	for (var i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i);
	}

	return new Blob([ia], {type:mimeString});
}