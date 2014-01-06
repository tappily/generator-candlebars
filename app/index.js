'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');


var CandlebarsGenerator = module.exports = function CandlebarsGenerator(args, options, config) {
    yeoman.generators.Base.apply(this, arguments);

    this.on('end', function () {
        this.installDependencies({ skipInstall: options['skip-install'] });
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
            name: 'gitUser',
            message: 'What is your GitHub user name?'
        },
        {
            name: 'appName',
            message: 'What do you want to call your application?'
        },
        {
            name: 'appDescription',
            message: 'What will your application do?'
        }
    ];

    this.prompt(prompts, function (props) {
        this.appName = props.appName;
        this.appDescription = props.appDescription;
        this.gitUser = props.gitUser;

        cb();
    }.bind(this));
};

CandlebarsGenerator.prototype.app = function app() {
    this.template('Gruntfile.js', 'Gruntfile.js');
    //this.mkdir('app');
    //this.mkdir('app/templates');

    this.copy('_package.json', 'package.json');
    this.copy('_bower.json', 'bower.json');
};

CandlebarsGenerator.prototype.projectfiles = function projectfiles() {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
};

CandlebarsGenerator.prototype.sources = function sources() {
    this.mkdir('src/asset');
    this.copy('src/data/app.json', 'src/data/app.json');
    this.copy('src/js/main.js', 'src/js/main.js');
    this.copy('src/js/config.js', 'src/js/config.js');
    this.copy('src/less/main.less', 'src/less/main.less');
    this.copy('src/less/welcome.less', 'src/less/welcome.less');
    this.copy('src/template/layout/default.hbs', 'src/template/layout/default.hbs');
    this.copy('src/template/page/index.hbs', 'src/template/page/index.hbs');
    this.copy('src/template/partial/header.hbs', 'src/template/partial/header.hbs');
    this.copy('src/template/partial/salutation.hbs', 'src/template/partial/salutation.hbs');
};

CandlebarsGenerator.prototype.welcome = function welcome() {
    this.copy('src/js/welcome.js', 'src/js/welcome.js');
    this.copy('src/js/welcome/control/host.js', 'src/js/welcome/control/host.js');
    this.copy('src/js/welcome/model/salutation.js', 'src/js/welcome/model/salutation.js');
    this.copy('src/js/welcome/view/salutation.js', 'src/js/welcome/view/salutation.js');
    this.copy('src/js/nls/salutation.js', 'src/js/nls/salutation.js');
    this.copy('src/js/nls/en-us/salutation.js', 'src/js/nls/en-us/salutation.js');
    this.copy('src/js/nls/fr-fr/salutation.js', 'src/js/nls/fr-fr/salutation.js');
};

CandlebarsGenerator.prototype.runtime = function runtime() {
    this.copy('gitignore', '.gitignore');
};
