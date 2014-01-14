define(['demo/model', 'demo/view', 'demo/control'], function (Model, view, Control) {
    'use strict';
    return new Control('h1', {
        model: new Model(),
        view: view
    });
});