$(function(){

    //Dummy Data
    var contacts = [
    { name: "Contact 1", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "family" },
    { name: "Contact 2", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "family" },
    { name: "Contact 3", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "friend" },
    { name: "Contact 4", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "colleague" },
    { name: "Contact 5", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "family" },
    { name: "Contact 6", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "colleague" },
    { name: "Contact 7", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "friend" },
    { name: "Contact 8", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "family" }
    ];

    //Contact model
    //Model for individual contacts
    var Contact = Backbone.Model.extend({
        defaults: {
            photo: "img/default.jpg"
        }
    });


    //Contacts collection
    //Collection of all contacts
    var Directory = Backbone.Collection.extend({
        //Linking the collection to themodel
        model: Contact,

        initialize: function(){
            this.on('reset', function(){
                console.log('resetting in collection');
            });


            this.on('add', function(item){                
                //Temp save in contacts array            
                contacts.push(item.attributes);
            });
            //On remove of an item
            this.on('remove', function(item){
                var removed = item.attributes;
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

    });


    //Contact view
    //View for individual contacts
    var ContactView = Backbone.View.extend({
        //Tag name for the element
        tagName: "article",
        //Events
        events: {
            "click button.delete" : "deleteContact"
        },
        //Classes for the element
        className: "contact-container",
        //Get template html, hidden in the html file
        //Inside a script tag
        template: $("#contactTemplate").html(),
        //Render function, called to generate the output html
        render: function(){
            //_.template takes html and returns a function
            //this function can be called passing the variables to generate output html            
            var tmpl = _.template(this.template);
            //JSON data from model is passed to the template function
            this.$el.html(tmpl(this.model.toJSON()));
            //return the View object, not the HTML
            return this;
        },
        //Remove a contact
        deleteContact : function(){

            //remove from contacts

            //Remove the model
            this.model.destroy();
            //Remove the view
            this.remove();

            directory.resetFilters();
        }
    });

    //Directory View
    //View for list of contacts
    var DirectoryView = Backbone.View.extend({
        //Parent element or the container for this view
        el: $('#contacts'),
        //Initialize function
        initialize: function(){
            //Create new collection with the contacts 
            this.collection = new Directory(contacts);
            //generate output
            this.render();
            //Reset and add filters to select list
            this.resetFilters();
            //Subscribe to custom event change folter type, bind it to a callback. Also setting the context to this
            this.on('change:filterType', this.filterByType, this);
            //Rerender the elements when the collection is reset            
            this.collection.on('reset', this.render, this);
            //Render newly added contact
            this.collection.on('add', this.renderContact, this);
            //On remove of item from collection
            //this.collection.on('remove', this.removeContact, this);
        },
        //Events
        events: {
            "change #filter select": 'setFilter',
            "submit #addContact" : "addContact"
        },

        //Render function for the Directory
        render: function(){
            var that = this;

            this.$el.find("article").remove();

            //loop through the contacts and generate html for each
            _.each(this.collection.models, function(item){
                //Call render function for each contact view
                that.renderContact(item);
            }, this);
        },
        //Method to generate output html for each Contact View item
        renderContact: function(item){
            //Generate a new contact view object for each model item
            var contactView = new ContactView({
                model: item,
            });
            //Append the output html from each Contact view to the parent element
            this.$el.append(contactView.render().el);
        },

        //Function which takes all type names from the address entry
        //Returns only the unique ones in lower case
        getTypes : function(){
            return _.uniq(this.collection.pluck('type'), false, function(type){
                return type.toLowerCase();
            });
        },

        resetFilters : function(){
            //Initialize the select filter
            this.$el.find('#filter').empty().append(this.createSelect());
        },

        //Append options to the select
        createSelect: function(){
            //Get the filter wrapper
            var filter = this.$el.find('#filter'),
            //Select element
            select = $('<select>', {
                html: '<option value="all">All</option>'
            });

            //Loop through the items and append options to the select element
            _.each(this.getTypes(), function(item){
                var option = $('<option>', {
                    value : item.toLowerCase(),
                    text: item.toLowerCase()
                }).appendTo(select);
            });
            //Return the select element
            return select;
        },

        //Select on change callback
        setFilter: function(e){
            this.filterType = e.currentTarget.value;
            this.trigger('change:filterType');
        },
        //Function to filter the contacts based on selected type
        filterByType: function(){
            //if type is all reset the view
            if(this.filterType == 'all'){
                this.collection.reset(contacts);
                contactsRouter.navigate('filter/all');
            }
            else{
                //Reset the view to show all the contacts before filtering
                //Silent attribute it set because, you dont want to trigger the reset event while doing this
                this.collection.reset(contacts, {silent: true});
                //Get the selected filter type
                var filterType = this.filterType,
                    //Generate the filtered array of contacts
                    filtered = _.filter(this.collection.models, function(item){
                        //Looping throught the collection models,
                        //Compare the type for each model element to the selected filter
                        return item.get('type').toLowerCase() === filterType;
                    });              
                    contactsRouter.navigate('filter/' + filterType);
                //Reset the contacts list with the filtered type names
                this.collection.reset(filtered);

            }
        },

        //Add new contact form callback
        addContact: function(e){
            //Prevent form submission
            e.preventDefault();
            //To hold new entry
            var newModel = {};
            //Get all the input values
            //Validate and sort them in an object
            $("#addContact").find("input").each(function (i, el) {
                if ($(el).val() !== "") {
                    newModel[el.id] = $(el).val();
                }
            });

            delete newModel['photo'];
            //Check if the type of contact is not already in the types list
            if(_.indexOf(this.getTypes(), newModel.type) === -1){
                //Add the new entry
                this.collection.add(new Contact(newModel)); 
                //Remove the select list and add a new updated one
                this.$el.find('#filter').find('select').remove().end().append(this.createSelect());
            }
            else{
                //Add the new entry
                this.collection.add(new Contact(newModel)); 
            }

        }
    });

var ContactsRouter = Backbone.Router.extend({
    routes: {
        "filter/:type" : "urlFilter"
    },
    urlFilter: function(type){
        directory.filterType = type;
        directory.trigger('change:filterType');
    }
});



var directory = new DirectoryView();
var contactsRouter = new ContactsRouter();
Backbone.history.start();
});