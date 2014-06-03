// User.js
define(["jquery", "backbone", "jquerycookie", "Utils"],
    function ($, Backbone, jqueryCookie, Utils) {
        var User = Backbone.Model.extend({
            defaults: {
                "isFetchSuccess": false,
                "isLogin":false
            },
            initialize: function () {

                var cookieId = $.cookie("userId");
                if (cookieId) {
                    this.setUserId(cookieId);
                }
                this.wechatLoginUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx6721bf58769432ea&redirect_uri=http%3a%2f%2fquiz.seemeloo.com%2fsecretcnwebservices%2fsecretservice%2fusers%2fwechat%2f&response_type=code&scope=snsapi_userinfo&state=TOREPLACE#wechat_redirect";
            },
            setUserId: function (userId) {
                this.set("userId", userId);
                $.cookie("userId", userId);
            },
            syncData: function (state) {

                if (this.checkLogin()) {
                    this.fetchDataByUserId();
                } else {
                    this.login(state);
                }
            },
            fetchDataByUserId: function (options) {
                var userId;
                var self = this;
                if (options && options.userId) {
                    userId = options.userId;
                }
                else {
                    userId = self.get("userId");
                }
                $.ajax({
                    url: "http://quiz.seemeloo.com/secretcnWebServices/secretService/users/" + userId + "?ts=" + (new Date()).getTime(),
                    dataType: "json",
                    success: function (data, textStatus, jqXHR) {
                        self.set(data);
                        self.trigger("onFetchSuccess");
                        self.set("isFetchSuccess", true);
                        
                        if (options && options.success) {
                            options.success();
                        }
                        
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                    }
                });
            },
            fakeLogin: function (options) {
                var self = this;
                $.ajax({
                    url: "http://quiz.seemeloo.com/secretcnWebServices/secretService/users/fake/?code=1",
                    dataType: "json",
                    success: function (data, textStatus, jqXHR) {
                        self.set(data);
                        self.trigger("onFetchSuccess");
                        self.set("isFetchSuccess", true);
                        
                        if (options && options.success) {
                            options.success();
                        }                        
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                    }
                });
            },
            checkLogin: function () {
                return this.has("userId");
            },
            login: function (state) {
                if (Utils.isWechat()) {
                    this.wechatLogin(state);
                }
                else {
                    this.fakeLogin();
                }
            },
            isLogin: function () {
                return this.get("isLogin");
            },
            wechatLogin: function (state) {
                if (state !== undefined) {
                    this.wechatLoginUrl = this.wechatLoginUrl.replace("TOREPLACE", state);
                }
                window.location.href = this.wechatLoginUrl;
            }
        });
        return User;
    }
);