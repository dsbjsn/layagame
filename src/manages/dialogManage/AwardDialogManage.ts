import TipsUtil from "../../utils/TipsUtil";
import UserData from "../../data/UserData";
import GameManage from "../GameManage";
import AwardType from "../../data/beans/AwardType";
import ConfigData from "../../config/ConfigData";
import StaticData from "../../data/StaticData";
import CoinModle from "../../modle/CoinModle";
import LocalStorageUtil from "../../utils/LocalStorageUtil";
import SkinModle from "../../modle/SkinModle";
import SkinConfig from "../../config/CarSkinConfig";
import LeadOutUtil from "../../utils/LeadOutUtil";
import WxADUtil from "../../utils/WxADUtil";
import GameHttp from "../../data/GameHttp";
import LeadOutListRunTime from "../../runtimes/LeadOutListRunTime";
import AldUtil from "../../utils/AldUtil";
import GamePlatform from "../../adapter/GamePlatform";
import BaseDialogManage from "../dialogManage/BaseDialogManage";

export default class AwardDialogManage extends BaseDialogManage {
    static manageOwner: AwardDialogManage;

    titleSpr: Laya.Sprite;
    closeLb: Laya.Label;
    getAwardSpr: Laya.Sprite;
    awardLabel: Laya.Label;
    midleSpr: Laya.Sprite;
    coinLb: Laya.Label;

    private awardData: AwardData;

    _no: Laya.Label

    onEnable(): void {
        super.onEnable();

        let coin = Math.floor((StaticData.getLevelData(StaticData.level).stationInfo.x / 100));
        //获取金币
        CoinModle.addCoin(CoinModle.isDoubleCoin ? coin * 2 : coin);
        //初始化设置  还原皮肤，还原双倍奖励
        SkinModle.freeCarSkinID = "0";
        SkinModle.freeEggSkinID = "0";
        CoinModle.doubleCoin(false);
        //游戏结束接口
        GameHttp.Instance.endGame();
        //阿拉丁游戏结束统计
        AldUtil.stageEnd(true);


        if (Laya.Browser.onWeiXin  || Laya.Browser.onQQMiniGame) {
            let open: any = GamePlatform.openDataContext.createDisplayObject();
            open.postMsg({ command: "set_score", score: StaticData.level, station_name: StaticData.level == 0 ? "出发地" : StaticData.getLevelData(StaticData.level - 1).stationInfo.name });
        }

        let leadOut = this.owner.getChildByName("bottomLeadOut") as LeadOutListRunTime;
        leadOut.setAldPois(CustomAction.NextLevelDialog_Dc);
        leadOut.init(true);
    }


    findView() {
        this.titleSpr = this.contentSpr.getChildByName("titleLb") as Laya.Label;
        this.closeLb = this.contentSpr.getChildByName("_no") as Laya.Label;
        this.getAwardSpr = this.contentSpr.getChildByName("getAwardSpr") as Laya.Sprite;

        this.awardLabel = this.contentSpr.getChildByName("awardNameLb") as Laya.Label;
        this.midleSpr = this.contentSpr.getChildByName("midleSpr") as Laya.Sprite;
        this.coinLb = this.contentSpr.getChildByName("coinLb") as Laya.Label;
    }

    initView() {
        this.closeLb.on(Laya.Event.CLICK, this, this.closeDialog);
        this.getAwardSpr.on(Laya.Event.CLICK, this, this.getAward);
        this.coinLb.visible = false;

        let levelInfo: LevelInfo = StaticData.getLevelData(StaticData.level);
        this.awardData = levelInfo.awards;
        if (this.awardData.type == "carSkin") {
            let carSkin = SkinModle.getCarSkinById(String(this.awardData.id));
            this.awardLabel.text = "- " + carSkin.skinName + " -";
            this.midleSpr.loadImage(SkinConfig.getCarSkinBig(carSkin.id), Laya.Handler.create(this, () => {
                this.midleSpr.x = (StaticData.gameWidth - this.midleSpr.width) / 2;
            }));
        } else if (this.awardData.type == "eggSkin") {
            let eggSkin = SkinModle.getEggSkinById(this.awardData.id);
            this.awardLabel.text = "- " + eggSkin.skinName + " -";
            this.midleSpr.loadImage(SkinConfig.getEggSkinBig(eggSkin.id), Laya.Handler.create(this, () => {
                this.midleSpr.x = (StaticData.gameWidth - this.midleSpr.width) / 2;
            }));
        }

        this.closeLb.visible = false;
        this.closeLb.fontSize = 30;
        this.closeLb.alpha = 0.3;
        Laya.timer.once(1000, this, function () {
            this.closeLb.visible = true;
        });

        this.scaleBYes(this.getAwardSpr);
    }

    adapterWindow() {
        super.adapterWindow();
        if (StaticData.isIphoneX) {
            this.getAwardSpr.y = 950;
            this.closeLb.y = 1124;
        }
    }

    closeDialog() {
        this.owner.close();
        this.nextLevel();
    }

    getAward() {
        AldUtil.upload(CustomAction.NextLevelDialog_Get);
        WxADUtil.adOrShare({
            success: () => {
                if (this.awardData.type == "carSkin") {
                    SkinModle.freeCarSkinID = String(this.awardData.id);
                } else if (this.awardData.type == "eggSkin") {
                    SkinModle.freeEggSkinID = String(this.awardData.id);
                }
                this.owner.close();
                this.nextLevel();
            }
        });
    }

    nextLevel() {
        StaticData.level += 1;
        if (StaticData.level >= StaticData.levels.length) {
            StaticData.level -= 1;
        }

        LocalStorageUtil.add(StaticData.LEVEL, StaticData.level);
        GameManage.manageOwner.nextLevel();
    }
}