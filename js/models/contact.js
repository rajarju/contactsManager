define([
	'underscore',
	'backbone'
	], function(_, Backbone){
		//Contact model
		//Model for individual contacts
		var Contact = Backbone.Model.extend({
			defaults: {
				photo: "img/default.jpg"
			},

			initialize: function(){

				this.on('destroy', this.removeContact, this);

			},


			removeContact: function(contact){
				console.log(contact);
			}

		});

		return Contact;
});


