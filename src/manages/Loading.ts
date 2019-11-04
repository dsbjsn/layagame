import GameHttp from "../data/GameHttp";
import StaticData from "../data/StaticData";
import SoundUtil from "../utils/SoundUtil";
import ConfigData from "../config/ConfigData";
import SkinModle from "../modle/SkinModle";
import LocalStorageUtil from "../utils/LocalStorageUtil";
import CoinModle from "../modle/CoinModle";
import GameConfig from "../GameConfig";
import SignModle from "../modle/SignModle";
import UserData from "../data/UserData";
import StartGameInitModle from "../modle/StartGameInitModle";
import AldUtil from "../utils/AldUtil";

export default class Loading extends Laya.Script {
    owner: Laya.Scene;
    box: Laya.Box;
    loadingLb: Laya.Label;

    onEnable(): void {
        AldUtil.upload(CustomPage.Page_Loading);

        this.box = this.owner.getChildByName("box") as Laya.Box;
        this.loadingLb = this.box.getChildByName("loadingLb") as Laya.Label;
        
        if (!StaticData.isIphoneX) {
            this.box.y -= StaticData.offY;
        } else {
            this.box.y = 0;
        }
    }

    onStart() {
        StartGameInitModle.initData();
    }
}