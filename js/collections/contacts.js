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

                this.contacts = [];
                if(window.localStorage.getItem('contacts') === null){
                    window.localStorage.setItem('contacts', JSON.stringify([]));                    
                }           

                this.pull();
                
                this.populate();

                this.on('reset', function(){

                });

                this.on('add', function(item){                
                    //Temp save in contacts array            
                    this.contacts.push(item.attributes);
                    this.push();
                });
                //On remove of an item
                this.on('remove', function(item){

                    var removed = item.attributes;

                    //Remove the item from the array
                    _.each(this.contacts, function (contact) {
                        if (_.isEqual(contact, removed)) {
                            this.contacts.splice(_.indexOf(this.contacts, contact), 1);
                        }
                    }, this);

                    this.push();
                });

            },

            push: function(){
                window.localStorage.setItem('contacts', JSON.stringify(this.contacts));
            },

            pull: function(){
                this.contacts = JSON.parse(window.localStorage.getItem('contacts'));
            },

            populate: function(){   
                _.each(this.contacts, function(contact){
                    this.addContact(contact);
                }, this);

            },

            addContact: function(newModel){
                this.add(new ContactModel(newModel)); 
            }

        });      
return Directory;

});


