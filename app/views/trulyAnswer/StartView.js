// StartView.js
// -------
define(["jquery", "backbone", "mustache", "text!templates/trulyAnswer/Start.html", "text!templates/trulyAnswer/StartSuccess.html", "models/Question", "Utils", "views/trulyAnswer/Configs"],

    function ($, Backbone, Mustache, template, successTemplate, Question, Utils, Configs) {

        var StartView = Backbone.View.extend({

            // The DOM Element associated with this view
            el: "#stage",

            // View constructor
            initialize: function (options) {
                this.user = options.user;
                this.listenTo(this, "render", this.postRender);
                if (this.user.get("isFetchSuccess") === true) {
                    this.render();
                } else {
                    this.listenTo(this.user, "onFetchSuccess", this.render);
                }

            },

            // View Event Handlers
            events: {
                
                "click #confirmAndAsk": "shareOnCircle",
                "click #shareOnCircle": "showShareOverlay",
                "click #validThrough": "onFocusInput",
                "blur #validThrough": "onBlurInput"

            },

            // Renders the view's template to the UI
            render: function () {
                this.beforeRender();
                // Dynamically updates the UI with the view's template
                this.$el.html(Mustache.render(template, this.user.toJSON()));
                this.trigger("render");
                // Maintains chainability
                return this;
            },
            postRender: function () {
                shareInfo.title = this.user.get("userName") + ":" + shareInfo.title;
                shareInfo.shareTimelineTitle = this.user.get("userName") + ":"  + shareInfo.shareTimelineTitle;
                shareInfo.img_url = this.user.get("headImageUrl");
                _hmt.push(['_trackPageview', "/start"]);
            },
            beforeRender: function() {
                var sex = this.user.get("sex");
                var subscribe = this.user.get("subscribe");
                
                if ( sex === 1 ) {
                    this.user.set("isMale", true);
                } else {
                    this.user.set("isMale", false);
                }
                
                if ( subscribe === 0 ) {
                    this.user.set("isSubscribe", false);
                } else {
                    this.user.set("isSubscribe", true);
                }
            },
            showSuccessInfo: function() {
                var titleText = Utils.getRandomItemFromArray(Configs.titleTexts);
                var descText = Utils.getRandomItemFromArray(Configs.descTexts);
                
                shareInfo.title = titleText.titleBefore + this.user.get("userName") + titleText.titleAfter;
                shareInfo.desc = descText.descBefore + this.question.get("expiresIn") + descText.descAfter;
                shareInfo.shareTimelineTitle = shareInfo.title + shareInfo.desc;
                shareInfo.link = window.location.href;

                this.$el.find("#startContent").html(Mustache.render(successTemplate, this.user.toJSON()));
            },
            showShareOverlay: function () {
                var self = this;
                $('#stage').addClass("blur");
                $('.overlay').fadeIn();
                $('.overlay').click(function (e) {
                    $('.overlay').hide();
                    $('#stage').removeClass("blur"); 
                    
                    window.location.reload();

                });
            },
            validateInput: function() {
                var input = parseInt(this.$el.find("#validThrough").val());
                if ( input && !isNaN(input) && input > 0 && input < 49) {
                    return true;
                } else {
                    return false;
                }
                
            },
            onFocusInput: function(ev) {
                this.$el.find(".form-group").removeClass("has-error");
                this.$el.find(".control-label").text("我承诺在以下时间内，朋友问我什么我都回答");
            },
            onBlurInput: function(ev) {
                
            },
            startActivity: function() {
                var self = this;
                this.question = new Question({ "questionTypeId": 1, "userId": this.user.get("userId"), "questionText": "有问必答" });
                var expiresIn = $("#validThrough").val();
                this.question.set("expiresIn", expiresIn);
                this.question.addQuestion({
                    success: function (data) {                   
                        self.shareCode = data.shareCode;
                        Backbone.history.navigate("trulyAnswer/reply/" + data.shareCode, { trigger: false, replace: true });
                        self.showShareOverlay();
                        //self.showSuccessInfo();
    
                },
                error: function (msg) {

                        alert(msg);
                }
                });                
            },
            shareOnCircle: function (ev) {
                if ( !$(ev.currentTarget).hasClass("disabled") ) {
                    
                    $(ev.currentTarget).addClass("disabled");
                    var self = this;
                    if ( this.validateInput() ) {
                        this.startActivity();
                    } else {
                        this.$el.find(".form-group").addClass("has-error");
                        this.$el.find(".control-label").text("请输入1-48以内的数字");
                        $("#confirmAndAsk").removeClass("disabled");
                    }
                
                }
            }

        });

        // Returns the View class
        return StartView;
    }

);