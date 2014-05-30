// ReplyView.js
// -------
define(["jquery", "backbone", "mustache", "text!templates/trulyAnswer/Reply.html", "models/Question", "models/UserAnswer"],

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
                            Backbone.history.navigate("trulyAnswer/ask/" + options.shareCode, { trigger: true, replace: true });
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
            },

            reply: function (e) {
                var repliedToUserAnswerId = $(e.target).data("useranswerid");
                var userAnswerText = $(e.target).prev("textarea").val();
                var reply = new UserAnswer({ "questionId": this.question.get("questionId"), "userId": this.user.get("userId"), "repliedToUserAnswerId": repliedToUserAnswerId, "userAnswerText": userAnswerText });
                reply.addReply({
                    success: function (data) {
                        alert("replied");
                    },
                    error: function (msg) {
                        alert(msg);
                    }
                });
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
        return ReplyView;
    }

);