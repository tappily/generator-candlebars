define(['can/view/mustache', 'requirejs-text!../../template/partial/salutation.hbs'], function (can, template) {
    'use strict';
    return can.view.mustache(template);
});