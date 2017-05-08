module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        babel: {
          options: {
            sourceMap: true,
            presets: ['es2015']
          },
          dist: {
            files: {
              'js/projects.dist.js' : 'js/projects.js'
            }
          }
        },
        uglify: {
            main: {
                src: 'js/clean-blog.js',
                dest: 'js/clean-blog.min.js'
            },
            projects: {
              src: 'js/projects.dist.js',
              dest: 'js/projects.min.js'
            },
        },
        less: {
            expanded: {
                options: {
                    paths: ["css"]
                },
                files: {
                    "css/clean-blog.css": "less/clean-blog.less"
                }
            },
            minified: {
                options: {
                    paths: ["css"],
                    cleancss: true
                },
                files: {
                    "css/clean-blog.min.css": "less/clean-blog.less"
                }
            }
        },
        banner: '/*!\n' +
            ' * <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
            ' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n' +
            ' */\n',
        usebanner: {
            dist: {
                options: {
                    position: 'top',
                    banner: '<%= banner %>'
                },
                files: {
                    src: ['css/clean-blog.css', 'css/clean-blog.min.css', 'js/clean-blog.min.js']
                }
            }
        },
        watch: {
            scripts: {
                files: ['js/clean-blog.js'],
                tasks: ['uglify'],
                options: {
                    spawn: false,
                },
            },
            less: {
                files: ['less/*.less'],
                tasks: ['less'],
                options: {
                    spawn: false,
                }
            },
        },
    });

    // Load the plugins.
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-banner');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', ['babel', 'uglify', 'less', 'usebanner']);

};
