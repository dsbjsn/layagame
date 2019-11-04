import SingtonClass from "./SingtonClass";
import TipsUtil from "./TipsUtil";
import LocalStorageUtil from "./LocalStorageUtil";
import WxADUtil from "./WxADUtil";
import GameHttp from "../data/GameHttp";
import AldUtil from "./AldUtil";
import GamePlatform from "../adapter/GamePlatform";

export default class LeadOutUtil extends SingtonClass {
   

    public static leadOut(gameInfo,dc_pois:string) {
        AldUtil.upload(dc_pois);
        if (Laya.Browser.onWeiXin|| Laya.Browser.onQQMiniGame) {
            GameHttp.Instance.leadOut(gameInfo.id);
            GamePlatform.platform.navigateToMiniProgram({
                appId: gameInfo.appid,
                path: gameInfo.url,
                extraData: {
                    foo: 'bar'
                },
                envVersion: 'release',
                success(res) {
                    console.log('更多游戏打开成功');
                    // 确认导出
                    GameHttp.Instance.leadOutSuccess(gameInfo.id);
                }
            });
        } else {
            TipsUtil.msg("仅在微信中使用");
        }
    }
}