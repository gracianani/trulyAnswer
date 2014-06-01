// UserAnswer.js

define(["jquery", "backbone"],

    function ($, Backbone) {

        var UserAnswer = Backbone.Model.extend({

            initialize: function (options) {
                this.set({
                    userId: options.userId,
                    questionShareCode: options.questionShareCode,
                    questionTypeId: options.questionTypeId,
                    userAnswerText: options.userAnswerText,
                    repliedToUserAnswerId: options.repliedToUserAnswerId
                });
            },

            addAnswer: function (options) {
                var self = this;
                $.ajax({
                    url: "http://quiz.seemeloo.com/secretcnWebServices/secretService/UserAnswers",
                    dataType: "json",
                    data: JSON.stringify({
                        userId: self.get("userId"),
                        questionTypeId: self.get("questionTypeId"),
                        questionShareCode: self.get("questionShareCode"),
                        userAnswerText: self.get("userAnswerText")
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

            addReply: function (options) {
                var self = this;
                $.ajax({
                    url: "http://quiz.seemeloo.com/secretcnWebServices/secretService/UserAnswers",
                    dataType: "json",
                    data: JSON.stringify({
                        userId: self.get("userId"),
                        questionShareCode: self.get("questionShareCode"),
                        questionTypeId: self.get("questionTypeId"),
                        userAnswerText: self.get("userAnswerText"),
                        repliedToUserAnswerId: self.get("repliedToUserAnswerId")
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
            }

        });

        return UserAnswer;
    }

);