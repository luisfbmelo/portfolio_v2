module.exports = function(grunt) {
	// Show elapsed time after tasks run to visualize performance
    require('time-grunt')(grunt);
    // Load all Grunt tasks that are listed in package.json automagically
    require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		// shell commands for use in Grunt tasks
        shell: {
            jekyllBuild: {
                command: 'jekyll build'
            },
            jekyllServe: {
                command: 'jekyll serve'
            }
        },
        // create bundle
		browserify: {
		  dist: {
		    files: {
		      //'js/bundle.js': ['js/**/*.js', 'js/*.js', '!js/bundle.js', '!js/main.js'],
		      'js/bundle.js': ['js/app.js'],
		    },
		  }
		},

		// uglify bundle
		uglify: {
		    my_target: {
		    	options:{
		    		mangle: false
		    	},
			    files: {
			    	'js/bundle.min.js': ['js/bundle.js']
			    }
		    }
		},

	  	// run tasks in parallel
        concurrent: {
            serve: [
                'browserify',
                'uglify',
                'watch',
                'shell:jekyllServe'
            ],
            options: {
                logConcurrentOutput: true
            }
        },

        // watch for changes
		watch: {
			browserify: {
				files: ['js/**/*.js', 'js/*.js', '!js/bundle.js', '!js/bundle.min.js'],
				tasks: ['browserify','uglify']
			}
		}
	});

	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-jekyll');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-contrib-watch');


	
	grunt.registerTask('default',['concurrent:serve']);
}  