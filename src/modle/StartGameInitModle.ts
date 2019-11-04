import BaseModle from "./BaseModle";
import GameHttp from "../data/GameHttp";
import LocalStorageUtil from "../utils/LocalStorageUtil";
import StaticData from "../data/StaticData";
import CoinModle from "./CoinModle";
import SignModle from "./SignModle";
import SkinModle from "./SkinModle";
import UserData from "../data/UserData";
import WxADUtil from "../utils/WxADUtil";
import SoundUtil from "../utils/SoundUtil";

export default class StartGameInitModle extends BaseModle {
    private static loadProgress = 0;

    private static jsons = [
    ];

    static initData() {
        //清除本地数据缓存
        // Laya.LocalStorage.clear();

        //登录操作
        GameHttp.Instance.login();
        //初始化金币
        CoinModle.init();
        //签到初始化
        SignModle.init();

        //记录关卡
        let l = LocalStorageUtil.getNumber(StaticData.LEVEL);
        if (l != null) {
            StaticData.level = Number(l);
        } else {
            LocalStorageUtil.add(StaticData.LEVEL, StaticData.level);
        }

        
        Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, () => {
            this.loadProgress++;
            // if (this.loadProgress >= 2) {
                Laya.Scene.open("scene/game/game.scene");
            // }
        }));


        // Laya.loader.load(this.jsons, Laya.Handler.create(this, () => {
        //     // UserData.setOpenUser();
            
        //     this.loadProgress++;
        //     if (this.loadProgress >= 2) {
        //         Laya.Scene.open("scene/game/game.scene");
        //     }
           
        // }));
    }

    static loadLevelJson() {
        StaticData.levels = Laya.loader.getRes("level.json");
    }

    static loadSkinJson() {
        SkinModle.init(Laya.loader.getRes("skin.json").carSkin, Laya.loader.getRes("skin.json").eggSkin);
    }
}