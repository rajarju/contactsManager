define([
	'underscore',
	'backbone'
	], function(_, Backbone){
		//Contact model
		//Model for individual contacts
		var Contact = Backbone.Model.extend({
			defaults: {
				photo: "img/default.jpg"
			}
		});

		return Contact;
});


