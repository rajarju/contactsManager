define([
	'jquery',
	'underscore',
	'backbone',

    'views/contact/contact',

    'collections/contacts',



    ], function($, _, Backbone, ContactView, Directory){

    //Directory View
    //View for list of contacts
    var DirectoryView = Backbone.View.extend({
        //Parent element or the container for this view
        el: $('#contacts'),
        //Initialize function
        initialize: function(){
            //Create new collection with the contacts 
            this.collection = new Directory();

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

            this.collection.on('remove', this.resetFilters, this);

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
                if(type !== undefined){
                  return type.toLowerCase();
              }
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
                if(item !== undefined){
                   var option = $('<option>', {
                      value : item.toLowerCase(),
                      text: item.toLowerCase()
                  }).appendTo(select);
               }
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
            	Backbone.history.navigate('filter/all');
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
                    Backbone.history.navigate('filter/' + filterType);
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
                this.collection.addContact(newModel); 
                //Remove the select list and add a new updated one
                this.$el.find('#filter').find('select').remove().end().append(this.createSelect());
            }
            else{
                //Add the new entry
                this.collection.addContact(newModel); 
            }

        }
    });

return DirectoryView;
});

