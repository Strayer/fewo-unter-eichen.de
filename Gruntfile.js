"use strict";

module.exports = function(grunt) {
	grunt.initConfig({
		dirs: {
			dest: "_site",
			src: "source",
			dist: "dist"
		},
		
		packageJson: grunt.file.readJSON("package.json"),

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

        htmlmin: {
            dist: {
                options: {
                    collapseWhitespace: true,
                    ignoreCustomComments: [/^\s*google(off|on):\s/],
                    minifyCSS: true,
                    minifyJS: true,
                    removeAttributeQuotes: true,
                    removeComments: true
                },
				files: {
	                expand: true,
					cwd: "<%= dirs.dest %>/",
	                dest: "./",
	                src: "<%= dirs.dest %>/**/*.html"
				}
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

		uncss: {
			options: {
				ignore: [
					/(#|\.)fancybox(\-[a-zA-Z]+)?/
				],
				htmlroot: "<%= dirs.dest %>"
			},
			dist: {
				src: "<%= dirs.dest %>/**/*.html",
				dest: "<%= dirs.dest %>/assets/css/stylesheet.css"
			}
		},

		cssmin: {
			minify: {
				options: {
					keepSpecialComments: 0,
					compatibility: "ie8"
				},
				files: {
					"<%= uncss.dist.dest %>": "<%= dirs.dest %>/assets/css/stylesheet.css"
				}
			}
		},

		uglify: {
			options: {
				compress: {
					warnings: false
				},
				mangle: true,
				preserveComments: false
			},
			minify: {
				files: {
					"<%= concat.js.dest %>": "<%= concat.js.dest %>"
				}
			}
		},

		filerev: {
			css: {
				src: "<%= dirs.dest %>/assets/css/**/{,*/}*.css"
			},
			js: {
				src: [
					"<%= dirs.dest %>/assets/js/**/{,*/}*.js"
				]
			},
			images: {
				src: [
					"<%= dirs.dest %>/assets/**/*.{jpg,jpeg,gif,png}"
				]
			},
			fonts: {
				src: [
					"<%= dirs.dest %>/assets/fonts/*"
				]
			}
		},

		useminPrepare: {
			html: "<%= dirs.dest %>/index.html",
			options: {
				dest: "<%= dirs.dest %>",
				root: "<%= dirs.dest %>"
			}
		},

		usemin: {
			css: "<%= dirs.dest %>/assets/css/*.css",
			html: "<%= dirs.dest %>/**/*.html",
			options: {
				assetsDirs: [
					"<%= dirs.dest %>/",
					"<%= dirs.dest %>/assets/css"
				]
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
			dist: ["<%= dirs.dest %>/", "<%= dirs.dist %>/"],
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
		
		imagemin: {
			dist: {
				files: [{
	                expand: true,
					cwd: "<%= dirs.dest %>/",
	                dest: "<%= dirs.dest %>/",
	                src: "**/*.{png,jpg,gif}"
				}]
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
		"useminPrepare",
		"copy",
		"concat",
		"sass",
		"uncss",
		"cssmin",
		"uglify",
		"filerev",
		"imagemin",
		"usemin",
		"htmlmin:dist"
	]);

	grunt.registerTask("dev", [
		"git-describe",
		"jekyll",
		"useminPrepare",
		"copy",
		"concat",
		"sass",
		"filerev",
		"usemin"
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
