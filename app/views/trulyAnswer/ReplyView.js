// ReplyView.js
// -------
define(["jquery", "backbone", "mustache", "text!templates/trulyAnswer/Reply.html", "models/Question", "models/UserAnswer", "views/trulyAnswer/Configs", "Utils"],

    function ($, Backbone, Mustache, template, Question, UserAnswer, Configs, Utils) {

        var ReplyView = Backbone.View.extend({

            // The DOM Element associated with this view
            el: "#stage",

            // View constructor
            initialize: function (options) {
                var self = this;
                this.user = options.user;

                this.listenTo(this, "render", this.postRender);
                
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
                "click .reply": "reply",
                "click .unreplied":"onTapUserAnswer"
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
                this.trigger("render");
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
            },
            postRender: function() {
                var titleText = Utils.getRandomItemFromArray(Configs.titleTexts);
                var descText = Utils.getRandomItemFromArray(Configs.descTexts);
                
                shareInfo.title = titleText.titleBefore + this.user.get("userName") + titleText.titleAfter;
                shareInfo.desc =  descText.descBefore + this.question.get("expiresIn") + descText.descAfter;
                shareInfo.shareTimelineTitle = shareInfo.title + shareInfo.desc;
                shareInfo.link = window.location.href;
                
                if ( ! titleText.useDefaultImg ) {
                    shareInfo.img_url = this.user.get("headImageUrl");
                }
                this.startCountDown();
            },
            startCountDown: function() {
                var self = this;
                var $remainingTimeEl = this.$el.find("#remainingTime");
                var remainingTime = this.question.get("remainingTime");
                var timer;
                
                if ( remainingTime && remainingTime > 0 ) {
                    timer = setInterval(function(){
                        remainingTime --;
                        $remainingTimeEl.text(remainingTime);
                    }, 1000);
                }
            },
            onTapUserAnswer: function(ev) {
                ev.preventDefault();
                ev.stopPropagation();
                $answerEl = $(ev.currentTarget);
                this.$el.find(".comment-reply-form.current").removeClass("current").addClass("hidden");
                this.$el.find(".comment-waiting.hidden").removeClass("hidden");
                
                $answerEl.find(".comment-waiting").addClass("hidden");
                $answerEl.find(".comment-reply-form").removeClass("hidden").addClass("current");
            }

        });

        // Returns the View class
        return ReplyView;
    }

);