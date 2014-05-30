define(function (require, exports, module) {
    "use strict";

    // External dependencies.
    var Backbone = require("backbone");
    var PrepareView = require("views/PrepareView");

    var TrulyAnswerStartView = require("views/trulyAnswer/StartView");
    var TrulyAnswerReplyView = require("views/trulyAnswer/ReplyView");
    var TrulyAnswerAskView = require("views/trulyAnswer/AskView");


    var trulyAnswerStartView;
    var trulyAnswerReplyView;
    var trulyAnswerAskView;

    var SimpleQuestionStartView = require("views/simpleQuestion/StartView");
    var SimpleQuestionReportView = require("views/simpleQuestion/ReportView");
    var SimpleQuestionAskView = require("views/simpleQuestion/AskView");

    var simpleQuestionStartView;
    var simpleQuestionReportView;
    var simpleQuestionAskView;

    var prepareView;

    var User = require("models/User");
    var user;

    // Defining the application router.
    module.exports = Backbone.Router.extend({
        initialize: function () {
            user = new User();
            prepareView = new PrepareView();
        },

        routes: {
            "": "index",

            "trulyAnswer/start": "trulyAnswerStart",
            "trulyAnswer/reply/:shareCode": "trulyAnswerReply",
            "trulyAnswer/ask/:shareCode": "trulyAnswerAsk",

            "simpleQuestion/start": "simpleQuestionStart",
            "simpleQuestion/report/:shareCode": "simpleQuestionReport",
            "simpleQuestion/ask/:shareCode": "simpleQuestionAsk",

            "login/:userId(/:shareCode)": "login"
        },

        index: function () {
            prepareView.render();
            user.syncData();
            trulyAnswerStartView = new TrulyAnswerStartView({ user: user });
        },

        trulyAnswerStart: function () {
            prepareView.render();
            user.syncData();
            trulyAnswerStartView = new TrulyAnswerStartView({ user: user });
        },

        trulyAnswerReply: function (shareCode) {
            prepareView.render();
            user.syncData(shareCode);
            trulyAnswerReplyView = new TrulyAnswerReplyView({ shareCode: shareCode, user: user });
        },

        trulyAnswerAsk: function (shareCode) {
            prepareView.render();
            user.syncData(shareCode);
            trulyAnswerAskView = new TrulyAnswerAskView({ shareCode: shareCode, user: user });
        },

        simpleQuestionStart: function () {
            prepareView.render();
            user.syncData();
            simpleQuestionStartView = new SimpleQuestionStartView({ user: user });
        },

        simpleQuestionReport: function (shareCode) {
            prepareView.render();
            user.syncData(shareCode);
            simpleQuestionReportView = new SimpleQuestionReportView({ shareCode: shareCode, user: user });
        },

        simpleQuestionAsk: function (shareCode) {
            prepareView.render();
            user.syncData(shareCode);
            simpleQuestionAskView = new SimpleQuestionAskView({ shareCode: shareCode, user: user });
        },

        login: function (userId, shareCode) {
            prepareView.render();
            user.setUserId(userId);
            user.fetchDataByUserId({
                userId: userId,
                success: function () {
                    if (shareCode !== undefined && shareCode !== null) {
                        Backbone.history.navigate("#ask/" + shareCode, { trigger: true, replace: true });
                    }
                    else {
                        Backbone.history.navigate("", { trigger: true, replace: true });
                    }
                },
                error: function (msg) {
                    alert(msg);
                }
            });
        }
    });
});
