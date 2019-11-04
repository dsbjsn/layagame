import SingtonClass from "./SingtonClass";
import GamePlatform from "../adapter/GamePlatform";
import SoundUtil from "./SoundUtil";

export default class OppoADUtil extends SingtonClass {
    public static VIDEO_ID = "134256";
    public static BANNER_ID = "134254";
    public static APP_ID = "30213416";

    private static videoAd;
    private static adOptions;
    private static bannerAd;

    public static init() {
        if (GamePlatform.platformName == GamePlatform.OPPO) {
            //广告初始化
            OppoADUtil.initAD();
            //激励视频初始化
            OppoADUtil.initVideo();

            // OppoADUtil.initBanner();
        }
    }

    private static initAD() {
        GamePlatform.platform.initAdService({
            appId: OppoADUtil.APP_ID,
            isDebug: false,
            success: function (res) {
                console.log("oppo initAD success");
            },
            fail: function (res) {
                console.log("oppo initAD fail:" + res.code + res.msg);
            },
            complete: function (res) {
                console.log("oppo initAD complete");
            }
        })
    }


    private static videoAdIsLoad = false;
    private static initVideo() {
        OppoADUtil.videoAd = GamePlatform.platform.createRewardedVideoAd({
            posId: OppoADUtil.VIDEO_ID,
        })
        OppoADUtil.videoAd.load();


        OppoADUtil.videoAd.onLoad(() => {
            console.log("oppo video load success");
            if (OppoADUtil.videoAdIsLoad) {
                OppoADUtil.video();
            } else {
                OppoADUtil.videoAdIsLoad = true;
            }
        });

        OppoADUtil.videoAd.onVideoStart(() => {
            console.log("oppo video onVideoStart");

        });

        OppoADUtil.videoAd.onError((err) => {
            console.log("oppo video onError:", err);
            if (OppoADUtil.adOptions != null && OppoADUtil.adOptions != undefined && OppoADUtil.adOptions.error) {
                OppoADUtil.adOptions.error();
                SoundUtil.playBgm();
                OppoADUtil.videoAdIsLoad = false;
                OppoADUtil.videoAd.load();
            }
        });

        OppoADUtil.videoAd.onClose((res) => {
            console.log("oppo video onClose");
            if (res.isEnded) {
                if (OppoADUtil.adOptions != null && OppoADUtil.adOptions != undefined && OppoADUtil.adOptions.success)
                    OppoADUtil.adOptions.success();
            } else {
                if (OppoADUtil.adOptions != null && OppoADUtil.adOptions != undefined && OppoADUtil.adOptions.fail)
                    OppoADUtil.adOptions.fail();
            }
            SoundUtil.playBgm();

            OppoADUtil.videoAdIsLoad = false;
            OppoADUtil.videoAd.load();
        });
    }


    public static video(options: any = {}): void {
        if (OppoADUtil.videoAdIsLoad) {
            OppoADUtil.adOptions = options;
            OppoADUtil.videoAd.show();
        } else {
            OppoADUtil.videoAdIsLoad = true;
            OppoADUtil.videoAd.load();
        }
    }




    private static isShowBanner = false;
    private static initBanner() {
        if (OppoADUtil.isShowBanner) {
            return;
        } else {
            console.log("oppo initBanner");
            OppoADUtil.isShowBanner = true;
            Laya.timer.once(500, this, () => {
                OppoADUtil.bannerAd = GamePlatform.platform.createBannerAd({
                    posId: OppoADUtil.BANNER_ID
                })
                OppoADUtil.bannerAd.show();
            })
        }


        // OppoADUtil.bannerAd = GamePlatform.platform.createBannerAd({
        //     posId: OppoADUtil.BANNER_ID
        // })

        // OppoADUtil.bannerAd.onShow(() => {
        //     OppoADUtil.isShowBanner = true;
        // })

        // OppoADUtil.bannerAd.onError((err) => {
        //     OppoADUtil.bannerAd.offShow();
        //     OppoADUtil.bannerAd.offError();

        //     OppoADUtil.isShowBanner = false;
        //     OppoADUtil.initBanner();
        // })

        //  //隐藏回调，如果标识为显示，则显示
        // OppoADUtil.bannerAd.onHide(()=>{
        //     if(OppoADUtil.isShowBanner){
        //         OppoADUtil.bannerAd.show();
        //     }
        // })
    }

    public static showBanner() {
        if (!OppoADUtil.isShowBanner) {
            console.log("oppo showBanner");
            OppoADUtil.initBanner();
        }


        // if (OppoADUtil.bannerAd != null) {
        //     OppoADUtil.isShowBanner=true;
        //     // OppoADUtil.bannerAd.show();
        // }
    }

    public static hideBanner() {
        Laya.timer.clearAll(this);
        if (OppoADUtil.bannerAd != null && OppoADUtil.isShowBanner) {
            console.log("oppo hideBanner");
            OppoADUtil.isShowBanner = false;
            OppoADUtil.bannerAd.destroy();
        }
    }
}