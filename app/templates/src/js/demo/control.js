define(['can/control', 'requirejs-i18n!nls/salutation'], function(control, nl) {
    'use strict';
    return control.extend({

    }, {
        init: function() {
            this.element.append(this.options.view(this.options.model));
        },
        greet: function() {
            this.options.model.attr('salutation', nl.hi);
        }
    });
});