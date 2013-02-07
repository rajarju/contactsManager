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

				window.contacts = [];
				if(window.localStorage.getItem('contacts') !== null){
					window.contacts = JSON.parse(window.localStorage.getItem('contacts'));
				}			
				else{
					window.localStorage.setItem('contacts', JSON.stringify([]));
				}

			},

			sync: function(){

			},

			removeContact: function(contactView){				
				var removed = this.attributes;

				//Remove the item from the array
				_.each(contacts, function (contact) {
					if (_.isEqual(contact, removed)) {
						contacts.splice(_.indexOf(contacts, contact), 1);
					}
				});

				this.destroy();
			}

		});

		return Contact;
	});


