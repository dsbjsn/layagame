import SingtonClass from "../utils/SingtonClass";
import StaticData from "../data/StaticData";
import ConfigData from "../config/ConfigData";
import SoundUtil from "../utils/SoundUtil";
import WxADUtil from "../utils/WxADUtil";
import Api from "../data/Api";
import OppoADUtil from "../utils/OppoADUtil";
import TipsUtil from "../utils/TipsUtil";

export default class GamePlatform extends SingtonClass {
    public static VIVO = "vivo";
    public static OPPO = "oppo";
    public static WX = "wx";
    public static QQ = "qq";
    public static IOS = "ios";
    public static ANDROID = "android";
    public static WB = "wb";

    static platformName = GamePlatform.WB;
    static platform: any;
    static openDataContext;

    static init() {
        SoundUtil.init();

        switch (GamePlatform.platformName) {
            case GamePlatform.WX:
                this.initWx();
                break;
            case GamePlatform.QQ:
                this.initQq();
                break;
            case GamePlatform.OPPO:
                this.initOppo();
                break;
            case GamePlatform.VIVO:
                this.initVivo();
                break;
            case GamePlatform.IOS:
                this.initIos();
                break;
            case GamePlatform.ANDROID:
                this.initAndroid();
                break;
            default:
                break;
        }
    }

    private static initWx() {
        if (Laya.Browser.onWeiXin) {
            GamePlatform.platform = Laya.Browser.window.wx;

            //屏幕适配
            GamePlatform.platform.getSystemInfo({
                success: function (res) {
                    var model = res.model
                    if (model.search(/iPhone X/i) != -1) {
                        StaticData.setIsIphoneX(true);
                    } else {
                        StaticData.setIsIphoneX(false);
                    }
                }
            })

            //微信相关设置初始化
            WxADUtil.init();

            GamePlatform.platform.onHide(() => {
            });

            GamePlatform.platform.onShow(() => {
                SoundUtil.playBgm();
            });

            GamePlatform.openDataContext = new WxOpenDataContext();
        } else {
            StaticData.setIsIphoneX(false);
        }
    }

    private static initQq() {
        if (Laya.Browser.onQQMiniGame) {
            GamePlatform.platform = Laya.Browser.window.qq;

            //屏幕适配
            GamePlatform.platform.getSystemInfo({
                success: function (res) {
                    var model = res.model
                    if (model.search(/iPhone X/i) != -1) {
                        StaticData.setIsIphoneX(true);
                    } else {
                        StaticData.setIsIphoneX(false);
                    }
                }
            })

            //微信相关设置初始化
            WxADUtil.init();

            GamePlatform.platform.onHide(() => {
            });

            GamePlatform.platform.onShow(() => {
                SoundUtil.playBgm();
            });

            GamePlatform.openDataContext = new WxOpenDataContext();
        } else {
            StaticData.setIsIphoneX(false);
        }
    }


    private static initOppo() {
        StaticData.setIsIphoneX(false);

        GamePlatform.platform = Laya.Browser.window.qg;
        OppoADUtil.init();

        //oppo 开启调试
        GamePlatform.platform.setEnableDebug({
            enableDebug: false
        });
    }


    private static initVivo() { StaticData.setIsIphoneX(false); }

    private static initIos() {
        StaticData.setIsIphoneX(false);
    }

    private static initAndroid() {
        StaticData.setIsIphoneX(false);
    }

    static topBtnPos(view) {
        if (Laya.Browser.onWeiXin || Laya.Browser.onQQMiniGame) {
            let data = GamePlatform.platform.getMenuButtonBoundingClientRect();
            let off = (data.height * StaticData.clientScale - view.height) / 2;
            view.y = data.top * StaticData.clientScale + off;
        } else {
            view.y = 20;
        }
    }
}

class WxOpenDataContext implements PlatformOpenDataContext {
    createDisplayObject(type?: string, width?: number, height?: number): Laya.Sprite { return new Laya.WXOpenDataViewer(); };
    postMessage(obj: any): void { (new Laya.WXOpenDataViewer()).postMsg(obj); };
}


declare interface PlatformOpenDataContext {
    createDisplayObject(type?: string, width?: number, height?: number): Laya.Sprite;
    postMessage(obj: any): void;
}