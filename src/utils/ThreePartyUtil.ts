import SingtonClass from "./SingtonClass";
import ConfigData from "../config/ConfigData";
import GamePlatform from "../adapter/GamePlatform";

export default class ThreePartyUtil extends SingtonClass {
    static showVidoeAd() {
        try {
            console.log("app通信 无回调");
            if (GamePlatform.platformName == GamePlatform.IOS) {
                var bridge = Laya.Browser.window["PlatformClass"].createClass("JSBridge");
                bridge.call("showVideoAd:", "接收到数据----123");
            }
            else if (GamePlatform.platformName == GamePlatform.ANDROID) {
                var bridge = Laya.Browser.window["PlatformClass"].createClass("demo.JSBridge");
                bridge.call("showVideoAd", "接收到数据----123");
            }
        } catch (error) {}
    }

    /**
     * 
     * @param options 
     * type:调用类型 1:观看视频
     * success:成功时候的回调方法
     * fail:失败时候的回调方法
     * 
     * obj:ios端返回数据
     * 1：成功
     * 0：失败
     */
    static showVdWithCallBack(options) {
        try {
            console.log("app通信 有回调 options=", options);
            
            if (GamePlatform.platformName == GamePlatform.ANDROID) {
                var bridge = Laya.Browser.window["PlatformClass"].createClass("demo.JSBridge");
                bridge.callWithBack((obj) => {
                    console.log("return obj=", obj);
                    if (obj && obj == 1) {
                        options.success && options.success();
                    } else {
                        options.fail && options.fail();
                    }
                }, "showVideoAdWithCallBack",  String(options.type));
            }

            else if (GamePlatform.platformName == GamePlatform.IOS) {
                var bridge = Laya.Browser.window["PlatformClass"].createClass("JSBridge");
                bridge.callWithBack((obj) => {
                    console.log("return obj=", obj);
                    if (obj && obj == 1) {
                        options.success && options.success();
                    } else {
                        options.fail && options.fail();
                    }
                }, "showVideoAdWithCallBack:",options.type);
            }
        } catch (error) {}
    }
}