// Question.js

define(["jquery", "backbone","utils"],

    function ($, Backbone,Utils) {

        var Question = Backbone.Model.extend({

            idAttribute: "questionId",
            defaults: {
                "userAnswers":[],
                "getRandomColorWithoutVanilla": function(){
                    var ColorRepo = ["Cobalt", "Skyfall", "Aquamarine","Olive","Cash", "EmeraldSea", "Hopscotch","Lavender", "Burst", "Cupid","Peony", "Midnight"];
    
                    return Utils.getRandomItemFromArray(ColorRepo);
                },
                "getRandomIcon": function(){
                var IconRepo = ["bird", "bolt", "bone","bug","clove", "coffee", "droid","ghost", "heart", "icecream","jigsaw", "meow","outlet", "owl", "pinwheel","planet", "poo", "rocket","sailboat", "shirt","skull", "spade", "star","wine"];

                    return Utils.getRandomItemFromArray(IconRepo);
                }
            },
            initialize: function (options) {
                this.set({
                    "questionText": options.questionText,
                    "questionTypeId": options.questionTypeId,
                    "userId": options.userId,
                    "expiresIn": 3,
                    "shareCode": options.shareCode
                });

            },
            addQuestion: function (options) {
                var self = this;
                $.ajax({
                    url: "http://quiz.seemeloo.com/secretcnWebServices/secretService/Questions",
                    dataType: "json",
                    data: JSON.stringify({
                        userId: self.get("userId"),
                        questionTypeId: self.get("questionTypeId"),
                        questionText: self.get("questionText"),
                        expiresIn: self.get("expiresIn")
                    }),
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    success: function (data, textStatus, jqXHR) {
                        self.set(data);
                        options.success(data);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        options.error(textStatus + ": " + errorThrown);
                    }
                });
            },

            fetchByShareCode: function (options) {
                var self = this;
                $.ajax({
                    url: "http://quiz.seemeloo.com/secretcnWebServices/secretService/Questions/" + self.get("shareCode") + "/" + self.get("userId"),
                    dataType: "json",
                    type: "GET",
                    contentType: "application/json; charset=utf-8",
                    success: function (data, textStatus, jqXHR) {
                        console.log(data);
                        options.success(data);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        options.error(textStatus + ": " + errorThrown);
                    }
                });
            },
            calculateRemainingTime: function(){
                var expiresAt = Date.parse( this.get("expiresAt") );
                var now = (new Date()).getTime();
                var remainingTime = Math.floor( (expiresAt - now) / 1000 );
                if ( remainingTime && remainingTime > 0 ) {
                    remainingTime = 0;
                }
                this.set("remainingTime", remainingTime);
            }

        });

        return Question;
    }

);