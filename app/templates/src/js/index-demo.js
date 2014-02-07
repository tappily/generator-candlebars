require(['<%= appName %>', 'demo'], function (app, demo) {
    'use strict';
    console.log('loaded', app.id);
    demo.greet();
});