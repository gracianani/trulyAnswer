// StartView.js
// -------
define(["jquery", "backbone", "mustache", "text!templates/simpleQuestion/Start.html", "models/Question"],

    function ($, Backbone, Mustache, template, Question) {

        var StartView = Backbone.View.extend({

            // The DOM Element associated with this view
            el: "#stage",

            // View constructor
            initialize: function (options) {
                this.user = options.user;

                if (this.user.get("isLogin") === true) {
                    this.render();
                }

                this.listenTo(this.user, "change", this.render);
            },

            // View Event Handlers
            events: {

                "click #confirmAndAsk": "shareOnCircle",
                "click .tips": "fillQuestion"

            },

            // Renders the view's template to the UI
            render: function () {

                // Dynamically updates the UI with the view's template
                this.$el.html(Mustache.render(template));

                // Maintains chainability
                return this;
            },

            shareOnCircle: function () {
                this.question = new Question({ "questionTypeId": 3, "userId": this.user.get("userId"), "questionText": this.$el.find("#yourQuestion").html() });
                var expiresIn = $("#validThrough").val();
                this.question.set("expiresIn", expiresIn);
                this.question.addQuestion({
                    success: function (data) {
                        Backbone.history.navigate("#/simpleQuestion/report/" + data.shareCode, { trigger: true, replace: true });
                    },
                    error: function (msg) {
                        alert(msg);
                    }
                });
            },

            fillQuestion: function (event) {
                this.$el.find("#yourQuestion").html($(event.target).html());
            }

        });

        // Returns the View class
        return StartView;
    }

);