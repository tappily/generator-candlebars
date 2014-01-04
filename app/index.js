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
    this.mkdir('app');
    this.mkdir('app/templates');

    this.copy('_package.json', 'package.json');
    this.copy('_bower.json', 'bower.json');
};

CandlebarsGenerator.prototype.projectfiles = function projectfiles() {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
};
