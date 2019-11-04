import BaseDialogManage from "./BaseDialogManage";
import WxADUtil from "../../utils/WxADUtil";
import ConfigData from "../../config/ConfigData";
import LeadOutGridRunTime from "../../runtimes/LeadOutGridRunTime";
import AldUtil from "../../utils/AldUtil";
import StaticData from "../../data/StaticData";
import LeadOutUtil from "../../utils/LeadOutUtil";
import GameManage from "../../manages/GameManage";
import CoinModle from "../../modle/CoinModle";

export default class GameOverDialogRunTime extends BaseDialogManage {
    rangeLabel: Laya.Label;
    stationLabel: Laya.Label;

    hadShare = false;

    findView() {
        this.stationLabel = this.contentSpr.getChildByName("stationLabel") as Laya.Label;
        this.rangeLabel = this.contentSpr.getChildByName("rangeLabel") as Laya.Label;
    };

    initView() {
        this.stationLabel.text = "- 下一站 " + StaticData.getLevelData(StaticData.level).stationInfo.name + " -"
    }

    adapterWindow() {
        super.adapterWindow();
        this.rangeLabel.y += 167 * StaticData.heightOffsetScale;
        this.stationLabel.y += 167 * StaticData.heightOffsetScale;

        this.midleLeadOutSpr.setAldPois(CustomAction.GameOverDialog_Dc);
    }

    yesAction() {
        AldUtil.upload(CustomAction.GameOverDialog_Yes);
        WxADUtil.adOrShare({
            success: () => {
                this.reLiveAction();
            }, fail: () => {
                this.noAction();
            }
        });
    }

    noAction() {
        AldUtil.upload(CustomAction.GameOverDialog_No);
        Laya.Dialog.open(ConfigData.GetCoinTimesDialog);
    }

    private reLiveAction() {
        WxADUtil.hideBannerAd();
        GameManage.manageOwner.reLive();
        this.owner.close();
    }
}