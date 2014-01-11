require(['jquery', 'welcome/model', 'welcome/view', 'welcome'],
    function ($, Model, view, Control) {
        'use strict';
        $(function () {
            new Control('[data-host]', {
                model: new Model(),
                view: view
            }).greet();
        });
    });