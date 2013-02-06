define([
	'jquery',
	'underscore',
	'backbone',
	//'views/contact/contact',
	'views/contact/directory'
	], function($, _, Backbone, ContactView, DirectoryView){

		var AppRouter  = Backbone.Router.extend({
			routes: {
				"filter/:type" : "urlFilter"
			}
		});

		var initialize = function(){
			var app_router = new AppRouter();

			app_router.on('urlFilter', function(type){
				directory.filterType = type;
				directory.trigger('change:filterType');
			});

			var directory = new DirectoryView();
			//var contactsRouter = new ContactsRouter();
			Backbone.History.start();

		};
		return {
			initialize: initialize
		}
	});
