// ReplyView.js
// -------
define(["jquery", "backbone", "mustache", "text!templates/trulyAnswer/Ask.html", "models/Question", "models/UserAnswer", "text!templates/trulyAnswer/UserAnswer.html"],

    function ($, Backbone, Mustache, template, Question, UserAnswer, UserAnswerTemplate) {

        var AskView = Backbone.View.extend({

            // The DOM Element associated with this view
            el: "#stage",

            // View constructor
            initialize: function (options) {
                this.user = options.user;
                var self = this;
                this.question = new Question({ shareCode: options.shareCode, questionTypeId: 1, userId: this.user.get("userId") });
                this.question.fetchByShareCode(
                    {
                        success: function (data) {
                            if (data.userId == options.user.get("userId")) {
                                Backbone.history.navigate("trulyAnswer/reply/" + options.shareCode, { trigger: true, replace: true });
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

                this.$el.html(Mustache.render(template, this.question.toJSON(), { userAnswer: UserAnswerTemplate }));

                // Maintains chainability
                return this;
            },



            ask: function () {
                this.userAnswerText = this.$el.find("#newUserAnswer").val();
                var self = this;
                var ask = new UserAnswer({
                    "userId": this.user.get("userId"),
                    "questionTypeId" : this.question.get("questionTypeId"),
                    "questionShareCode": this.question.get("shareCode"),
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