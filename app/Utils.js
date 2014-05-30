define(["jquery"], function ($) {
    var Utils = {
        default: {
            shareUrl: "http://quiz.seemeloo.com/secret-cn",
            wechatAppId: "wx6721bf58769432ea",
            wechatAppSecret: "5078ad979abbc54cb525328ce3a1ef44"
        },
        isWechat: function() {
            var ua = navigator.userAgent.toLowerCase();
            if ( $("body").hasClass("wechat") ) {
                return true;
            } else if(ua.match(/MicroMessenger/i) !== null) {
                return true;
            } else {
                return false;
            }        
        },
        setPageTitle: function(title) {
        if ( title ) {
            $("title").html(title);
        }
    },
    };

    return Utils;
});