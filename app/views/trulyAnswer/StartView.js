// StartView.js
// -------
define(["jquery", "backbone", "mustache", "text!templates/trulyAnswer/Start.html","text!templates/trulyAnswer/StartSuccess.html", "models/Question","Utils","views/trulyAnswer/Configs"],

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
                "click #shareOnCircle": "showShareOverlay"

            },

            // Renders the view's template to the UI
            render: function () {

                // Dynamically updates the UI with the view's template
                this.$el.html(Mustache.render(template, this.user.toJSON()));
                this.trigger("render");
                // Maintains chainability
                return this;
            },
            postRender: function() {
                shareInfo.title = this.user.get("userName") + ":" + shareInfo.title;
                shareInfo.shareTimelineTitle = this.user.get("userName") + ":"  + shareInfo.shareTimelineTitle;
            },
            showSuccessInfo: function() {
                var titleText = Utils.getRandomItemFromArray(Configs.titleTexts);
                var descText = Utils.getRandomItemFromArray(Configs.descTexts);
                
                shareInfo.title = titleText.titleBefore + this.user.get("userName") + titleText.titleAfter;
                shareInfo.desc =  descText.descBefore + this.question.get("expiresIn") + descText.descAfter;
                shareInfo.shareTimelineTitle = shareInfo.title + shareInfo.desc;
                shareInfo.link = window.location.href;
                
                if ( ! titleText.useDefaultImg ) {
                    shareInfo.img_url = this.user.get("headImageUrl");
                }
                
                this.$el.find("#startContent").html(Mustache.render(successTemplate, this.user.toJSON()));
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
            shareOnCircle: function () {
                var self = this;
                this.question = new Question({ "questionTypeId": 1, "userId": this.user.get("userId"), "questionText" : "有问必答" });
                var expiresIn = $("#validThrough").val();
                this.question.set("expiresIn", expiresIn);
                this.question.addQuestion({
                    success: function (data) {
             
                        self.showSuccessInfo();
                        self.shareCode = data.shareCode;
                        
                        Backbone.history.navigate("trulyAnswer/reply/" + data.shareCode, { trigger: false, replace: true });
                        

                    },
                    error: function (msg) {
                        alert(msg);
                    }
                });
            }

        });

        // Returns the View class
        return StartView;
    }

);