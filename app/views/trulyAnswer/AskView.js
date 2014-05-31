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
                
                if (this.user.get("isFetchSuccess") === true) {
                    this.loadQuestion(options);
                } else {
                    this.listenTo(this.user, "onFetchSuccess", function(){
                        self.loadQuestion(options);
                    });
                }
                
            },
            loadQuestion: function(options) {
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
                                self.render();
                            }
                        },
                        error: function (msg) {
                            alert(msg);
                        }
                    }
                );                
            },
            // View Event Handlers
            events: {
                "click #btnAsk": "ask",
                "click .tips": "onTapATip",
                "click #remindUser": "showShareOverlay"
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
            onTapATip: function(e) {
                e.preventDefault();
                this.$el.find("#newUserAnswer").val( $(e.currentTarget).text() );
                this.$el.find("#newUserAnswer").focus();
            },
            showShareOverlay: function() {
                var self = this;
                $('#stage').addClass("blur"); 
                $('.overlay').fadeIn();  
                $('.overlay').click(function(e){
                    $('.overlay').hide();
                    $('#stage').removeClass("blur"); 
                });
            },
            ask: function () {
                this.userAnswerText = this.$el.find("#newUserAnswer").val();
                if ( this.userAnswerText && this.userAnswerText === "" ) {
                    
                } else {
                    var self = this;
                    var ask = new UserAnswer({
                        "userId": this.user.get("userId"),
                        "questionTypeId" : this.question.get("questionTypeId"),
                        "questionShareCode": this.question.get("shareCode"),
                        "userAnswerText": this.userAnswerText
                    });
                    ask.addAnswer({
                        success: function (data) {
                            console.log(self.question.get("userAnswers"));
                            self.question.get("userAnswers").push(data);
                            self.appendAnswer(data);
                        },
                        error: function (msg) {
                            alert(msg);
                        }
                    });
                }
                
                
            }

        });

        // Returns the View class
        return AskView;
    }

);