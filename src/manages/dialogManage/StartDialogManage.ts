import BaseDialogManage from "./BaseDialogManage";
import StaticData from "../../data/StaticData";
import ConfigData from "../../config/ConfigData";
import GameManage from "../../manages/GameManage";
import LeadOutUtil from "../../utils/LeadOutUtil";
import AldUtil from "../../utils/AldUtil";
import WxADUtil from "../../utils/WxADUtil";
import CoinModle from "../../modle/CoinModle";
import SignModle from "../../modle/SignModle";
import LocalStorageUtil from "../../utils/LocalStorageUtil";
import GamePlatform from "../../adapter/GamePlatform";
import GameState from "../../data/GameState";
import LeadOutListRunTime from "../../runtimes/LeadOutListRunTime";
import ThreePartyUtil from "../../utils/ThreePartyUtil";

export default class StartDialogManage extends BaseDialogManage {

    private nowStationLb: Laya.Label;

    private startGameSpr: Laya.Sprite;
    private startTxtSpr: Laya.Sprite;

    private stationNameLb: Laya.Label;

    private muneSpr: Laya.Sprite;
    private rankSpr: Laya.Sprite;
    private shopSpr: Laya.Sprite;
    private signSpr: Laya.Sprite;

    private pointSpr: Laya.Sprite;

    private leadOutSpr_1: Laya.Sprite;
    private leadOutSpr_2: Laya.Sprite;
    private leadOutSpr_3: Laya.Sprite;
    private leadOutSpr_4: Laya.Sprite;

    // private btn_onLine: Laya.Box;

    private leadOutSpr1: Laya.Sprite;
    private leadOutSpr2: Laya.Sprite;
    private leadOutSpr3: Laya.Sprite;
    private leadOutSpr4: Laya.Sprite;

    private listGame;

    onEnable(){
        super.onEnable();
        Laya.timer.once(3000,this,()=>{
            ThreePartyUtil.showVidoeAd();
        })
    }

    findView() {
        this.horizontalLeadOutSpr= this.owner.getChildByName("bottomLeadOut") as LeadOutListRunTime;

        this.startGameSpr = this.owner.getChildByName('startGameSpr') as Laya.Sprite;
        this.startTxtSpr = this.owner.getChildByName('startTxtSpr') as Laya.Sprite;

        this.stationNameLb = this.owner.getChildByName("stationNameLb") as Laya.Label;
        this.nowStationLb = this.owner.getChildByName("nowStationLb") as Laya.Label;

        this.shopSpr = this.owner.getChildByName('shopSpr') as Laya.Sprite;
        this.muneSpr = this.owner.getChildByName('muneSpr') as Laya.Sprite;
        this.rankSpr = this.owner.getChildByName('rankSpr') as Laya.Sprite;

        this.leadOutSpr1 = this.owner.getChildByName('leadOutSpr1') as Laya.Sprite;
        this.leadOutSpr2 = this.owner.getChildByName('leadOutSpr2') as Laya.Sprite;
        this.leadOutSpr3 = this.owner.getChildByName('leadOutSpr3') as Laya.Sprite;
        this.leadOutSpr4 = this.owner.getChildByName('leadOutSpr4') as Laya.Sprite;

        // this.btn_onLine = this.owner.getChildByName('btn_onLine') as Laya.Box;


        this.leadOutSpr_1 = this.leadOutSpr1.getChildByName('leadOutSpr_1') as Laya.Sprite;
        this.leadOutSpr_2 = this.leadOutSpr2.getChildByName('leadOutSpr_2') as Laya.Sprite;
        this.leadOutSpr_3 = this.leadOutSpr3.getChildByName('leadOutSpr_3') as Laya.Sprite;
        this.leadOutSpr_4 = this.leadOutSpr4.getChildByName('leadOutSpr_4') as Laya.Sprite;

        this.signSpr = this.owner.getChildByName("signSpr") as Laya.Sprite;

        this.pointSpr = this.signSpr.getChildByName("pointSpr") as Laya.Sprite;
        this.pointSpr.visible = !SignModle.getTodaySigned();
    }

    initView() {
        if (StaticData.level == 0) {
            this.stationNameLb.text = "";
            this.nowStationLb.text = "出发地"
        } else {
            this.stationNameLb.text = "- 第 " + (StaticData.level) + " 站 -";
            // this.nowStationLb.text = StaticData.getLevelData(StaticData.level - 1).stationInfo.name;
        }

        GameManage.manageOwner.gameState = GameState.NOT_START;
      
        this.startGameSpr.on(Laya.Event.CLICK, this, this.onClickAction);
        this.shopSpr.on(Laya.Event.CLICK, this, this.onClickAction);
        this.rankSpr.on(Laya.Event.CLICK, this, this.onClickAction);
        this.muneSpr.on(Laya.Event.CLICK, this, this.onClickAction);
        this.signSpr.on(Laya.Event.CLICK, this, this.onClickAction);
    }

    adapterWindow() {
        super.adapterWindow();

        // this.owner.height = 1107 + StaticData.offY * 2;
        // this.startGameSpr.height = this.owner.height;

        this.startTxtSpr.y+= StaticData.offY;

        this.muneSpr.y += 173 * StaticData.heightOffsetScale;
        this.rankSpr.y += 173 * StaticData.heightOffsetScale;
        this.shopSpr.y += 173 * StaticData.heightOffsetScale;
        this.signSpr.y += 173 * StaticData.heightOffsetScale;

        this.leadOutSpr1.y += 173 * StaticData.heightOffsetScale;
        this.leadOutSpr2.y += 173 * StaticData.heightOffsetScale;
        this.leadOutSpr3.y += 173 * StaticData.heightOffsetScale;
        this.leadOutSpr4.y += 173 * StaticData.heightOffsetScale;

        if (GamePlatform.platformName != GamePlatform.WX) {
            this.rankSpr.visible = false;
            this.muneSpr.y = this.rankSpr.y;
        }
        
        WxADUtil.showStartBannerAd();
    }

    private loadTime = 0;
    setLeadOutData() {
        if(GamePlatform.platformName!=GamePlatform.WX ){
            return;
        }

        this.loadTime++;
        if (this.loadTime > 10) {
            console.log("导出加载失败");
            return;
        }

        if (StaticData.gameList != null && StaticData.getGameListSize() > 4) {
            this.hadLoadGameList = true;
            let cmaskSpr = new Laya.Sprite();
            cmaskSpr.width = 100;
            cmaskSpr.height = 100;
            cmaskSpr.loadImage("images/leadout_icon_bg.png");

            this.listGame = StaticData.getGameListRadom(4);

            if (this.listGame != null) {
                this.leadOutSpr_1.loadImage(this.listGame[0].img, Laya.Handler.create(this, () => {
                    this.leadOutSpr_1.mask = cmaskSpr;
                }));
                this.leadOutSpr_2.loadImage(this.listGame[1].img, Laya.Handler.create(this, () => {
                    this.leadOutSpr_2.mask = cmaskSpr;
                }));
                this.leadOutSpr_3.loadImage(this.listGame[2].img, Laya.Handler.create(this, () => {
                    this.leadOutSpr_3.mask = cmaskSpr;
                }));
                this.leadOutSpr_4.loadImage(this.listGame[3].img, Laya.Handler.create(this, () => {
                    this.leadOutSpr_4.mask = cmaskSpr;
                }));

                this.leadOutSpr_1.on(Laya.Event.CLICK, this, this.onClickAction);
                this.leadOutSpr_2.on(Laya.Event.CLICK, this, this.onClickAction);
                this.leadOutSpr_3.on(Laya.Event.CLICK, this, this.onClickAction);
                this.leadOutSpr_4.on(Laya.Event.CLICK, this, this.onClickAction);

                this.leadOutSpr1.visible = true;
                this.leadOutSpr2.visible = true;
                this.leadOutSpr3.visible = true;
                this.leadOutSpr4.visible = true;
            }
        } else {
            this.hadLoadGameList = false;
            Laya.timer.clearAll(this);
            Laya.timer.once(1000, this, this.setLeadOutData,null,false)
        }
    }


    onClickAction(e) {
        switch (e.target.name) {
            case "startGameSpr":
                // AldUtil.ald_click(CustomAction.StartGameDialog_NoTimes);
                this.startGame();
                break;
            case "shopSpr":
                this.shop();
                break;
            case "muneSpr":
                this.mune();
                break;
            case "rankSpr":
                this.rank();
                break;
            case "signSpr":
                this.sign();
                break;
            case "leadOutSpr_1":
                LeadOutUtil.leadOut(this.listGame[0], CustomAction.StartGameDialog_Dc_1);
                break;
            case "leadOutSpr_2":
                LeadOutUtil.leadOut(this.listGame[1], CustomAction.StartGameDialog_Dc_2);
                break;
            case "leadOutSpr_3":
                LeadOutUtil.leadOut(this.listGame[2], CustomAction.StartGameDialog_Dc_3);
                break;
            case "leadOutSpr_4":
                LeadOutUtil.leadOut(this.listGame[3], CustomAction.StartGameDialog_Dc_4);
                break;
            default:
                break;
        }
    }

    shop() {
        AldUtil.upload(CustomAction.StartGameDialog_Skin);
        Laya.Dialog.open(ConfigData.ShopDialog);
    }

    rank() {
        AldUtil.upload(CustomAction.StartGameDialog_Rank);
        Laya.Dialog.open(ConfigData.RankDialog);
    }

    mune() {
        AldUtil.upload(CustomAction.StartGameDialog_Menu);
        Laya.Dialog.open(ConfigData.MuneDialog);
    }

    sign() {
        AldUtil.upload(CustomAction.StartGameDialog_Sign);
        Laya.Dialog.open(ConfigData.SignDialog);
    }



    // doubleStart() {
    //     if (Laya.Browser.onWeiXin) {
    //         WxADUtil.adOrShare({
    //             success: () => {
    //                 CoinModle.doubleCoin(true);
    //                 this.startGame();
    //             },
    //             fail: () => {
    //                 this.startGame();
    //             },
    //             error: () => {
    //                 this.startGame();
    //             }
    //         });
    //     } else {
    //         CoinModle.doubleCoin(true);
    //         this.startGame();
    //     }
    // }

    startGame() {
        GameManage.manageOwner.gameStart(true);
        this.owner.close();

        //是否是新用户
        if (LocalStorageUtil.getBoolean("isNewUser", true)) {
            LocalStorageUtil.setBoolean("isNewUser", false);
        } else {
            Laya.Dialog.open(ConfigData.SkinFreeDialog);
        }
    }
}