module.exports = function (grunt) {
    'use strict';

    require('load-grunt-tasks')(grunt);

    grunt.loadNpmTasks('assemble');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        assemble: {
            options: {
                assets: '<%%= connect.app.options.base %>/asset',
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
                    '<%%= connect.app.options.base %>/': ['src/template/page/*.hbs']
                }
            }
        },
        autoprefixer: {
            less: {
                src: '.grunt/less/*.css',
                dest: 'dist/css/<%%= pkg.name %>.css'
            }
        },
        bower: {
            all: {
                options: {
                    exclude: ['normalize-css', 'flexboxgrid']
                },
                rjsConfig: 'src/js/config.js'
            }
        },
        clean: {
            temp: ['.grunt'],
            dist: ['dist']
        },
        connect: {
            options: {
                hostname: grunt.option('connect-hostname') || 'localhost'
            },
            app: {
                options: {
                    base: '.grunt/connect/<%%= pkg.name %>',
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
                        dest: '<%%= connect.app.options.base %>/asset/',
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
                        dest: '<%%= connect.app.options.base %>/asset/',
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
                        dest: '<%%= connect.app.options.base %>/asset/',
                        filter: 'isFile'
                    }
                ]
            }
        },
        'gh-pages': {
            options: {
                base: '<%%= connect.app.options.base %>'
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
            options: {
                strictUnits: true,
                strictMath: true
            },
            all: {
                files: {
                    '.grunt/less/all.css': 'src/less/index.less'
                }
            },
            app: {
                files: {
                    '.grunt/less/<%%= pkg.name %>.css': 'src/less/<%%= pkg.name %>.less'
                }
            },
            demo: {
                files: {
                    '.grunt/less/demo.css': 'src/less/demo.less'
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
            all: {
                src: ['src/less/index.less']
            },
            app: {
                src: ['src/less/<%%= pkg.name %>.less']
            },
            demo: {
                src: ['src/less/demo.less']
            }
        },
        release: {
            options: {
                file: 'bower.json'
            }
        },
        requirejs: {
            options: {
                baseUrl: 'src/js',
                locale: 'en-us',
                mainConfigFile: 'src/js/config.js',
                name: 'almond'
            },
            all: {
                options: {
                    optimize: 'none',
                    include: ['index'],
                    out: 'dist/js/index.js'
                }
            },
            app: {
                options: {
                    optimize: 'none',
                    include: ['<%%= pkg.name %>'],
                    out: 'dist/js/<%%= pkg.name %>.js'
                }
            },
            demo: {
                options: {
                    optimize: 'none',
                    include: ['demo'],
                    out: 'dist/js/demo.js'
                }
            }
        },
        watch: {
            assets: {
                files: ['<%%= assemble.options.assets %>/**'],
                options: {
                    livereload: true
                }
            },
            less: {
                files: 'src/less/**/*.less',
                tasks: ['lesslint', 'less:all', 'autoprefixer', 'copy:css']
            },
            js: {
                files: ['src/js/**/*.js'],
                tasks: ['requirejs:all', 'copy:js']
            },
            template: {
                files: ['src/template/**/*.hbs'],
                tasks: ['requirejs:all', 'assemble', 'copy']
            }
        }
    });

    grunt.registerTask('default', ['bower']);

    grunt.registerTask('test', ['jshint', 'lesslint:all']);

    grunt.registerTask('build', ['clean', 'jshint', 'lesslint:app', 'less:app', 'autoprefixer', 'requirejs:app']);

    grunt.registerTask('site', ['clean', 'jshint', 'lesslint:all', 'less:all', 'autoprefixer', 'requirejs:all', 'assemble', 'copy']);

    grunt.registerTask('live', ['site', 'connect:app', 'watch']);

    grunt.registerTask('deploy', ['site', 'gh-pages']);
};