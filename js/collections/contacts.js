define([
    'underscore',
    'backbone',

    'models/contact'

    ], function(_, Backbone, ContactModel){

    //Contacts collection
        //Collection of all contacts
        var Directory = Backbone.Collection.extend({
            //Linking the collection to themodel
            model: ContactModel,

            initialize: function(){
                this.on('reset', function(){
                    console.log('resetting in collection');
                });


                this.on('add', function(item){                
                    //Temp save in contacts array            
                    contacts.push(item.attributes);
                });
                //On remove of an item
                this.model.on('destroy', function(model){
                    var removed = model.attributes;
                    if (removed.photo === "/img/placeholder.png") {
                        delete removed.photo;
                    }
                    //Find and remove item from the contacts array
                    _.each(contacts, function (contact) {
                        if (_.isEqual(contact, removed)) {
                            contacts.splice(_.indexOf(contacts, contact), 1);
                        }
                    });
                });

            },



            addContact: function(newModel){
                this.add(new ContactModel(newModel)); 
            }

        });      
    return Directory;

});


