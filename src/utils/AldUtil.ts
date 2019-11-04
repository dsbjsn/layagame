import SingtonClass from "./SingtonClass";
import StaticData from "../data/StaticData";
import UserData from "../data/UserData";
import TipsUtil from "./TipsUtil";
import GamePlatform from "../adapter/GamePlatform";

export default class AldUtil extends SingtonClass {
    static stageStart() {
        if (GamePlatform.platformName == GamePlatform.WX) {
            let obj = {
                "stageId": String(StaticData.level + 1),
                "stageName": String(StaticData.getLevelData(StaticData.level).stationInfo.name),
                "userId": UserData.OpenId
            }

            try {
                if (Laya.Browser.onWeiXin || Laya.Browser.onQQMiniGame) {
                    GamePlatform.platform.aldStage.onStart(obj);
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    static stageRunning() {
        if (GamePlatform.platformName == GamePlatform.WX) {
            let obj = {
                "stageId": String(StaticData.level + 1),
                "stageName": String(StaticData.getLevelData(StaticData.level).stationInfo.name),
                "userId": UserData.OpenId,
                "event": "revive"
            }

            console.log("ald running:", obj);

            try {
                if (Laya.Browser.onWeiXin || Laya.Browser.onQQMiniGame) {
                    GamePlatform.platform.aldStage.onRunning(obj);
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    static stageEnd(_event: boolean) {
        if (GamePlatform.platformName == GamePlatform.WX) {
            let obj = {
                "stageId": String(StaticData.level + 1),
                "stageName": String(StaticData.getLevelData(StaticData.level).stationInfo.name),
                "userId": UserData.OpenId,
                "event": _event ? "complete" : "fail"
            }

            console.log("ald end:", obj);
            try {
                if (Laya.Browser.onWeiXin || Laya.Browser.onQQMiniGame) {
                    GamePlatform.platform.aldStage.onEnd(obj);
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    static upload(obj) {
        if (GamePlatform.platformName == GamePlatform.WX) {
            if (obj == null) {
                TipsUtil.msg("----------阿拉丁：未知----------");
                return;
            }

            try {
                console.log("ald-upload：", obj);
                if (Laya.Browser.onWeiXin || Laya.Browser.onQQMiniGame) {
                    GamePlatform.platform.aldSendEvent(obj == null ? "未知" : obj);
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
}



