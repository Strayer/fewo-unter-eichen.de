"use strict";

module.exports = function(grunt) {
	var packageJson = grunt.file.readJSON("package.json");
	
	grunt.initConfig({
		dirs: {
			dest: "_site",
			src: "source",
			dist: "dist"
		},

		copy: {
			dist: {
				files: [
					{
						src: [
							"assets/**/*.gif",
							"assets/**/*.png",
							"assets/**/*.jpg",
							"assets/**/*.ico",
							"assets/fonts/*"
						],
						dest: "<%= dirs.dest %>/",
						expand: true,
						cwd: "<%= dirs.src %>/"
					}
				]
			}
		},

		jekyll: {
			site: {}
		},

		sass: {
			dist: {
				options: {
					style: 'expanded'
				},
				files: {
					'<%= dirs.dest %>/assets/css/stylesheet.css': '<%= dirs.src %>/assets/scss/stylesheet.scss'
				}
			}
		},

		concat: {
			js: {
				separator: ";",
				src: [
					"<%= dirs.src %>/assets/js/head.core.js",
					"<%= dirs.src %>/assets/js/jquery-1.11.1.js",
					"<%= dirs.src %>/assets/js/fancybox/jquery.fancybox.js",
					"<%= dirs.src %>/assets/js/fancybox/helpers/*.js"
				],
				dest: "<%= dirs.dest %>/assets/js/pack.js"
			}
		},

		connect: {
			options: {
				hostname: "localhost",
				livereload: 35729,
				port: 8000
			},
			livereload: {
				options: {
					base: "<%= dirs.dest %>/",
					open: true
				}
			}
		},

		watch: {
			files: ["<%= dirs.src %>/**", "_config.yml", "Gruntfile.js"],
			tasks: "dev",
			options: {
				livereload: "<%= connect.options.livereload %>"
			}
		},

		clean: {
			dist: "<%= dirs.dest %>/"
		},
		
		compress: {
			main: {
				options: {
					mode: "tgz",
					level: 9,
					pretty: true,
					archive: "<%= dirs.dist %>/<%= packageJson.name %>-<%= git.rev %>.tar.gz"
				},
				expand: true,
				cwd: "<%= dirs.dest %>/",
				src: ["**/*"]
			}
		},
		
		"git-describe": {
			build: {}
		}
	});

	require("load-grunt-tasks")(grunt, {scope: "devDependencies"});
	require("time-grunt")(grunt);

    grunt.event.once('git-describe', function (rev) {
        grunt.config.set('git.rev', rev);
    });

	grunt.registerTask("build", [
		"git-describe",
		"clean",
		"jekyll",
		//"useminPrepare",
		"copy",
		"concat",
		"sass",
		//"uncss",
		//"cssmin",
		//"uglify",
		//"filerev",
		//"usemin",
		//"htmlmin"
	]);

	grunt.registerTask("dev", [
		"jekyll",
		//"useminPrepare",
		"copy",
		"concat",
		"sass",
		//"filerev",
		//"usemin"
	]);

	grunt.registerTask("default", [
		"dev",
		"connect",
		"watch"
	]);
	
	grunt.registerTask("dist", [
		"build",
		"compress"
	]);
};
