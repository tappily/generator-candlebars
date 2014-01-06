module.exports = function (grunt) {
    'use strict';

    require('load-grunt-tasks')(grunt);

    grunt.loadNpmTasks('assemble');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        assemble: {
            options: {
                assets: 'dist/<%%= pkg.name %>/asset',
                data: ['bower.json'],
                layoutdir: 'src/template/layout',
                partials: 'src/template/partial/*.hbs'
            },
            dist: {
                options: {
                    data: ['src/data/**/*.json'],
                    layout: 'default.hbs',
                    flatten: true
                },
                files: {
                    'dist/<%%= pkg.name %>/': ['src/template/page/*.hbs']
                }
            }
        },
        autoprefixer: {
            dist: {
                src: 'dist/css/*.css'
            }
        },
        bower: {
            all: {
                options: {
                    exclude: ['normalize-css']
                },
                rjsConfig: 'src/js/config.js'
            }
        },
        clean: {
            dist: ['dist']
        },
        connect: {
            app: {
                options: {
                    base: ['dist/<%%= pkg.name %>'],
                    livereload: true,
                    open: true
                }
            }
        },
        copy: {
            js: {
                files: [
                    {
                        expand: true,
                        cwd: 'dist/',
                        src: ['js/**'],
                        dest: 'dist/<%%= pkg.name %>/asset/',
                        filter: 'isFile'
                    }
                ]
            },
            css: {
                files: [
                    {
                        expand: true,
                        cwd: 'dist/',
                        src: ['css/**'],
                        dest: 'dist/<%%= pkg.name %>/asset/',
                        filter: 'isFile'
                    }
                ]
            },
            img: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/asset',
                        src: ['img/**'],
                        dest: 'dist/<%%= pkg.name %>/asset/',
                        filter: 'isFile'
                    }
                ]
            }
        },
        'gh-pages': {
            options: {
                base: 'dist/<%%= pkg.name %>'
            },
            src: '**/*'
        },
        jshint: {
            options: {
                jshintrc: true
            },
            configurations: ['Gruntfile.js', 'bower.json', 'package.json'],
            sources: {
                options: {
                    jshintrc: '.jshintrc'
                },
                files: {
                    src: ['src/js/**/*.js']
                }
            }
        },
        less: {
            develop: {
                options: {
                    strictUnits: true,
                    strictMath: true
                },
                files: {
                    'dist/css/<%%= pkg.name %>.css': 'src/less/main.less'
                }
            }
        },
        lesslint: {
            options: {
                formatters: [
                    {
                        id: 'csslint-xml',
                        dest: 'report/lesslint.xml'
                    }
                ]
            },
            main: {
                src: ['src/less/main.less']
            }
        },
        requirejs: {
            options: {
                baseUrl: 'src/js',
                locale: 'en-us',
                mainConfigFile: 'src/js/config.js',
                name: 'almond'
            },
            combine: {
                options: {
                    optimize: 'none',
                    include: ['main'],
                    out: 'dist/js/<%%= pkg.name %>.js'
                }
            }
        },
        watch: {
            assets: {
                files: ['dist/<%%= pkg.name %>/asset/**'],
                options: {
                    livereload: true
                }
            },
            less: {
                files: 'src/less/**/*.less',
                tasks: ['lesslint', 'less', 'autoprefixer', 'copy:css']
            },
            js: {
                files: ['src/js/**/*.js'],
                tasks: ['requirejs:combine', 'copy:js']
            },
            template: {
                files: ['src/template/**/*.hbs'],
                tasks: ['requirejs:combine', 'assemble', 'copy']
            }
        }
    });

    grunt.registerTask('build', ['clean', 'jshint', 'less', 'autoprefixer', 'requirejs', 'assemble', 'copy']);

    grunt.registerTask('live', ['build', 'connect:app', 'watch']);

    grunt.registerTask('deploy', ['build', 'gh-pages']);
};