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

                if (this.user.get("isFetchSuccess") === true) {
                    this.loadQuestion(options);
                } else {
                    this.listenTo(this.user, "onFetchSuccess", function () {
                        self.loadQuestion(options);
                    });
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
                            self.render();
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
                var reply = new UserAnswer({ "questionShareCode": this.question.get("shareCode"), "questionTypeId" : 1, "userId": this.user.get("userId"), "repliedToUserAnswerId": repliedToUserAnswerId, "userAnswerText": userAnswerText });
                reply.addReply({
                    success: function (data) {
                        window.location.reload();
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