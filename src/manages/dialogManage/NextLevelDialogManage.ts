import BaseDialogManage from "./BaseDialogManage";
import StaticData from "../../data/StaticData";
import LocalStorageUtil from "../../utils/LocalStorageUtil";
import GameManage from "../../manages/GameManage";
import ConfigData from "../../config/ConfigData";
import WxADUtil from "../../utils/WxADUtil";
import CoinModle from "../../modle/CoinModle";
import SkinModle from "../../modle/SkinModle";
import GameHttp from "../../data/GameHttp";
import AldUtil from "../../utils/AldUtil";

export default class NextLevelDialogRunTime extends BaseDialogManage {
    goHomeSpr: Laya.Sprite;
    shareSpr: Laya.Sprite;
    nextStationLb: Laya.Label;
    awardBtn: Laya.Sprite;
    fcSpr: Laya.Sprite;
    fcNumLb: Laya.Label;

    hadShare = false;
    findView() {
        this.goHomeSpr = this.contentSpr.getChildByName("goHomeSpr") as Laya.Sprite;
        this.shareSpr = this.contentSpr.getChildByName("shareSpr") as Laya.Sprite;
        this.nextStationLb = this.contentSpr.getChildByName("nextStationLb") as Laya.Label;
        this.awardBtn = this.contentSpr.getChildByName("awardBtn") as Laya.Sprite;
        this.fcSpr = this.awardBtn.getChildByName("fcSpr") as Laya.Sprite;
        this.fcNumLb = this.fcSpr.getChildByName("fcNumLb") as Laya.Label;
    }

    initView() {
        this.fcNumLb.text = StaticData.ChangeFriendGetCoin + "";

        this.nextStationLb.text = "- 下一关 -";

        this.goHomeSpr.on(Laya.Event.CLICK, this, this.onClickAction)
        this.shareSpr.on(Laya.Event.CLICK, this, this.onClickAction)
        this.awardBtn.on(Laya.Event.CLICK, this, this.onClickAction);
    }

    initData() {
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
    }

    adapterWindow() {
        super.adapterWindow();

        this.nextStationLb.y += 167 * StaticData.heightOffsetScale;
        this.goHomeSpr.y += 248 * StaticData.heightOffsetScale;
        this.shareSpr.y += 248 * StaticData.heightOffsetScale;
        this.awardBtn.y += 248 * StaticData.heightOffsetScale;

        // StaticData.level++;
        // if (StaticData.level > StaticData.maxLevel) {
        //     StaticData.level = 1;
        // }
        // LocalStorageUtil.add(StaticData.LEVEL, StaticData.level);
    }

    setLeadOutData() {
    }

    onClickAction(e) {
        switch (e.target.name) {
            case "goHomeSpr":
                AldUtil.upload(CustomAction.NextLevelDialog_Home);
                GameManage.manageOwner.refreshUI();
                Laya.Dialog.open(ConfigData.StartGameDialog);
                break;
            case "shareSpr":
            case "awardBtn":
                AldUtil.upload(CustomAction.NextLevelDialog_Share);
                WxADUtil.share({
                    success: () => {
                        if (!this.hadShare) {
                            CoinModle.addCoin(StaticData.ChangeFriendGetCoin);
                            this.hadShare = true;
                        }
                    }
                });
                break;
            default:
                break;
        }
    }

    yesAction() {
        AldUtil.upload(CustomAction.NextLevelDialog_Yes);
        WxADUtil.adOrShare({
            success: () => {
                CoinModle.isDoubleCoin = true;
                this.nextStation();
            },
            fail: () => {
                this.nextStation();
            },
            error: () => {
                this.nextStation();
            }
        });
    }

    noAction() {
        AldUtil.upload(CustomAction.NextLevelDialog_No);
        this.nextStation();
    }

    nextStation() {
        GameManage.manageOwner.nextLevel();
    }
}