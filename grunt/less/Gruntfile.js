module.exports = function(grunt) {
	require('jit-grunt')(grunt);

	grunt.initConfig({
		less: {
			development: {
				options: {
					compress: false,
					paths: ["content/css"]
				},
				files: {
					"content/css/layout.css": "content/less/layout.less"
				}
			}
		},
		watch: {
			styles: {
				files: ['content/less/**/*.less'], // which files to watch
				tasks: ['less'],
				options: {
					nospawn: true
				}
			}
		}
	});

	grunt.registerTask('default', ['less', 'watch']);
};