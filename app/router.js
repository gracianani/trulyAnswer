define(function (require, exports, module) {
    "use strict";

    // External dependencies.
    var Backbone = require("backbone");

    var TrulyAnswerStartView = require("views/trulyAnswer/StartView");
    var TrulyAnswerReplyView = require("views/trulyAnswer/ReplyView");
    var TrulyAnswerAskView = require("views/trulyAnswer/AskView");
    var PrepareView = require("views/PrepareView");

    var trulyAnswerStartView;
    var trulyAnswerReplyView;
    var trulyAnswerAskView;
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
            "reply/:shareCode": "reply",
            "ask/:shareCode": "ask",
            "login/:userId(/:shareCode)": "login"
        },

        index: function () {
            prepareView.render();
            user.syncData();
            trulyAnswerStartView = new TrulyAnswerStartView({ user: user });
        },

        reply: function (shareCode) {
            prepareView.render();
            user.syncData(shareCode);
            trulyAnswerReplyView = new TrulyAnswerReplyView({ shareCode: shareCode, user: user });
        },

        ask: function (shareCode) {
            prepareView.render();
            user.syncData(shareCode);
            trulyAnswerAskView = new TrulyAnswerAskView({ shareCode: shareCode, user: user });
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
