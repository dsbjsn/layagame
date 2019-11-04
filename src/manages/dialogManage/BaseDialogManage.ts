import AwardType from "../../data/beans/AwardType";
import CoinModle from "../../modle/CoinModle";
import ConfigData from "../../config/ConfigData";
import GameManage from "../../manages/GameManage";
import TipsUtil from "../../utils/TipsUtil";
import StaticData from "../../data/StaticData";
import WxADUtil from "../../utils/WxADUtil";
import LeadOutListRunTime from "../../runtimes/LeadOutListRunTime";
import LeadOutGridRunTime from "../../runtimes/LeadOutGridRunTime";
import GamePlatform from "../../adapter/GamePlatform";
import AldUtil from "../../utils/AldUtil";
import DialogModle from "../../modle/DialogModle";
import ViewUtil from "../../utils/ViewUtil";

export default class BaseDialogManage extends Laya.Script {
    private static Instance: BaseDialogManage;
    constructor() {
        super();
        BaseDialogManage.Instance = this;
    }

    public static getInstance() {
        return BaseDialogManage.Instance;
    }

    owner: Laya.Dialog;
    contentSpr: Laya.Sprite;
    no: Laya.Label;
    yes: Laya.Sprite;
    cancel: Laya.Sprite;
    coinBox: Laya.Box;

    midleLeadOutSpr: LeadOutGridRunTime;
    horizontalLeadOutSpr: LeadOutListRunTime;

    isShowBanner = false;

    onEnable() {
        console.log("------------------onEnable");
        DialogModle.addDialog(this.owner.url);

        WxADUtil.hideBannerAd();

        this.contentSpr = this.owner.getChildByName("contentSpr") as Laya.Sprite;
        if (this.contentSpr) {
            this.initActionSprite();
        }
        //获取组件
        this.findView();
        //初始化组件
        this.initView();
        //屏幕适配
        this.adapterWindow();
        //数据初始化
        this.initData();
        //导出位初始化
        this.setLeadOutData();

        if (this.no && !this.isShowBanner) {
            this.setIsShowMisLead(StaticData.isMisLead);
        }

        this.startAni();
        this.initCoin();
    }

    onStart() {
        switch (this.owner.url) {
            case ConfigData.StartGameDialog:
                AldUtil.upload(CustomPage.Page_Start);
                break;
            case ConfigData.GameOverDialog:
                AldUtil.upload(CustomPage.Page_GameOver);
                break;
            case ConfigData.GetCoinTimesDialog:
                AldUtil.upload(CustomPage.Page_GameOverCoin);
                break;
            case ConfigData.GameFinishDialog:
                AldUtil.upload(CustomPage.Page_GameAgain);
                break;


            case ConfigData.AwardDialog:
                AldUtil.upload(CustomPage.Page_GameFinish);
                break;


            case ConfigData.PauseDialog:
                AldUtil.upload(CustomPage.Page_Pause);
                break;
            case ConfigData.MuneDialog:
                AldUtil.upload(CustomPage.Page_Mune);
                break;
            case ConfigData.RankDialog:
                AldUtil.upload(CustomPage.Page_Rank);
                break;
            case ConfigData.ShopDialog:
                AldUtil.upload(CustomPage.Page_Shop);
                break;
            case ConfigData.SignDialog:
                AldUtil.upload(CustomPage.Page_Sign);
                break;


            case ConfigData.SkinFreeDialog:
                AldUtil.upload(CustomPage.Page_FreeSkin);
                break;
            case ConfigData.FLBoxDialog:
                AldUtil.upload(CustomPage.Page_FL);
                break;
            case ConfigData.OthersGamesDialog:
                AldUtil.upload(CustomPage.Page_OthersGame);
                break;
            default: break;
        }
    }

    /**导出游戏位置是否加载完成**/
    hadLoadGameList = false;

    // 组件被禁用时，隐藏banner,清除定时器
    onDisable() {
        DialogModle.popDialog();
        console.log("-------------onDisable");
        Laya.timer.clearAll(this);
        Laya.Tween.clearAll(this);

        WxADUtil.hideBannerAd();
        this.isShowBanner = false;
    }

    onDestroy() {
        console.log("-------------onDestroy");
        Laya.timer.clearAll(this);
        Laya.Tween.clearAll(this);

        this.isShowBanner = false;
        WxADUtil.hideBannerAd();
    }

    findView() { };
    initView() { };

    /**屏幕适配 使用时需先super**/
    adapterWindow() {
        this.owner.height = StaticData.gameHeight;
        this.owner.pos(0, 0);

        if (this.midleLeadOutSpr) {
            this.midleLeadOutSpr.y += 222 * StaticData.heightOffsetScale;
        }

        if (this.yes) {
            this.yes.y += 248 * StaticData.heightOffsetScale;
            this.scaleBYes(this.yes);
        }

        if (this.no) {
            this.no.y += 243 * StaticData.heightOffsetScale;
        }
    }

    scaleBYes(view) {
        Laya.Tween.to(view, { scaleX: 1.1, scaleY: 1.1 }, 500, null, Laya.Handler.create(this, () => {
            this.scaleSYes(view);
        }));
    }

    scaleSYes(view) {
        Laya.Tween.to(view, { scaleX: 1, scaleY: 1 }, 500, null, Laya.Handler.create(this, () => {
            this.scaleBYes(view);
        }));
    }

    initData() { };

    setLeadOutData() { }

    //弹窗内 选择执行事件 统一方法
    yesAction() { }
    //弹窗内 选择不执行事件 统一方法
    noAction() { }
    //弹窗内 选择关闭弹窗 统一方法
    cancelAction() { }

    onClickAction(v) { };

    //设置是否开启误点
    setIsShowMisLead(isShow, view?) {
        let oldY;

        if (isShow) {
            if (view == null) {
                view = this.no;
                oldY = view.y;
                view.y = WxADUtil.getADMidleY() > 1150 ? WxADUtil.getADMidleY() : 1150;
            } else {
                oldY = view.y;
                view.y = StaticData.gameHeight - 200;
            }

            view.visible = true;

            try {
                Laya.timer.clearAll(this);
                Laya.timer.once(1000, this, () => {
                    this.isShowBanner = true;
                    WxADUtil.showBannerAd();
                    Laya.Tween.to(view, { "y": oldY }, 300, null, null, 200);
                })
            } catch (error) { }
        } else {
            this.isShowBanner = true;
            WxADUtil.showBannerAd();
            if (view == null) {
                this.no.visible = false;
                this.no.fontSize = 30;
                this.no.alpha = 0.3;
                Laya.timer.once(1000, this, function () {
                    this.no.visible = true;
                });
            } else {
                view.visible = true;
            }
        }
    }

    private startAni() {
        let goOn = true;
        let id = 1;
        while (goOn) {
            let name = "ani" + id;
            let ani = this.owner[name] as Laya.Animation;
            if (ani != null) {
                ani.play();
                id++;
            } else {
                goOn = false;
            }
        }
    }

    private initActionSprite() {
        this.yes = this.contentSpr.getChildByName("yes") as Laya.Sprite;
        this.no = this.contentSpr.getChildByName("no") as Laya.Label;
        this.cancel = this.contentSpr.getChildByName("cancel") as Laya.Sprite;
        this.midleLeadOutSpr = this.contentSpr.getChildByName("listSpr") as LeadOutGridRunTime;
        this.horizontalLeadOutSpr = this.contentSpr.getChildByName("bottomLeadOut") as LeadOutListRunTime;

        if (this.yes) {
            this.yes.on(Laya.Event.CLICK, this, () => {
                this.yesAction();
            })
        }

        if (this.no) {
            this.no.on(Laya.Event.CLICK, this, () => {
                this.noAction();
            })
        }

        if (this.cancel) {
            this.cancel.on(Laya.Event.CLICK, this, () => {
                this.cancelAction();
            })
        }
    }

    public initCoin() {
        this.coinBox = this.owner.getChildByName("coinBox") as Laya.Box;
        if (this.coinBox != null) {
            //金币布局与微信胶囊按钮对齐
            ViewUtil.adapterPositionJL(this.coinBox);
            this.refreshCoin();
        }
    };

    public refreshCoin() {
        if (this.coinBox != null) {
            let coinLb: Laya.Label = this.coinBox.getChildByName("coinLb") as Laya.Label;
            let coinNum = CoinModle.getCoin();
            if (coinLb != null) {
                if (coinNum >= 10000) {
                    coinLb.text = (coinNum / 1000).toFixed(1) + "k";
                } else {
                    coinLb.text = String(coinNum);
                }
            }
        }
    }
}