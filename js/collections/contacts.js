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
                    
                });


                this.on('add', function(item){                
                    //Temp save in contacts array            
                    contacts.push(item.attributes);
                });
                //On remove of an item
                this.on('remove', function(item){
                  
                });

            },

            addContact: function(newModel){
                this.add(new ContactModel(newModel)); 
            }

        });      
    return Directory;

});


