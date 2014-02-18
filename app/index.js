'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');


var CandlebarsGenerator = module.exports = function CandlebarsGenerator(args, options, config) {
    yeoman.generators.Base.apply(this, arguments);

    this.on('end', function () {
        this.installDependencies({
            skipInstall: options['skip-install'],
            callback: function () {
                this.emit('dependenciesInstalled');
            }.bind(this)
        });
    });

    this.on('dependenciesInstalled', function () {
        this.spawnCommand('grunt', ['bower']);
    });

    this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(CandlebarsGenerator, yeoman.generators.Base);

CandlebarsGenerator.prototype.askFor = function askFor() {
    var cb = this.async();

    // have Yeoman greet the user.
    console.log(this.yeoman);

    var prompts = [
        {
            name: 'appName',
            message: 'Application name?'
        },
        {
            name: 'appDescription',
            message: 'Description?'
        },
        {
            name: 'features',
            message: 'Features?',
            type: 'checkbox',
            choices: [
                {
                    name: 'Demo setup',
                    value: 'installDemo',
                    checked: true
                },
                {
                    name: 'jQuery',
                    value: 'installJQuery',
                    checked: true
                },
                {
                    name: 'jQuery ++',
                    value: 'installJQueryPP',
                    checked: true
                },
                {
                    name: 'Flexbox grid',
                    value: 'installFlexBoxGrid',
                    checked: true
                },
                {
                    name: 'Normalize css',
                    value: 'installNormalize',
                    checked: true
                },
                {
                    name: 'Typekit',
                    value: 'installTypekit',
                    checked: true
                }
            ]
        },
        {
            name: 'git',
            message: 'Version control?',
            type: 'list',
            choices: [
                {
                    name: 'GitHub',
                    value: 'https://github.com',
                    default: true
                },
                {
                    name: 'Git'
                },
                {
                    name: 'none'
                }
            ]
        },
        {
            when: function (answers) {
                return (/Git/).test(answers.git);
            },
            name: 'git',
            message: 'Git server? (i.e., https://repo.org)'
        },
        {
            when: function (answers) {
                return !(/none/).test(answers.git);
            },
            name: 'gitUser',
            message: 'Username/organization?',
            default: this.user.git.username
        },
        {
            when: function (answers) {
                return answers.features.indexOf('installTypekit') > -1;
            },
            name: 'typekitId',
            message: 'Typekit ID?',
            default: 'wem0tgr'
        },
        {
            when: function (answers) {
                return answers.features.indexOf('installTypekit') > -1;
            },
            name: 'typekitFont',
            message: 'Typekit Font?',
            default: 'Le Havre Rounded'
        }
    ];

    this.prompt(prompts, function (props) {
        this.appTitle = this._.humanize(props.appName);
        this.appName = this._.slugify(props.appName);
        this.appDescription = this._.stripTags(props.appDescription);
        this.typekitId = this._.slugify(props.typekitId) || '';
        this.typekitFont = this._.slugify(props.typekitFont) || '';
        this.gitUser = this._.slugify(props.gitUser) || '';
        this.git = props.git || '';

        if (!(/none/).test(this.git) && this.appName && this.gitUser.length > 0) {
            this.gitHome = ''.concat(props.git, '/', this.gitUser, '/', this.appName);
            this.gitRepo = this.gitHome.concat('.git');
            this.gitBugs = this.gitHome.concat('/issues');

        } else {
            this.gitHome = this.gitRepo = this.gitBugs = '';
        }

        function setFeature(context, props, name) {
            context[name] = props.features.indexOf(name) > -1;
        }

        setFeature(this, props, 'installJasmine');
        setFeature(this, props, 'installTypekit');
        setFeature(this, props, 'installNormalize');
        setFeature(this, props, 'installFlexBoxGrid');
        setFeature(this, props, 'installCanJs');
        setFeature(this, props, 'installJQuery');
        setFeature(this, props, 'installJQueryPP');
        setFeature(this, props, 'installDemo');

        this.importInline = (this.installNormalize || this.installFlexBoxGrid);
        cb();
    }.bind(this));
};

CandlebarsGenerator.prototype.app = function app() {
    this.template('Gruntfile.js', 'Gruntfile.js');
    this.copy('_package.json', 'package.json');
    this.copy('_bower.json', 'bower.json');
};

CandlebarsGenerator.prototype.projectfiles = function projectfiles() {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
    this.copy('csslintrc', '.csslintrc');
};

CandlebarsGenerator.prototype.scripts = function scripts() {
    this.mkdir('src/asset');

    if(this.installTypekit) {
        this.copy('src/data/typekit.json', 'src/data/typekit.json');
        this.copy('src/less/utility/tk.less', 'src/less/utility/tk.less');
    }
    this.copy('src/data/index/data.json', 'src/data/index/data.json');

    this.copy('src/js/config.js', 'src/js/config.js');
    if(!this.installDemo) {
        this.copy('src/js/index.js', 'src/js/index.js');
    }
    this.copy('src/js/app.js', 'src/js/'.concat(this.appName, '.js'));
    this.mkdir('src/js/'.concat(this.appName));

    this.copy('src/less/index.less', 'src/less/index.less');
    this.copy('src/less/app.less', 'src/less/'.concat(this.appName, '.less'));
    this.copy('src/less/utility/config.less', 'src/less/utility/config.less');

    if(this.importInline) {
        this.copy('src/less/utility/inline.less', 'src/less/utility/inline.less');
    }

    this.bulkDirectory('src/template/layout', 'src/template/layout');
    this.bulkDirectory('src/template/page', 'src/template/page');
    this.copy('src/template/partial/footer.hbs', 'src/template/partial/footer.hbs');
    this.copy('src/template/partial/header.hbs', 'src/template/partial/header.hbs');
};

CandlebarsGenerator.prototype.demo = function welcome() {
    if (this.installDemo) {
        this.copy('src/less/demo.less', 'src/less/demo.less');
        this.copy('src/less/demo/text.less', 'src/less/demo/text.less');
        this.copy('src/less/demo/layout.less', 'src/less/demo/layout.less');

        this.copy('src/js/index-demo.js', 'src/js/index.js');
        this.copy('src/js/demo.js', 'src/js/demo.js');
        this.bulkDirectory('spec', 'spec');
        this.bulkDirectory('src/js/demo', 'src/js/demo');
        this.bulkDirectory('src/js/nls', 'src/js/nls');

        this.copy('src/template/partial/salutation.hbs', 'src/template/partial/salutation.hbs');
    }
};

CandlebarsGenerator.prototype.runtime = function runtime() {
    this.copy('gitignore', '.gitignore');
};
