"use strict";

module.exports = function(grunt) {
	grunt.initConfig({
		dirs: {
			dest: "_site",
			src: "source"
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
		}
	});

	require("load-grunt-tasks")(grunt, {scope: "devDependencies"});
	require("time-grunt")(grunt);

	grunt.registerTask("build", [
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
};
