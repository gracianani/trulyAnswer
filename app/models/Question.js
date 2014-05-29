// Question.js

define(["jquery", "backbone"],

    function ($, Backbone) {

        var Question = Backbone.Model.extend({

            idAttribute: "questionId",

            initialize: function (options) {
                this.set({
                    "questionText": "有问必答",
                    "questionTypeId": options.questionTypeId,
                    "userId": options.userId,
                    "expiresIn": 3,
                    "shareCode": options.shareCode
                });

            },
            addQuestion: function (options) {
                var self = this;
                $.ajax({
                    url: "http://192.168.1.103:9009/secretService/Questions",
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
                    url: "http://192.168.1.103:9009/secretService/Questions/" + self.get("shareCode") + "/" + self.get("userId"),
                    dataType: "json",
                    type: "GET",
                    contentType: "application/json; charset=utf-8",
                    success: function (data, textStatus, jqXHR) {
                        options.success(data);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        options.error(textStatus + ": " + errorThrown);
                    }
                });
            }

        });

        return Question;
    }

);