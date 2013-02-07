define([
    'jquery',
    'underscore',
    'backbone',
    'router' // This calls router.js
    ], function($, _, Backbone, Router){
            var initialize = function(){                

                Router.initialize();
            }

            return {
                initialize: initialize
            };
        });
