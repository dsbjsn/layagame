import BaseDialogManage from "./BaseDialogManage";
import SkinModle from "../../modle/SkinModle";
import CoinModle from "../../modle/CoinModle";
import GameHttp from "../../data/GameHttp";
import AldUtil from "../../utils/AldUtil";
import StaticData from "../../data/StaticData";
import ConfigData from "../../config/ConfigData";
import LeadOutGridRunTime from "../../runtimes/LeadOutGridRunTime";
import GameManage from "../../manages/GameManage";
import GameState from "../../data/GameState";
import LeadOutUtil from "../../utils/LeadOutUtil";
import WxADUtil from "../../utils/WxADUtil";
import GamePlatform from "../../adapter/GamePlatform";
import SignModle from "../../modle/SignModle";

export default class GameFinishDialogManage extends BaseDialogManage {
    _title: Laya.Label;
    stationLb: Laya.Label;
    addGame: Laya.Sprite;
    changeBtn: Laya.Sprite;
    goHomeBtn: Laya.Sprite;
    awardBtn: Laya.Sprite;
    fcSpr: Laya.Sprite;
    fcNumLb: Laya.Label;

    yesBox: Laya.Box;
    yesSpr: Laya.Sprite;

    hadShare = false;
    findView() {
        this._title = this.contentSpr.getChildByName("_title") as Laya.Label;
        this.stationLb = this.contentSpr.getChildByName("stationLb") as Laya.Label;

        this.yesBox = this.contentSpr.getChildByName("yesBox") as Laya.Box;
        this.yesSpr = this.yesBox.getChildByName("yesSpr") as Laya.Sprite;

        this.changeBtn = this.yesBox.getChildByName("changeBtn") as Laya.Sprite;
        this.goHomeBtn = this.yesBox.getChildByName("goHomeBtn") as Laya.Label;
        this.awardBtn = this.yesBox.getChildByName("awardBtn") as Laya.Sprite;

        this.fcSpr = this.awardBtn.getChildByName("fcSpr") as Laya.Sprite;
        this.fcNumLb = this.fcSpr.getChildByName("fcNumLb") as Laya.Label;

        this.addGame = this.owner.getChildByName("addGame") as Laya.Sprite;
    }

    initView() {
        this.fcNumLb.text = StaticData.ChangeFriendGetCoin + "";
        this.stationLb.text = "- 下一站 " + StaticData.getLevelData(StaticData.level).stationInfo.name + " -"

        this.changeBtn.on(Laya.Event.CLICK, this, this.onClickAction);
        this.goHomeBtn.on(Laya.Event.CLICK, this, this.onClickAction);
        this.awardBtn.on(Laya.Event.CLICK, this, this.onClickAction);

        if (GamePlatform.platformName != GamePlatform.WX && GamePlatform.platformName != GamePlatform.QQ) {
            this.addGame.visible = false;
        }

        this.yesSpr.on(Laya.Event.CLICK, this, () => {
            this.yesAction();
        })
    };

    initData() {
        if (Laya.Browser.onWeiXin  || Laya.Browser.onQQMiniGame) {
            let open: any = GamePlatform.openDataContext.createDisplayObject();
            open.postMsg({ command: "set_score", score: StaticData.level, station_name: "第" + StaticData.level + "关" });
        }

        if (GamePlatform.platformName != GamePlatform.WX && GamePlatform.platformName != GamePlatform.QQ) {
            this.changeBtn.visible = false;
            this.awardBtn.visible = false;
        }
    }

    adapterWindow() {
        super.adapterWindow();
        this._title.y += 167 * StaticData.heightOffsetScale;
        this.stationLb.y += 167 * StaticData.heightOffsetScale;
        this.yesBox.y += 248 * StaticData.heightOffsetScale;
        // this.changeBtn.y += 248 * StaticData.heightOffsetScale;
        // this.awardBtn.y += 248 * StaticData.heightOffsetScale;
        // this.goHomeBtn.y += 248 * StaticData.heightOffsetScale;

        if (Laya.Browser.onWeiXin || Laya.Browser.onQQMiniGame) {
            let data = GamePlatform.platform.getMenuButtonBoundingClientRect();
            let off = (data.height * StaticData.clientScale - this.addGame.height) / 2;
            this.addGame.y = data.top * StaticData.clientScale + off;
        }
    }

    setLeadOutData() {
        this.midleLeadOutSpr.setAldPois(CustomAction.GameFinishDialog_Dc);
        this.setIsShowMisLead(StaticData.isMisLead, this.yesBox);
    }

    onClickAction(e) {
        switch (e.target.name) {
            case "changeBtn":
            case "awardBtn":
                AldUtil.upload(CustomAction.GameFinishDialog_Share);
                WxADUtil.share({
                    success: () => {
                        if (!this.hadShare) {
                            CoinModle.addCoin(StaticData.ChangeFriendGetCoin);
                            this.hadShare = true;
                        }
                    }
                });
                break;
            case "goHomeBtn":
                this.gotoHome();
                break;
            default: break;
        }
    }

    yesAction() {
        this.reStart();
    }

    private reStart() {
        AldUtil.upload(CustomAction.GameFinishDialog_Yes);
        GameManage.manageOwner.gameState = GameState.NOT_START;
        GameManage.manageOwner.restart(true);
        this.owner.close();
    }

    private gotoHome() {
        AldUtil.upload(CustomAction.GameFinishDialog_No);
        GameManage.manageOwner.refreshUI();
        Laya.Dialog.open(ConfigData.StartGameDialog);

        //如果未签到，返回首页后，延迟一秒显示签到弹窗
        Laya.Dialog.open(ConfigData.StartGameDialog, true, null, Laya.Handler.create(this, (dialog) => {
            if (StaticData.AutoSkipToSign && !SignModle.getTodaySigned()) {
                let d = dialog as Dialog;
                Laya.timer.once(1000, this, () => {
                    if (d && !d.destroyed && d.visible) {
                        StaticData.AutoSkipToSign = false;
                        Laya.Dialog.open(ConfigData.SignDialog);
                    }
                })
            }
        }));
    }
}