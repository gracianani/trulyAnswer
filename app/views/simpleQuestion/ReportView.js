// ReportView.js
// -------
define(["jquery", "backbone", "mustache", "text!templates/simpleQuestion/Report.html", "models/Question", "models/UserAnswer"],

    function ($, Backbone, Mustache, template, Question, UserAnswer) {

        var ReplyView = Backbone.View.extend({

            // The DOM Element associated with this view
            el: "#stage",

            // View constructor
            initialize: function (options) {
                var self = this;
                this.user = options.user;
                if (!this.user.checkLogin()) {
                    this.user.login(options.shareCode);
                }
                else {
                    this.loadQuestion(options);
                    this.listenTo(this.question, "change", this.render);
                }
            },

            // View Event Handlers
            events: {
                "click .reply": "reply"
            },

            loadQuestion: function (options) {
                var self = this;
                this.question = new Question({ shareCode: options.shareCode, questionTypeId: 1, userId: this.user.get("userId") });
                this.question.fetchByShareCode({
                    success: function (data) {
                        if (data.userId != options.user.get("userId")) {
                            Backbone.history.navigate("simpleQuestion/ask/" + options.shareCode, { trigger: true, replace: true });
                        }
                        else {
                            self.question.set(data);
                        }
                    },
                    error: function (msg) {
                        alert(msg);
                    }
                });
            },
            // Renders the view's template to the UI
            render: function () {
                // Dynamically updates the UI with the view's template
                this.$el.html(Mustache.render(template, this.question.toJSON()));
                // Maintains chainability
                return this;
            }

        });

        // Returns the View class
        return ReplyView;
    }

);