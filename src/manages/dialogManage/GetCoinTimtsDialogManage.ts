import BaseDialogManage from "./BaseDialogManage";
import SkinModle from "../../modle/SkinModle";
import GameHttp from "../../data/GameHttp";
import AldUtil from "../../utils/AldUtil";
import CoinModle from "../../modle/CoinModle";
import WxADUtil from "../../utils/WxADUtil";
import ConfigData from "../../config/ConfigData";
import StaticData from "../../data/StaticData";
import EnumCarSkin from "../../data/EnumHttp";
import EnumSkinHttp from "../../data/EnumHttp";
import EnumSkinUtil from "../../data/EnumHttp";
import GamePlatform from "../../adapter/GamePlatform";

export default class GamaOverAwardDialogManage extends BaseDialogManage {
    titleSpr: Laya.Sprite;
    midleBgSpr: Laya.Sprite;
    midleSpr: Laya.Sprite;
    coinNumberLb: Laya.Label;
    _3TimesBtn: Laya.Sprite;

    timeGetLb: Laya.Label;
    checkBoxSpr: Laya.Image;
    checkBoxSel: Laya.Image;

    isTimesGet = true;
    coinNum: number;

    coinTimes = 1;

    findView() {
        this.titleSpr = this.contentSpr.getChildByName("titleSpr") as Laya.Sprite;
        this.midleBgSpr = this.contentSpr.getChildByName("midleBgSpr") as Laya.Sprite;
        this.midleSpr = this.contentSpr.getChildByName("midleSpr") as Laya.Sprite;

        this.coinNumberLb = this.contentSpr.getChildByName("coinNumberLb") as Laya.Label;

        this._3TimesBtn = this.contentSpr.getChildByName("_3TimesBtn") as Laya.Sprite;

        this.timeGetLb = this.contentSpr.getChildByName("timeGetLb") as Laya.Label;
        this.checkBoxSpr = this.contentSpr.getChildByName("checkBoxSpr") as Laya.Image;
        this.checkBoxSel = this.contentSpr.getChildByName("checkBoxSel") as Laya.Image;
    }

    initView() {
        StaticData.GetCoinTimesNumber = Math.floor(((StaticData.getLevelData(StaticData.level).stationInfo.x - StaticData.remainderRange) / 200));

        this.coinNum = StaticData.GetCoinTimesNumber;
        this.coinTimes = StaticData.GetCoinTimes;

        this.timeGetLb.text = "观看视频" + this.coinTimes + "倍奖励";

        this.coinNumberLb.text = "+" + (this.coinNum * this.coinTimes);

        this._3TimesBtn.on(Laya.Event.CLICK, this, this.onClickAction);
        this.timeGetLb.on(Laya.Event.CLICK, this, this.onClickAction);
        this.checkBoxSpr.on(Laya.Event.CLICK, this, this.onClickAction);
        this.checkBoxSel.on(Laya.Event.CLICK, this, this.onClickAction);
  
    }

    initData() {
        //ald 上传使用皮肤
        AldUtil.upload(EnumSkinUtil.getUseCarSkin())
        AldUtil.upload(EnumSkinUtil.getUseEggSkin())

        //初始化设置  还原皮肤，还原双倍奖励
        SkinModle.freeCarSkinID = "0";
        SkinModle.freeEggSkinID = "0";
        CoinModle.doubleCoin(false);
        //游戏结束接口
        GameHttp.Instance.endGame();
        //阿拉丁游戏结束统计
        AldUtil.stageEnd(false);
    }

    adapterWindow() {
        super.adapterWindow();
        this.titleSpr.y += 124 * StaticData.heightOffsetScale;
        this.midleBgSpr.y += 124 * StaticData.heightOffsetScale;
        this.midleSpr.y += 124 * StaticData.heightOffsetScale;
        this.coinNumberLb.y += 124 * StaticData.heightOffsetScale;

        this._3TimesBtn.y += 170 * StaticData.heightOffsetScale;
        this.timeGetLb.y += 170 * StaticData.heightOffsetScale;
        this.checkBoxSpr.y += 170 * StaticData.heightOffsetScale;
        this.checkBoxSel.y += 170 * StaticData.heightOffsetScale;

        this.scaleBYes(this._3TimesBtn);

        this.horizontalLeadOutSpr.setAldPois(CustomAction.GetCoinTimesDialog_DC);
        this.horizontalLeadOutSpr.init(true);
    }

    onClickAction(e) {
        switch (e.target.name) {
            case "_3TimesBtn":
                this.getCoin();
                break;
            case "timeGetLb":
            case "checkBoxSpr":
            case "checkBoxSel":
                if (this.isTimesGet) {
                    this.isTimesGet = false;
                    this.coinNumberLb.text = "+" + this.coinNum;
                } else {
                    this.isTimesGet = true;
                    this.coinNumberLb.text = "+" + (this.coinNum * this.coinTimes);
                }
                this.checkBoxSel.visible = this.isTimesGet;
                break;
        }
    }

    getCoin() {
        if (this.isTimesGet) {
            WxADUtil.adOrShare({
                success: () => {
                    if (this.coinNum == 3) {
                        AldUtil.upload(CustomAction.GetCoinTimesDialog_3Times);
                    } else if (this.coinNum == 5) {
                        AldUtil.upload(CustomAction.GetCoinTimesDialog_5Times);
                    }

                    this.coinNum = this.coinTimes * this.coinNum;
                    CoinModle.addCoin(this.coinNum);
                    this.skipNextPage();
                },
                fail: () => {
                    AldUtil.upload(CustomAction.GetCoinTimesDialog_NoTimes);
                    CoinModle.addCoin(this.coinNum);
                    this.skipNextPage();
                }
            });
        }else{
            AldUtil.upload(CustomAction.GetCoinTimesDialog_NoTimes);
            CoinModle.addCoin(this.coinNum);
            this.skipNextPage();
        }
    }

    skipNextPage() {
        if (this.coinTimes == 5) {
            Laya.Dialog.open(ConfigData.StartGameDialog);
        } else {
            Laya.Dialog.open(ConfigData.GameFinishDialog);
        }
    }
}