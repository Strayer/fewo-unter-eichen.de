"use strict";

module.exports = function(grunt) {
	grunt.initConfig({
		dirs: {
			dest: "_site",
			src: "source"
		},

		jekyll: {
			site: {}
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
		//"copy",
		//"concat",
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
		//"copy",
		//"concat",
		//"filerev",
		//"usemin"
	]);

	grunt.registerTask("default", [
		"dev",
		"connect",
		"watch"
	]);
};
