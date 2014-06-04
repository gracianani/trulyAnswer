// ReplyView.js
// -------
define(["jquery", "backbone", "mustache", "text!templates/trulyAnswer/Ask.html", "models/Question", "models/UserAnswer", "text!templates/trulyAnswer/UserAnswer.html", "views/trulyAnswer/Configs", "Utils"],
    function ($, Backbone, Mustache, template, Question, UserAnswer, UserAnswerTemplate, Configs, Utils) {
        
        var AskView = Backbone.View.extend({

            // The DOM Element associated with this view
            el: "#stage",

            // View constructor
            initialize: function (options) {
                this.user = options.user;
                this.shareCode = options.shareCode;
                var self = this;
                
                this.listenTo(this, "render", this.postRender);
                
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
                                self.question.set({
                                    "QuestionTips": Utils.shufferArray(Configs.QuestionTips)
                                });
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
                "click .btn-share": "showShareOverlay",
                "click .restart" : "onTapRestart"
            },

            appendAnswer: function (data) {
                this.$el.find("#userAnswerWrapper").append(Mustache.render(UserAnswerTemplate, data));
            },

            // Renders the view's template to the UI
            render: function () {
                this.beforeRender();
                this.$el.html(Mustache.render(template, this.question.toJSON(), { userAnswer: UserAnswerTemplate }));
                
                this.trigger("render");
                
                // Maintains chainability
                return this;
            },
            postRender: function() {
                var titleText = Utils.getRandomItemFromArray(Configs.titleTexts);
                var descText = Utils.getRandomItemFromArray(Configs.descTexts);
                
                shareInfo.title = titleText.titleBefore + this.question.get("userName") + titleText.titleAfter;
                shareInfo.desc =  descText.descBefore + this.question.get("expiresIn") + descText.descAfter;
                shareInfo.shareTimelineTitle = shareInfo.title + shareInfo.desc;
                shareInfo.link = window.location.href;
                
                if ( ! titleText.useDefaultImg ) {
                    shareInfo.img_url = this.question.get("headImageUrl");
                }
                this.startCountDown();
            },
            beforeRender: function() {
                var remainingTime = this.question.get("ExpiresInSeconds");
                if ( remainingTime && remainingTime > 0 ) {
                    this.question.set("isExpired", false );
                } else {
                    this.question.set("isExpired", true );
                }
                if ( this.question.get("isExpired") && this.question.get("numOfQuestionsToAnswer") < 1 ) {
                    this.question.set("isFinished", true );
                } else {
                    this.question.set("isFinished", false );

                }
            },
            onTapATip: function(e) {
                e.preventDefault();
                e.stopPropagation();
                this.$el.find("#newUserAnswer").val( $(e.currentTarget).text() );
                this.$el.find("#btnAsk").focus();
            },
            showShareOverlay: function(e) {
                e.preventDefault();
                e.stopPropagation();
                var self = this;
                $('#stage').addClass("blur"); 
                $('.overlay').fadeIn();  
                $('.overlay').click(function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    $('.overlay').hide();
                    $('#stage').removeClass("blur"); 
                });
            },
            ask: function (e) {
                e.preventDefault();
                e.stopPropagation();
                
                if( !$(e.currentTarget).hasClass("disabled") ) {
                
                    $(e.currentTarget).addClass("disabled");
                    if ( this.validateInput() ) {
                        this.submitAnswer();
                    } else {
                        alert("请输入问题");
                        $(e.currentTarget).removeClass("disabled");
                    }                    
                }

                
                
            },
            onTapRestart: function(ev) {
                ev.preventDefault();
                ev.stopPropagation();
                Backbone.history.navigate("", { trigger: false, replace: false });
                window.location.reload();
            },
            submitAnswer: function() {
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
                            console.log(data);
                            if ( data.answerId ) {
                                self.question.get("userAnswers").push(data);
                                window.location.reload();
                            } else {
                                alert("提交失败，请稍候重试");
                            }
                            
                        },
                        error: function (msg) {
                            alert(msg);
                        }
                    });
                }
            },
            startCountDown: function() {
                var self = this;
                var $remainingTimeEl = this.$el.find("#remainingTime");
                var remainingTime = this.question.get("ExpiresInSeconds");
                var timer;
                
                if ( this.question.get("isExpired") ) {
                    timer = setInterval(function(){
                        remainingTime --;
                        $remainingTimeEl.text(remainingTime);
                    }, 1000);
                }
            },
            validateInput: function() {
                var self = this;
                var input =  this.$el.find("#newUserAnswer").val();

                if ( input && input.length > 0 ) {
                    return true;
                } else {
                    return false;
                }
            }

        });

        // Returns the View class
        return AskView;
    }

);