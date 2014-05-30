// PrepareView.js
// -------
define(["jquery", "backbone", "mustache", "text!templates/Prepare.html"],

    function ($, Backbone, Mustache, template) {

        var PrepareView = Backbone.View.extend({

            el: "#stage",

            initialize: function (options) {

                this.listenTo(this, "render", this.postRender);
            },

            events: {
            },

            // Renders the view's template to the UI
            render: function () {
                this.$el.html(Mustache.render(template, {}));


                return this;

            }
        });

        // Returns the View class
        return PrepareView;
    }

);