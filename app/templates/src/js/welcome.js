define(['jquery', 'welcome/model/salutation', 'welcome/view/salutation', 'welcome/control/host'], function($, Model, view, Control) {
    'use strict';
    $(function() {
        new Control('[data-host]', {
            model: new Model(),
            view: view
        }).greet();
    });
});