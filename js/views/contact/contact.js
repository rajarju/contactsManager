  define([
    'jquery',
    'underscore',
    'backbone',

    'text!templates/contact/contact.html'
    ], function($, _, Backbone, template){


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
        template: template,
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

  return ContactView;
});

