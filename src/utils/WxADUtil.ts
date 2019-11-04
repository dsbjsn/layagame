import SingtonClass from "./SingtonClass";
import TipsUtil from "./TipsUtil";
import SoundUtil from "./SoundUtil";
import StaticData from "../data/StaticData";
import GamePlatform from "../adapter/GamePlatform";
import ThreePartyUtil from "./ThreePartyUtil";
import OppoADUtil from "./OppoADUtil";

export default class WxADUtil extends SingtonClass {
    private static isLoad = false;
    private static bannerAD;
    private static startBannerAD;
    public static maxShowAdTimes = 5;

    private static loadTime = 0;
    private static startLoadTime = 0;

    public static realHeight = 0;
    public static top = 0;

    private static rewardedVideoAd;
    private static adOptions;


    static ads: any[] = [{
        adUnitId: 'adunit-3059d35561628657'
    }, {
        adUnitId: 'adunit-dc964c0a9729e4d9'
    }];


    static bannerObj = {
        adUnitId: 'adunit-5da1fd35bf9c4dec',
        style: {
            left: 0,
            top: StaticData.gameHeight - 300,
            width: 750
        },
        adIntervals: 30
    };

    static startBannerObj = {
        adUnitId: 'adunit-5da1fd35bf9c4dec',
        style: {
            left: 0,
            top: StaticData.gameHeight - 300,
            width: 600
        },
        adIntervals: 30
    };

    static WxShareData = [{
        title: "这个坑，你能出来算我输！",
        url: "https://mmocgame.qpic.cn/wechatgame/O1rMXa54WwYibS1faszaNQgoRfGKvh3APGZ4ol1WibIfXZzxHdIColibQ1p31sG5A1R/0",
        id: "hC6RQAwSRKWO8kEbBW2NNw"
    },
    {
        title: "车门已经焊死了，谁也别想下车！",
        url: "https://mmocgame.qpic.cn/wechatgame/O1rMXa54WwbPZtf0B4kCewuCwqxj3vqoH1WbfMOVCZesCcTFfLlBOp0suic4J618l/0",
        id: "yKhLLPqSSRKFLIQinvzt-g"
    }, {
        title: "道路千万条，安全第一条。行车不规范，蛋蛋两行泪~",
        url: "https://mmocgame.qpic.cn/wechatgame/O1rMXa54WwYhad1uPHrFQjCZ8kZqm06U27N2rHkHfdKsJPocRcntNmDIzkflcxcJ/0",
        id: "nmPzL9e1QZ2VfCc2q-BL2Q"
    }
    ];


    public static init() {
        if (Laya.Browser.onWeiXin || Laya.Browser.onQQMiniGame) {
            //激励视频初始化
            WxADUtil.initVideo();

            if (GamePlatform.platformName == GamePlatform.WX) {
                //banner初始化
                WxADUtil.initBanner();
                WxADUtil.initStartBanner();
            }

            //初始化分享
            WxADUtil.initShare();
        }
    }

    private static initVideo() {
        let id = Math.floor(Math.random() * this.ads.length);
        WxADUtil.rewardedVideoAd = GamePlatform.platform.createRewardedVideoAd(this.ads[id]);
        WxADUtil.rewardedVideoAd.load();
        WxADUtil.rewardedVideoAd.onClose(res => {
            if (res.isEnded) {
                if (WxADUtil.adOptions != null && WxADUtil.adOptions != undefined && WxADUtil.adOptions.success)
                    WxADUtil.adOptions.success();
            } else {
                if (WxADUtil.adOptions != null && WxADUtil.adOptions != undefined && WxADUtil.adOptions.fail)
                    WxADUtil.adOptions.fail();
            }
            SoundUtil.playBgm();
        });

        WxADUtil.rewardedVideoAd.onError(err => {
            console.log("ad onError:", err);
            if (WxADUtil.adOptions != null && WxADUtil.adOptions != undefined && WxADUtil.adOptions.error)
                WxADUtil.adOptions.error();
            SoundUtil.playBgm();
        });
    }

    private static initBanner() {
        if (WxADUtil.bannerAD != null) {
            WxADUtil.bannerAD.hide();
            WxADUtil.bannerAD.destroy();
        }

        WxADUtil.bannerAD = GamePlatform.platform.createBannerAd(WxADUtil.bannerObj);
        WxADUtil.bannerAD.offError();
        WxADUtil.bannerAD.offLoad();
        WxADUtil.bannerAD.offResize();

        WxADUtil.bannerAD.onError(err => {
            WxADUtil.loadTime++;
            console.log("wx initBanner onError");
            if (WxADUtil.loadTime <= 3) {
                WxADUtil.initBanner();
            }
        });

        WxADUtil.bannerAD.onLoad(() => {
            WxADUtil.isLoad = true;
        });

        WxADUtil.bannerAD.onResize(() => {
            if (StaticData.isIphoneX) {
                WxADUtil.bannerAD.style.top = wx.getSystemInfoSync().screenHeight - WxADUtil.bannerAD.style.realHeight - (50 / StaticData.clientScale);
            } else {
                WxADUtil.bannerAD.style.top = wx.getSystemInfoSync().screenHeight - WxADUtil.bannerAD.style.realHeight;
            }
        })
    }

    private static initStartBanner() {
        if (WxADUtil.startBannerAD != null) {
            WxADUtil.startBannerAD.hide();
            WxADUtil.startBannerAD.destroy();
        }

        WxADUtil.startBannerObj.style.width = 600 / StaticData.clientScale;
        WxADUtil.startBannerObj.style.left = (StaticData.gameWidth - 600) / StaticData.clientScale / 2;

        WxADUtil.startBannerAD = GamePlatform.platform.createBannerAd(WxADUtil.startBannerObj);
        WxADUtil.startBannerAD.offError();
        WxADUtil.startBannerAD.offLoad();
        WxADUtil.startBannerAD.offResize();

        WxADUtil.startBannerAD.onError(err => {
            WxADUtil.startLoadTime++;
            if (WxADUtil.startLoadTime <= 3) {
                WxADUtil.initStartBanner();
            }
        });

        WxADUtil.startBannerAD.onLoad(() => {
            WxADUtil.isLoad = true;
        });

        WxADUtil.startBannerAD.onResize(() => {
            if (StaticData.isIphoneX) {
                WxADUtil.startBannerAD.style.top = wx.getSystemInfoSync().screenHeight - WxADUtil.startBannerAD.style.realHeight - (50 / StaticData.clientScale);
            } else {
                WxADUtil.startBannerAD.style.top = wx.getSystemInfoSync().screenHeight - WxADUtil.startBannerAD.style.realHeight;
            }
        })
    }

    private static initShare() {
        GamePlatform.platform.showShareMenu({
            withShareTicket: true
        })

        GamePlatform.platform.onShareAppMessage(() => {
            if (GamePlatform.platformName == GamePlatform.WX) {
                if (Laya.Browser.onWeiXin) {
                    let id = Math.floor(Math.random() * WxADUtil.WxShareData.length);
                    return {
                        title: WxADUtil.WxShareData[id].title,
                        imageUrlId: WxADUtil.WxShareData[id].id,
                        imageUrl: WxADUtil.WxShareData[id].url,
                    }
                }
            }
        })
    }


    static getADMidleY() {
        if (WxADUtil.bannerAD == null) {
            return 0;
        }
        let top = WxADUtil.bannerAD.style.top;
        let h = WxADUtil.bannerAD.style.realHeight;

        let y = top + h / 2;
        return y * StaticData.clientScale;
    }

    static showBannerAd() {
        if (GamePlatform.platformName == GamePlatform.OPPO) {
            OppoADUtil.showBanner();
        } else {
            if (WxADUtil.bannerAD != null) {
                WxADUtil.bannerAD.show();
            }
        }
    }

    static showStartBannerAd() {
        if (GamePlatform.platformName == GamePlatform.OPPO) {
            OppoADUtil.showBanner();
        } else {
            if (WxADUtil.startBannerAD != null) {
                WxADUtil.startBannerAD.show();
            }
        }
    }

    static hideBannerAd() {
        if (GamePlatform.platformName == GamePlatform.OPPO) {
            OppoADUtil.hideBanner();
        } else {
            if (WxADUtil.bannerAD != null) {
                WxADUtil.bannerAD.hide();
            }

            if (WxADUtil.startBannerAD != null) {
                WxADUtil.startBannerAD.hide();
            }
        }
    }


    static adOrShare(options: any = {}) {
        //oppo有自己的广告，跳转到oppo广告工具类
        if (GamePlatform.platformName == GamePlatform.OPPO) {
            OppoADUtil.video(options);
        } else {
            WxADUtil.video(options);
        }

    }

    static video(options: any = {}): void {
        if (GamePlatform.platformName == GamePlatform.WX) {
            if (Laya.Browser.onWeiXin || Laya.Browser.onQQMiniGame) {
                WxADUtil.adOptions = options
                WxADUtil.rewardedVideoAd.show();
            } else {
                options.fail && options.fail();
            }
        } else if (GamePlatform.platformName == GamePlatform.IOS || GamePlatform.platformName == GamePlatform.ANDROID) {
            options.type = "video";
            ThreePartyUtil.showVdWithCallBack(options);
        } else {
            options.success && options.success();
        }
    }

    static share(options: any = {}) {
        if (GamePlatform.platformName == GamePlatform.WX) {
            if (Laya.Browser.onWeiXin || Laya.Browser.onQQMiniGame) {
                let id = Math.floor(Math.random() * WxADUtil.WxShareData.length);
                GamePlatform.platform.shareAppMessage({
                    title: WxADUtil.WxShareData[id].title,
                    imageUrlId: WxADUtil.WxShareData[id].id,
                    imageUrl: WxADUtil.WxShareData[id].url,
                });

                if (options.success) {
                    GamePlatform.platform.offShow(options.success);
                    GamePlatform.platform.onShow(options.success);
                }
            }
        } else if (GamePlatform.platformName == GamePlatform.IOS || GamePlatform.platformName == GamePlatform.ANDROID) {
            options.type = "share";
            ThreePartyUtil.showVdWithCallBack(options);
        } else {
            options.success && options.success();
        }
    }
}