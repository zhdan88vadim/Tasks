module.exports = function(grunt) {
	require('jit-grunt')(grunt);

	grunt.initConfig({
		clean: {
				build: {
				src: ["dist/"]
			}
		},
		copy: {
			main: {
				cwd: 'src/',
				src: '**',
				dest: 'dist/',
				expand: true,
				flatten: false
			},
		},
		less: {
			development: {
				options: {
					compress: false,
					paths: ["content/css"]
				},
				files: {
					"dist/content/css/layout.css": "dist/content/less/layout.less"
				}
			}
		},
		autoprefixer: {
			dist: {
				files: {
					'dist/content/css/layout.css': 'dist/content/css/layout.css'
				}
			}
		},
		filerev: {
			options: {
				//encoding: 'utf8',
				algorithm: 'md5',
				length: 8
			},
			source: {
				files: [{
					src: [
						'dist/js/**/*.js',
						'dist/content/css/**/*.css'
					]
				}]
			}
		},
		usemin: {
			html: ['dist/**/*.html'],
			//html: ['dist/index.html', 'dist/test.html'],
			options: {
				assetsDirs: ['dist']
			}
		},
		watch: {
			styles: {
				files: ['content/less/**/*.less'],
				tasks: ['less'],
				options: {
					nospawn: true
				}
			}
		}
	});
	
	grunt.loadNpmTasks('grunt-usemin');
	grunt.loadNpmTasks('grunt-contrib-copy');
	//grunt.loadNpmTasks('grunt-contrib-uglify');
	//grunt.loadNpmTasks('grunt-contrib-concat');
	//grunt.loadNpmTasks('grunt-debug-task');
	grunt.loadNpmTasks('grunt-filerev');
	grunt.loadNpmTasks('grunt-contrib-clean');


	grunt.registerTask('default', ['clean', 'copy', 'less', 'autoprefixer', 'filerev', 'usemin']);
	

	// usemin replaces the references of scripts, stylesheets and other assets within HTML 
	//   files dynamically with optimized versions of them.

	//grunt.registerTask('default', ['less', 'autoprefixer', 'filerev', 'watch']);
};