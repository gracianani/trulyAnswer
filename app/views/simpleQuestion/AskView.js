// ReplyView.js
// -------
define(["jquery", "backbone", "mustache", "text!templates/SimpleQuestion/Ask.html", "models/Question", "models/UserAnswer"],

    function ($, Backbone, Mustache, template, Question, UserAnswer) {

        var AskView = Backbone.View.extend({

            // The DOM Element associated with this view
            el: "#stage",

            // View constructor
            initialize: function (options) {
                this.user = options.user;
                var self = this;
                this.question = new Question({ shareCode: options.shareCode, questionTypeId: 3, userId: this.user.get("userId") });
                this.question.fetchByShareCode(
                    {
                        success: function (data) {
                            if (data.userId == options.user.get("userId")) {
                                Backbone.history.navigate("#/simpleQuestion/report/" + options.shareCode, { trigger: true, replace: true });
                            }
                            else {
                                self.question.set(data);
                            }
                        },
                        error: function (msg) {
                            alert(msg);
                        }
                    }
                );
                this.listenTo(this.question, "change", this.render);
            },

            // View Event Handlers
            events: {
                "click #ask": "ask"
            },

            appendAnswer: function (data) {
                this.$el.find("#userAnswerWrapper").append(Mustache.render(UserAnswerTemplate, data));
            },

            // Renders the view's template to the UI
            render: function () {

                this.$el.html(Mustache.render(template, this.question.toJSON() ));

                // Maintains chainability
                return this;
            },



            ask: function () {
                this.userAnswerText = this.$el.find("#newUserAnswer").val();
                var self = this;
                var ask = new UserAnswer({
                    "userId": this.user.get("userId"),
                    "questionId": this.question.get("questionId"),
                    "userAnswerText": this.userAnswerText
                });
                ask.addAnswer({
                    success: function (data) {
                        self.question.get("userAnswers").push(data);
                        self.appendAnswer(data);
                    },
                    error: function (msg) {
                        alert(msg);
                    }
                });
            }

        });

        // Returns the View class
        return AskView;
    }

);